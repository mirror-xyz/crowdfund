import { expect } from "chai";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers, waffle } from "hardhat";
import { CrowdfundLogic } from "../ts-types/contracts/CrowdfundLogic";
import { BigNumber, Contract } from "ethers";

let auctionAddress: string;
let mediaAddress: string;

let contentHex: string;
let contentHash: string;
let contentHashBytes: any;
let metadataHex: string;
let metadataHash: string;
let metadataHashBytes: any;

let tokenURI = "www.example.com";
let metadataURI = "www.example2.com";

let name = "Test Crowdfund";
let symbol = "TEST";
let CROWDFUND_STATUES = {
  FUNDING: "FUNDING",
};

const fundingCap = "9000000000000000000"; // 9 ETH

const TOKEN_SCALE = 1000;

const STATUS_MAP = ["FUNDING", "TRADING"];

const { provider } = waffle;

describe("Crowdfund via Proxy from Factory", () => {
  let deployerWallet;
  let contributor;
  let secondContributor;
  let creatorWallet;
  let funder;
  let fundingRecipient;

  before(async () => {
    [
      deployerWallet,
      contributor,
      secondContributor,
      creatorWallet,
      funder,
      fundingRecipient,
    ] = await ethers.getSigners();
  });

  describe("the crowdfund logic is deployed", () => {
    let logic, factory, proxy, callableProxy;

    describe("when deployed with appropriate arguments", () => {
      let crowdfund: CrowdfundLogic;

      before(async () => {
        const CrowdfundLogic = await ethers.getContractFactory(
          "CrowdfundLogic"
        );
        logic = await CrowdfundLogic.deploy();
        await logic.deployed();
      });

      describe("when the Crowdfund Factory is deployed", () => {
        beforeEach(async () => {
          const CrowdfundFactory = await ethers.getContractFactory(
            "CrowdfundFactory"
          );

          const deployment = await CrowdfundFactory.deploy(logic.address);
          factory = await deployment.deployed();
        });

        it("has the correct references to other contracts", async () => {
          expect(await factory.logic()).to.eq(logic.address);
        });

        describe("and a proxy is created through the factory", () => {
          let deploymentEvent, gasUsed;

          beforeEach(async () => {
            const operatorEquity = 5;
            const deployTx = await factory.createCrowdfund(
              name,
              symbol,
              creatorWallet.address,
              fundingRecipient.address,
              BigNumber.from(fundingCap),
              BigNumber.from(operatorEquity)
            );
            const receipt = await deployTx.wait();
            gasUsed = receipt.gasUsed;

            deploymentEvent = factory.interface.parseLog(receipt.events[0]);

            // Compute address.
            const constructorArgs = ethers.utils.defaultAbiCoder.encode(
              ["string", "string", "address"],
              [name, symbol, creatorWallet.address]
            );
            const salt = ethers.utils.keccak256(constructorArgs);
            const proxyBytecode = (
              await ethers.getContractFactory("CrowdfundProxy")
            ).bytecode;
            const codeHash = ethers.utils.keccak256(proxyBytecode);
            const proxyAddress = await ethers.utils.getCreate2Address(
              factory.address,
              salt,
              codeHash
            );

            proxy = await (
              await ethers.getContractAt("CrowdfundProxy", proxyAddress)
            ).deployed();

            callableProxy = await (
              await ethers.getContractAt("CrowdfundLogic", proxyAddress)
            ).deployed();
          });

          it("creates an event log for the deployment", async () => {
            const eventData = deploymentEvent.args;
            expect(eventData.crowdfundProxy).to.eq(proxy.address);
            expect(eventData.name).to.eq(name);
            expect(eventData.symbol).to.eq(symbol);
            expect(eventData.operator).to.eq(creatorWallet.address);
          });

          it("deletes parameters used during deployment", async () => {
            const {
              name,
              symbol,
              operator,
              fundingCap,
              operatorPercent,
            } = await factory.parameters();

            expect(name).to.eq("");
            expect(symbol).to.eq("");
            expect(operator).to.eq(
              "0x0000000000000000000000000000000000000000"
            );
            expect(fundingCap.toString()).to.eq("0");
            expect(operatorPercent.toString()).to.eq("0");
          });

          it("it deploys a proxy with the correct data", async () => {
            expect(await proxy.logic()).to.eq(logic.address);
            expect(await callableProxy.name()).to.eq(name);
            expect(await callableProxy.symbol()).to.eq(symbol);
            expect(await callableProxy.operator()).to.eq(creatorWallet.address);
            expect(await callableProxy.operatorPercent()).to.eq("5");
          });

          it("uses 525031 gas", () => {
            expect(gasUsed.toString()).to.eq("525031");
          });

          describe("#redeemableFromTokens", () => {
            describe("scenarios", () => {
              // Used wolframalpha for these.
              let scenarios = [
                {
                  contributed: "7.342",
                  redeemed: "1.2",
                  fundsAdded: "0",
                  tokens: "2141",
                  expected: "2.141",
                },
                {
                  contributed: "7.342",
                  redeemed: "1.2",
                  fundsAdded: "1",
                  tokens: "2141",
                  expected: "2.489583523282318463",
                },
                {
                  contributed: "0.9432951",
                  redeemed: "0.4500796", // token supply is 493.2155
                  fundsAdded: "8.4494762", // balance is 8.9426917
                  tokens: "1029.1585",
                  expected: "18.66009315590132508",
                },
                {
                  contributed: "7.0461205",
                  redeemed: "0.17318647", // token supply is 6872.93403
                  fundsAdded: "44.15245", // balance is 51.02538403
                  tokens: "287.05264",
                  expected: "2.13110894545067228",
                },
              ];

              for (let i = 0; i < scenarios.length; i++) {
                const {
                  contributed,
                  redeemed,
                  tokens,
                  expected,
                  fundsAdded,
                } = scenarios[i];

                describe(`when ${contributed} ETH was contributed`, () => {
                  beforeEach(async () => {
                    await callableProxy
                      .connect(funder)
                      .contribute(
                        funder.address,
                        ethers.utils.parseEther(contributed),
                        {
                          value: ethers.utils.parseEther(contributed),
                        }
                      );
                  });

                  it("increases the contract's balance by that amount", async () => {
                    const newContractBalance = await provider.getBalance(
                      callableProxy.address
                    );

                    expect(newContractBalance.toString()).eq(
                      ethers.utils.parseEther(contributed).toString()
                    );
                  });

                  it("increases the contract's total supply", async () => {
                    const tokenAmount = ethers.utils
                      .parseEther(contributed)
                      .mul(TOKEN_SCALE)
                      .toString();

                    expect((await callableProxy.totalSupply()).toString()).eq(
                      tokenAmount
                    );
                  });

                  describe(`and ${redeemed} tokens were redeemed`, () => {
                    beforeEach(async () => {
                      await callableProxy
                        .connect(funder)
                        .redeem(
                          ethers.utils
                            .parseEther(redeemed)
                            .mul(TOKEN_SCALE)
                            .toString()
                        );
                    });

                    it("decreases the contract's balance by that amount", async () => {
                      const newContractBalance = await provider.getBalance(
                        callableProxy.address
                      );

                      const expected = ethers.utils
                        .parseEther(contributed)
                        .sub(ethers.utils.parseEther(redeemed));

                      expect(newContractBalance.toString()).eq(
                        expected.toString()
                      );
                    });

                    describe(`and ${fundsAdded} ETH was added`, () => {
                      beforeEach(async () => {
                        await funder.sendTransaction({
                          to: callableProxy.address,
                          value: ethers.utils.parseEther(fundsAdded),
                        });
                      });

                      describe(`and it is called with ${tokens} tokens`, () => {
                        beforeEach(async () => {
                          // Sanity check the total supply.
                          const expected = ethers.utils
                            .parseEther(contributed)
                            .sub(ethers.utils.parseEther(redeemed))
                            // NOTE: Total supply does not increase from funds added!
                            .mul(TOKEN_SCALE);
                          expect(
                            (await callableProxy.totalSupply()).toString()
                          ).eq(expected.toString());
                        });

                        it(`returns ${expected} ETH`, async () => {
                          const toBurn = ethers.utils
                            .parseEther(tokens)
                            .toString();
                          const expectedETH = ethers.utils
                            .parseEther(expected)
                            .toString();
                          expect(
                            await callableProxy.redeemableFromTokens(toBurn)
                          ).to.eq(expectedETH);
                        });
                      });
                    });
                  });
                });
              }
            });
          });

          describe("when a contributor attempts to contribute 2 ETH", () => {
            let originalBalance;
            let fundingAmount = "2000000000000000000"; // 2 ETH in wei
            let tx;
            let receipt;
            let gasUsed: BigNumber;
            let gasPrice: BigNumber;

            beforeEach(async () => {
              originalBalance = await provider.getBalance(contributor.address);
              tx = await callableProxy
                .connect(contributor)
                .contribute(contributor.address, fundingAmount, {
                  value: fundingAmount,
                });
              receipt = await tx.wait();
              gasUsed = receipt.gasUsed;
              gasPrice = tx.gasPrice;
            });

            it("uses 92419 gas", () => {
              expect(gasUsed.toString()).to.eq("92419");
            });

            it("increases the contract's balance by 2 ETH", async () => {
              const contractBalance = await provider.getBalance(proxy.address);
              expect(contractBalance.toString()).to.eq(fundingAmount);
            });

            it("decrease the contributor's ETH balance by 2 ETH plus gas for the tx", async () => {
              const ethUsedForTX = gasPrice.mul(gasUsed);
              const totalCost = ethUsedForTX.add(fundingAmount);
              const expectedBalance = originalBalance.sub(totalCost);
              const newBalance = await provider.getBalance(contributor.address);

              expect(newBalance.toString()).to.eq(expectedBalance.toString());
            });

            it("mints tokens for the contributor equal to the amount of ETH given, multiplied by the token scale factor", async () => {
              const tokenBalance = await callableProxy.balanceOf(
                contributor.address
              );
              const expectedBalance = BigNumber.from(fundingAmount).mul(
                TOKEN_SCALE
              );
              expect(tokenBalance.toString()).to.eq(expectedBalance);
            });

            it("grants them 2 ETH redeemable", async () => {
              const tokenBalance = await callableProxy.balanceOf(
                contributor.address
              );
              const redeemable = await callableProxy.redeemableFromTokens(
                tokenBalance
              );
              expect(redeemable.toString()).to.eq(fundingAmount);
            });

            it("emits a Transfer and Contribution event", async () => {
              const logs = await provider.getLogs({});

              expect(logs.length).eq(2);

              const transferEvent = callableProxy.interface.parseLog(logs[0]);
              const contributionEvent = callableProxy.interface.parseLog(
                logs[1]
              );

              expect(transferEvent.name).to.eq("Transfer");
              expect(contributionEvent.name).to.eq("Contribution");

              expect(contributionEvent.args[0]).to.eq(contributor.address);
              expect(contributionEvent.args[1].toString()).to.eq(fundingAmount);
            });

            describe("when the contributor attempts to redeem 1.2 ETH worth their contributions", () => {
              const withdrawAmount = "1200000000000000000"; // 1.2 ETH in wei
              const tokenAmount = BigNumber.from(withdrawAmount).mul(
                TOKEN_SCALE
              );
              const remainingETH = "800000000000000000";
              const remainingSupply = BigNumber.from(remainingETH).mul(
                TOKEN_SCALE
              );
              let originalTokenBalance;
              let originalETHBalance;
              let originalContractBalance;

              beforeEach(async () => {
                originalContractBalance = await provider.getBalance(
                  callableProxy.address
                );
                originalETHBalance = await provider.getBalance(
                  contributor.address
                );
                originalTokenBalance = await callableProxy
                  .connect(contributor)
                  .balanceOf(contributor.address);

                tx = await callableProxy
                  .connect(contributor)
                  .redeem(tokenAmount);

                receipt = await tx.wait();

                gasUsed = receipt.gasUsed;
                gasPrice = tx.gasPrice;
              });

              it(`burns their tokens, so that their token balance is ${remainingSupply.toString()}`, async () => {
                const newTokenBalance = await callableProxy
                  .connect(contributor)
                  .balanceOf(contributor.address);

                expect(newTokenBalance.toString()).to.eq(
                  remainingSupply.toString()
                );
              });

              it(`totalSupply() is now ${remainingSupply.toString()}`, async () => {
                const supply = await callableProxy.totalSupply();

                expect(supply.toString()).to.eq(remainingSupply.toString());
              });

              it("decreases the contract's balance by 1.2 ETH", async () => {
                const newContractBalance = await provider.getBalance(
                  callableProxy.address
                );

                expect(newContractBalance.toString()).to.eq(
                  BigNumber.from(originalContractBalance)
                    .sub(withdrawAmount)
                    .toString()
                );
              });

              it("increases the sender's balance by 1.2 ETH, minus gas", async () => {
                const newEthBalance = await provider.getBalance(
                  contributor.address
                );
                const ethUsedForTX = gasPrice.mul(gasUsed);
                const expectedBalance = originalETHBalance
                  .add(withdrawAmount)
                  .sub(ethUsedForTX);

                expect(newEthBalance.toString()).to.eq(
                  expectedBalance.toString()
                );
              });

              it("uses 50424 gas", () => {
                expect(gasUsed.toString()).to.eq("50424");
              });

              it("emits a Transfer and Withdrawal event", async () => {
                const logs = await provider.getLogs({});

                expect(logs.length).eq(2);

                const transferEvent = callableProxy.interface.parseLog(logs[0]);
                const redeemEvent = callableProxy.interface.parseLog(logs[1]);

                expect(transferEvent.name).to.eq("Transfer");
                expect(redeemEvent.name).to.eq("Redeemed");

                expect(redeemEvent.args[0]).to.eq(contributor.address);
                expect(redeemEvent.args[1].toString()).to.eq(withdrawAmount);
              });

              describe("when another contributor adds 3.3 ETH", () => {
                let originalBalance;
                let fundingAmount = "3300000000000000000"; // 2 ETH in wei
                let tokenAmount = BigNumber.from(fundingAmount).mul(
                  TOKEN_SCALE
                );
                let expectedSupply = BigNumber.from("4100000000000000000").mul(
                  TOKEN_SCALE
                );
                let tx;
                let receipt;
                let gasUsed: BigNumber;
                let gasPrice: BigNumber;

                beforeEach(async () => {
                  originalBalance = await provider.getBalance(
                    secondContributor.address
                  );

                  tx = await callableProxy
                    .connect(secondContributor)
                    .contribute(secondContributor.address, fundingAmount, {
                      value: fundingAmount,
                    });
                  receipt = await tx.wait();

                  gasUsed = receipt.gasUsed;
                  gasPrice = tx.gasPrice;
                });

                it("uses 58207 gas", () => {
                  expect(gasUsed.toString()).to.eq("58207");
                });

                it("increases the contract's balance by 3.3 ETH", async () => {
                  const contractBalance = await provider.getBalance(
                    callableProxy.address
                  );
                  expect(contractBalance.toString()).to.eq(
                    BigNumber.from("800000000000000000")
                      .add(fundingAmount)
                      .toString()
                  );
                });

                it("decrease the contributor's ETH balance by 3.3 ETH plus gas for the tx", async () => {
                  const ethUsedForTX = gasPrice.mul(gasUsed);
                  const totalCost = ethUsedForTX.add(fundingAmount);
                  const expectedBalance = originalBalance.sub(totalCost);
                  const newBalance = await provider.getBalance(
                    secondContributor.address
                  );

                  expect(newBalance.toString()).to.eq(
                    expectedBalance.toString()
                  );
                });

                it("mints tokens for the contributor equal to the amount of ETH given", async () => {
                  const tokenBalance = await callableProxy.balanceOf(
                    secondContributor.address
                  );
                  expect(tokenBalance.toString()).to.eq(tokenAmount.toString());
                });

                it("grants them 3.3 ETH redeemable", async () => {
                  const tokenBalance = await callableProxy.balanceOf(
                    secondContributor.address
                  );
                  const redeemable = await callableProxy.redeemableFromTokens(
                    tokenBalance
                  );
                  expect(redeemable.toString()).to.eq(fundingAmount);
                });

                it("emits a Transfer and Contribution event", async () => {
                  const logs = await provider.getLogs({});

                  expect(logs.length).eq(2);

                  const transferEvent = callableProxy.interface.parseLog(
                    logs[0]
                  );
                  const contributionEvent = callableProxy.interface.parseLog(
                    logs[1]
                  );

                  expect(transferEvent.name).to.eq("Transfer");
                  expect(contributionEvent.name).to.eq("Contribution");

                  expect(contributionEvent.args[0]).to.eq(
                    secondContributor.address
                  );
                  expect(contributionEvent.args[1].toString()).to.eq(
                    fundingAmount
                  );
                });

                it(`totalSupply() is now ${expectedSupply.toString()}`, async () => {
                  const supply = await callableProxy.totalSupply();

                  expect(supply.toString()).to.eq(expectedSupply.toString());
                });

                describe("when the contributor attempts to withdraw 4 ETH worth from the contract", () => {
                  let tokenAmount = BigNumber.from("4000000000000000000").mul(
                    TOKEN_SCALE
                  );

                  it("reverts the transaction", async () => {
                    await expect(
                      callableProxy
                        .connect(secondContributor)
                        .redeem(tokenAmount)
                    ).to.be.revertedWith("Insufficient balance");
                  });
                });

                describe("when the contributor attempts to withdraw .2 ETH from their contributions", () => {
                  const withdrawAmount = "200000000000000000"; // 0.2 ETH in wei
                  const tokenAmount = BigNumber.from(withdrawAmount).mul(
                    TOKEN_SCALE
                  );
                  const remainingBalance = BigNumber.from(
                    "3100000000000000000"
                  ).mul(TOKEN_SCALE);
                  const expectedSupply = BigNumber.from(
                    "3900000000000000000"
                  ).mul(TOKEN_SCALE);
                  let originalTokenBalance;
                  let originalETHBalance;
                  let originalContractBalance;

                  beforeEach(async () => {
                    originalContractBalance = await provider.getBalance(
                      callableProxy.address
                    );
                    originalETHBalance = await provider.getBalance(
                      secondContributor.address
                    );
                    originalTokenBalance = await callableProxy
                      .connect(secondContributor)
                      .balanceOf(secondContributor.address);

                    tx = await callableProxy
                      .connect(secondContributor)
                      .redeem(tokenAmount);

                    receipt = await tx.wait();

                    gasUsed = receipt.gasUsed;
                    gasPrice = tx.gasPrice;
                  });

                  it(`burns their tokens, so that their token balance is ${remainingBalance.toString()}`, async () => {
                    const newTokenBalance = await callableProxy
                      .connect(secondContributor)
                      .balanceOf(secondContributor.address);

                    expect(newTokenBalance.toString()).to.eq(
                      remainingBalance.toString()
                    );
                  });

                  it("decreases the contract's balance by 0.2 ETH", async () => {
                    const newContractBalance = await provider.getBalance(
                      callableProxy.address
                    );

                    expect(newContractBalance.toString()).to.eq(
                      BigNumber.from(originalContractBalance)
                        .sub(withdrawAmount)
                        .toString()
                    );
                  });

                  it("increases the sender's balance by 0.2 ETH, minus gas", async () => {
                    const newEthBalance = await provider.getBalance(
                      secondContributor.address
                    );
                    const ethUsedForTX = gasPrice.mul(gasUsed);
                    const expectedBalance = originalETHBalance
                      .add(withdrawAmount)
                      .sub(ethUsedForTX);

                    expect(newEthBalance.toString()).to.eq(
                      expectedBalance.toString()
                    );
                  });

                  it("uses 50424 gas", () => {
                    expect(gasUsed.toString()).to.eq("50424");
                  });

                  it("emits a Transfer and Withdrawal event", async () => {
                    const logs = await provider.getLogs({});

                    expect(logs.length).eq(2);

                    const transferEvent = callableProxy.interface.parseLog(
                      logs[0]
                    );
                    const redeemEvent = callableProxy.interface.parseLog(
                      logs[1]
                    );

                    expect(transferEvent.name).to.eq("Transfer");
                    expect(redeemEvent.name).to.eq("Redeemed");

                    expect(redeemEvent.args[0]).to.eq(
                      secondContributor.address
                    );
                    expect(redeemEvent.args[1].toString()).to.eq(
                      withdrawAmount
                    );
                  });

                  it(`totalSupply() is now ${expectedSupply.toString()}`, async () => {
                    const supply = await callableProxy.totalSupply();
                    expect(supply.toString()).to.eq(expectedSupply.toString());
                  });

                  describe("when the operator closes funding", () => {
                    let originalFundsRecipientBalance;
                    let originalContractBalance;
                    let tx;
                    let ethUsedForTX;

                    beforeEach(async () => {
                      originalFundsRecipientBalance = await provider.getBalance(
                        fundingRecipient.address
                      );
                      originalContractBalance = await provider.getBalance(
                        callableProxy.address
                      );
                      tx = await callableProxy
                        .connect(creatorWallet)
                        .closeFunding();

                      const receipt = await tx.wait();
                      const { gasPrice } = tx;
                      ethUsedForTX = gasPrice.mul(receipt.gasUsed);
                    });

                    it("mints 5 percent of tokens to the operator", async () => {
                      const operatorEquity = (await callableProxy.totalSupply())
                        .mul(5)
                        .div(100);
                      const operatorTokenBalance = await callableProxy.balanceOf(
                        creatorWallet.address
                      );
                      expect(operatorTokenBalance.toString()).to.eq(
                        operatorEquity.toString()
                      );
                    });

                    it("transfers funds out of the crowdfund", async () => {
                      const updatedContractBalance = await provider.getBalance(
                        callableProxy.address
                      );
                      expect(updatedContractBalance.toString()).to.eq("0");
                    });

                    it("transfers the ETH to the funds recipient", async () => {
                      const updatedRecipientBalance = await provider.getBalance(
                        fundingRecipient.address
                      );
                      const expectedBalance = originalFundsRecipientBalance.add(
                        originalContractBalance
                      );

                      expect(updatedRecipientBalance.toString()).to.eq(
                        expectedBalance.toString()
                      );
                    });

                    it("emits a Funding Closed event", async () => {
                      const logs = await provider.getLogs({});

                      const event = callableProxy.interface.parseLog(logs[1]);

                      expect(event.name).to.eq("FundingClosed");

                      expect(event.args[0]).to.eq(
                        // The amount raised
                        "3900000000000000000"
                      );
                      expect(event.args[1]).to.eq(
                        // Tokens for Operator
                        "205263157894736842105"
                      );
                    });

                    it("sets the status to TRADING", async () => {
                      const status = await callableProxy.status();
                      expect(STATUS_MAP[status]).to.eq("TRADING");
                    });

                    describe("when a contribution is attempted after funding is closed", () => {
                      it("reverts the transaction", async () => {
                        await expect(
                          callableProxy
                            .connect(contributor)
                            .contribute(contributor.address, 10, { value: 10 })
                        ).to.be.revertedWith("Funding must be open");
                      });
                    });

                    describe("and 1.75 ETH is added to the crowdfund", () => {
                      beforeEach(async () => {
                        originalContractBalance = await provider.getBalance(
                          callableProxy.address
                        );

                        await funder.sendTransaction({
                          to: callableProxy.address,
                          value: ethers.utils.parseEther("1.75"),
                        });
                      });

                      it("increases the contract's balance by that amount", async () => {
                        const newContractBalance = await provider.getBalance(
                          callableProxy.address
                        );

                        expect(newContractBalance.toString()).eq(
                          originalContractBalance
                            .add(ethers.utils.parseEther("1.75"))
                            .toString()
                        );
                      });
                    });
                  });
                });
              });
            });
          });

          describe("when a contributor attempts to contribute more than the funding cap", () => {
            let overfundingAmount = "20000000000000000000"; // 20 ETH
            let amountBefore;
            let amountAfter;
            let receipt;

            it("refunds the excess ETH while keeping the amount less the funding cap", async () => {
              // Check that the crowdfund does not have any ETH in to start with.
              amountBefore = await provider.getBalance(callableProxy.address);
              expect(amountBefore.toString()).to.eq("0");
              // Sanity check that the contributor doesn't have any tokens to start with.
              const tokenBalanceBefore = await callableProxy.balanceOf(
                contributor.address
              );
              expect(tokenBalanceBefore.toString()).to.eq("0");
              const balanceBefore = await provider.getBalance(
                contributor.address
              );
              const tx = await callableProxy
                .connect(contributor)
                .contribute(contributor.address, overfundingAmount, {
                  value: overfundingAmount,
                });
              receipt = await tx.wait();
              amountAfter = await provider.getBalance(callableProxy.address);
              const balanceAfter = await provider.getBalance(
                contributor.address
              );

              expect(amountAfter.toString()).to.eq(fundingCap);
              // 20 ETH sent in, 9 ETH retained, 11 sent back. Therefore,
              // Balance should be funding cap, minus gas costs.
              expect(
                balanceBefore
                  .sub(balanceAfter)
                  .sub(receipt.gasUsed.mul(tx.gasPrice))
                  .toString()
              ).to.eq(fundingCap);

              // Check that the user's token balance is correct.
              const tokenBalance = await callableProxy.balanceOf(
                contributor.address
              );
              expect(tokenBalance.toString()).to.eq(
                BigNumber.from(fundingCap).mul(TOKEN_SCALE).toString()
              );
            });

            it("uses 101868 gas", () => {
              expect(receipt.gasUsed.toString()).to.eq("101868");
            });

            describe("when a contributor adds ETH once the funding cap is already reached", () => {
              it("reverts the transaction", async () => {
                const tx = await callableProxy
                  .connect(contributor)
                  .contribute(contributor.address, overfundingAmount, {
                    value: overfundingAmount,
                  });
                receipt = await tx.wait();
                // Now the funding amount should be equal to the cap.
                amountBefore = await provider.getBalance(callableProxy.address);
                // Sanity check the above.
                expect(amountBefore.toString()).to.eq(fundingCap);
                // Attempt to contribute 1 wei more.
                const txPromise = callableProxy
                  .connect(contributor)
                  // Even a minute number will trigger the revert!
                  .contribute(contributor.address, "1", { value: "1" });
                // Expect that to revert with a helpful error.
                await expect(txPromise).to.be.revertedWith(
                  "Funding cap already reached"
                );
                // Sanity check that the amount afterwards is still the funding cap.
                amountAfter = await provider.getBalance(callableProxy.address);
                expect(amountAfter.toString()).to.eq(fundingCap);
              });
            });
          });
        });
      });
    });
  });
});
