/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { CrowdfundFactory } from "../CrowdfundFactory";

export class CrowdfundFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    logic_: string,
    mediaAddress_: string,
    wethAddress_: string,
    overrides?: Overrides
  ): Promise<CrowdfundFactory> {
    return super.deploy(
      logic_,
      mediaAddress_,
      wethAddress_,
      overrides || {}
    ) as Promise<CrowdfundFactory>;
  }
  getDeployTransaction(
    logic_: string,
    mediaAddress_: string,
    wethAddress_: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      logic_,
      mediaAddress_,
      wethAddress_,
      overrides || {}
    );
  }
  attach(address: string): CrowdfundFactory {
    return super.attach(address) as CrowdfundFactory;
  }
  connect(signer: Signer): CrowdfundFactory__factory {
    return super.connect(signer) as CrowdfundFactory__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CrowdfundFactory {
    return new Contract(address, _abi, signerOrProvider) as CrowdfundFactory;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "logic_",
        type: "address",
      },
      {
        internalType: "address",
        name: "mediaAddress_",
        type: "address",
      },
      {
        internalType: "address",
        name: "wethAddress_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "crowdfundProxy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "CrowdfundDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "address payable",
        name: "operator_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fundingCap_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "operatorPercent_",
        type: "uint256",
      },
    ],
    name: "createCrowdfund",
    outputs: [
      {
        internalType: "address",
        name: "crowdfundProxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
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
    name: "parameters",
    outputs: [
      {
        internalType: "address payable",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fundingCap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "operatorPercent",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wethAddress",
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
];

const _bytecode =
  "0x60e060405234801561001057600080fd5b5060405161150638038061150683398101604081905261002f91610072565b6001600160601b0319606093841b811660805291831b821660c05290911b1660a0526100b4565b80516001600160a01b038116811461006d57600080fd5b919050565b600080600060608486031215610086578283fd5b61008f84610056565b925061009d60208501610056565b91506100ab60408501610056565b90509250925092565b60805160601c60a05160601c60c05160601c61141c6100ea6000396000607a0152600060e301526000610128015261141c6000f3fe60806040523480156200001157600080fd5b50600436106200006f5760003560e01c80634f0e0ef311620000565780634f0e0ef314620000dd578063890357301462000105578063d7dfa0dd146200012257600080fd5b806309d3803314620000745780632e59600114620000c6575b600080fd5b6200009c7f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b6200009c620000d73660046200061c565b6200014a565b6200009c7f000000000000000000000000000000000000000000000000000000000000000081565b6200010f62000386565b604051620000bd95949392919062000747565b6200009c7f000000000000000000000000000000000000000000000000000000000000000081565b60006040518060a001604052808573ffffffffffffffffffffffffffffffffffffffff16815260200184815260200183815260200189898080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505090825250604080516020601f8a01819004810282018101909252888152918101919089908990819084018382808284376000920182905250939094525050825181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815560208084015160015560408401516002556060840151805192935062000261926003929190910190620004dc565b50608082015180516200027f916004840191602090910190620004dc565b50506040516200029d91508990899089908990899060200162000803565b60405160208183030381529060405280519060200120604051620002c1906200056b565b8190604051809103906000f5905080158015620002e2573d6000803e3d6000fd5b50600080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018190556002819055909150806200032660038262000579565b6200033660048301600062000579565b50507f5133bb164b64ffa4461bc0c782a5c0e71cdc9d6c6ef5aa9af84f7fd2cd966d8e8189898989896040516200037396959493929190620007a4565b60405180910390a1979650505050505050565b600080546001546002546003805473ffffffffffffffffffffffffffffffffffffffff909416949293919291620003bd9062000857565b80601f0160208091040260200160405190810160405280929190818152602001828054620003eb9062000857565b80156200043c5780601f1062000410576101008083540402835291602001916200043c565b820191906000526020600020905b8154815290600101906020018083116200041e57829003601f168201915b505050505090806004018054620004539062000857565b80601f0160208091040260200160405190810160405280929190818152602001828054620004819062000857565b8015620004d25780601f10620004a657610100808354040283529160200191620004d2565b820191906000526020600020905b815481529060010190602001808311620004b457829003601f168201915b5050505050905085565b828054620004ea9062000857565b90600052602060002090601f0160209004810192826200050e576000855562000559565b82601f106200052957805160ff191683800117855562000559565b8280016001018555821562000559579182015b82811115620005595782518255916020019190600101906200053c565b5062000567929150620005bb565b5090565b610b3980620008ae83390190565b508054620005879062000857565b6000825580601f1062000598575050565b601f016020900490600052602060002090810190620005b89190620005bb565b50565b5b80821115620005675760008155600101620005bc565b60008083601f840112620005e4578182fd5b50813567ffffffffffffffff811115620005fc578182fd5b6020830191508360208285010111156200061557600080fd5b9250929050565b600080600080600080600060a0888a03121562000637578283fd5b873567ffffffffffffffff808211156200064f578485fd5b6200065d8b838c01620005d2565b909950975060208a013591508082111562000676578485fd5b50620006858a828b01620005d2565b909650945050604088013573ffffffffffffffffffffffffffffffffffffffff81168114620006b2578384fd5b969995985093969295946060840135945060809093013592915050565b8183528181602085013750600080602083850101526020601f19601f840116840101905092915050565b60008151808452815b81811015620007205760208185018101518683018201520162000702565b81811115620007325782602083870101525b50601f01601f19169290920160200192915050565b73ffffffffffffffffffffffffffffffffffffffff8616815284602082015283604082015260a0606082015260006200078460a0830185620006f9565b8281036080840152620007988185620006f9565b98975050505050505050565b600073ffffffffffffffffffffffffffffffffffffffff808916835260806020840152620007d760808401888a620006cf565b8381036040850152620007ec818789620006cf565b925050808416606084015250979650505050505050565b60608152600062000819606083018789620006cf565b82810360208401526200082e818688620006cf565b91505073ffffffffffffffffffffffffffffffffffffffff831660408301529695505050505050565b600181811c908216806200086c57607f821691505b60208210811415620008a7577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b5091905056fe60806040523480156200001157600080fd5b50336001600160a01b03166309d380336040518163ffffffff1660e01b8152600401602060405180830381600087803b1580156200004e57600080fd5b505af115801562000063573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000089919062000441565b600160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550336001600160a01b0316634f0e0ef36040518163ffffffff1660e01b8152600401602060405180830381600087803b158015620000eb57600080fd5b505af115801562000100573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000126919062000441565b600260006101000a8154816001600160a01b0302191690836001600160a01b03160217905550336001600160a01b031663d7dfa0dd6040518163ffffffff1660e01b8152600401602060405180830381600087803b1580156200018857600080fd5b505af11580156200019d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001c3919062000441565b600d60006101000a8154816001600160a01b0302191690836001600160a01b03160217905550336001600160a01b031663890357306040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156200022557600080fd5b505af11580156200023a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000264919081019062000467565b600080600360006004600060066000600560008a919050908051906020019062000290929190620002e8565b50508851620002a5919060208b0190620002e8565b5050969096559590955580546001600160a01b039687166101009690960a95860296909502199094169490941790925550506007805460ff191690555062000564565b828054620002f690620004f8565b90600052602060002090601f0160209004810192826200031a576000855562000365565b82601f106200033557805160ff191683800117855562000365565b8280016001018555821562000365579182015b828111156200036557825182559160200191906001019062000348565b506200037392915062000377565b5090565b5b8082111562000373576000815560010162000378565b600082601f8301126200039f578081fd5b81516001600160401b0380821115620003bc57620003bc62000535565b604051601f8301601f19908116603f01168101908282118183101715620003e757620003e762000535565b8160405283815260209250868385880101111562000403578485fd5b8491505b8382101562000426578582018301518183018401529082019062000407565b838211156200043757848385830101525b9695505050505050565b60006020828403121562000453578081fd5b815162000460816200054b565b9392505050565b600080600080600060a086880312156200047f578081fd5b85516200048c816200054b565b60208701516040880151606089015192975090955093506001600160401b0380821115620004b8578283fd5b620004c689838a016200038e565b93506080880151915080821115620004dc578283fd5b50620004eb888289016200038e565b9150509295509295909350565b600181811c908216806200050d57607f821691505b602082108114156200052f57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146200056157600080fd5b50565b6105c580620005746000396000f3fe6080604052600436106100e15760003560e01c80637b4044a01161007f578063ad5c464811610059578063ad5c4648146102ca578063d7dfa0dd146102f7578063dd62ed3e14610324578063e3b2594f1461035c576100e8565b80637b4044a0146102725780637ecebe001461028857806395d89b41146102b5576100e8565b8063200d2ed2116100bb578063200d2ed2146101ca578063313ce567146101f1578063570ca7351461021857806370a0823114610245576100e8565b806306fdde031461012957806309d380331461015457806318160ddd146101a6576100e8565b366100e857005b600d5460405173ffffffffffffffffffffffffffffffffffffffff9091169036600082376000803683855af43d806000843e818015610125578184f35b8184fd5b34801561013557600080fd5b5061013e610372565b60405161014b91906104ca565b60405180910390f35b34801561016057600080fd5b506001546101819073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161014b565b3480156101b257600080fd5b506101bc60095481565b60405190815260200161014b565b3480156101d657600080fd5b506007546101e49060ff1681565b60405161014b9190610489565b3480156101fd57600080fd5b50610206601281565b60405160ff909116815260200161014b565b34801561022457600080fd5b506000546101819073ffffffffffffffffffffffffffffffffffffffff1681565b34801561025157600080fd5b506101bc610260366004610436565b600a6020526000908152604090205481565b34801561027e57600080fd5b506101bc60045481565b34801561029457600080fd5b506101bc6102a3366004610436565b600c6020526000908152604090205481565b3480156102c157600080fd5b5061013e610400565b3480156102d657600080fd5b506002546101819073ffffffffffffffffffffffffffffffffffffffff1681565b34801561030357600080fd5b50600d546101819073ffffffffffffffffffffffffffffffffffffffff1681565b34801561033057600080fd5b506101bc61033f366004610457565b600b60209081526000928352604080842090915290825290205481565b34801561036857600080fd5b506101bc60035481565b6006805461037f9061053b565b80601f01602080910402602001604051908101604052809291908181526020018280546103ab9061053b565b80156103f85780601f106103cd576101008083540402835291602001916103f8565b820191906000526020600020905b8154815290600101906020018083116103db57829003601f168201915b505050505081565b6005805461037f9061053b565b803573ffffffffffffffffffffffffffffffffffffffff8116811461043157600080fd5b919050565b600060208284031215610447578081fd5b6104508261040d565b9392505050565b60008060408385031215610469578081fd5b6104728361040d565b91506104806020840161040d565b90509250929050565b60208101600283106104c4577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b91905290565b6000602080835283518082850152825b818110156104f6578581018301518582016040015282016104da565b818111156105075783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b600181811c9082168061054f57607f821691505b60208210811415610589577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b5091905056fea2646970667358221220e1fbc7a0312b04bdb909a56a77be6a8a8e58eb83fbcbba6452f57452ec34938364736f6c63430008040033a26469706673582212204e7ddac93d47bceffaf9ccfe4681385f14c8313ec653b2cf51b36b3e719d1b1264736f6c63430008040033";