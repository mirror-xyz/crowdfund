/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { CrowdfundStorage } from "../CrowdfundStorage";

export class CrowdfundStorage__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<CrowdfundStorage> {
    return super.deploy(overrides || {}) as Promise<CrowdfundStorage>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CrowdfundStorage {
    return super.attach(address) as CrowdfundStorage;
  }
  connect(signer: Signer): CrowdfundStorage__factory {
    return super.connect(signer) as CrowdfundStorage__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CrowdfundStorage {
    return new Contract(address, _abi, signerOrProvider) as CrowdfundStorage;
  }
}

const _abi = [
  {
    inputs: [],
    name: "WETH",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fundingCap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "logic",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mediaAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "operator",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "operatorPercent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "status",
    outputs: [
      {
        internalType: "enum CrowdfundStorage.Status",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506104d5806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80637b4044a01161008c578063ad5c464811610066578063ad5c46481461020e578063d7dfa0dd1461022e578063dd62ed3e1461024e578063e3b2594f1461027957600080fd5b80637b4044a0146101dd5780637ecebe00146101e657806395d89b411461020657600080fd5b8063200d2ed2116100c8578063200d2ed214610169578063313ce56714610183578063570ca7351461019d57806370a08231146101bd57600080fd5b806306fdde03146100ef57806309d380331461010d57806318160ddd14610152575b600080fd5b6100f7610282565b60405161010491906103da565b60405180910390f35b60015461012d9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610104565b61015b60095481565b604051908152602001610104565b6007546101769060ff1681565b6040516101049190610399565b61018b601281565b60405160ff9091168152602001610104565b60005461012d9073ffffffffffffffffffffffffffffffffffffffff1681565b61015b6101cb366004610346565b600a6020526000908152604090205481565b61015b60045481565b61015b6101f4366004610346565b600c6020526000908152604090205481565b6100f7610310565b60025461012d9073ffffffffffffffffffffffffffffffffffffffff1681565b600d5461012d9073ffffffffffffffffffffffffffffffffffffffff1681565b61015b61025c366004610367565b600b60209081526000928352604080842090915290825290205481565b61015b60035481565b6006805461028f9061044b565b80601f01602080910402602001604051908101604052809291908181526020018280546102bb9061044b565b80156103085780601f106102dd57610100808354040283529160200191610308565b820191906000526020600020905b8154815290600101906020018083116102eb57829003601f168201915b505050505081565b6005805461028f9061044b565b803573ffffffffffffffffffffffffffffffffffffffff8116811461034157600080fd5b919050565b600060208284031215610357578081fd5b6103608261031d565b9392505050565b60008060408385031215610379578081fd5b6103828361031d565b91506103906020840161031d565b90509250929050565b60208101600283106103d4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b91905290565b6000602080835283518082850152825b81811015610406578581018301518582016040015282016103ea565b818111156104175783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b600181811c9082168061045f57607f821691505b60208210811415610499577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b5091905056fea2646970667358221220b3582bfc4df13fc3b20aaf0d7e377b5c1e9c71b8ce5b4c54687f48131d1acab064736f6c63430008040033";