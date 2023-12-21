import fs from "fs";
import path from "path";
import { erc20abi } from "./erc20.js";
import config from "../config.js";
import { Web3 } from "web3";
const endpoint = config.JsonRpcProviderUrl.mainnet;
const web3 = new Web3(endpoint);

const tokens = [
  "0xc00e94cb662c3520282e6f5717214004a7f26888",
  "0x0000000000085d4780b73119b644ae5ecd22b376",
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
  "0x956f47f50a910163d8bf957cf5846d573e7f87ca",
  "0x1985365e9f78359a9b6ad760e32412f4a445e862",
  "0xe41d2489571d322189246dafa5ebde1f4699f498",
  "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
  "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
  "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
  "0x514910771af9ca656af840dff83e8264ecf986ca",
  "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
  "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
  "0x6b175474e89094c44da98b954eedeac495271d0f",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
];

async function fetchBalanceOf(token, account) {
  const tokenContract = await new web3.eth.Contract(erc20abi, token);
  const balance = await tokenContract.methods.balanceOf(account).call();
  return balance;
}

async function fetchBalancesOf(account) {
  const result = [];
  for(let i = 0; i < tokens.length ; i++){
    console.log(`fetching ${account} balance of`, tokens[i]);
    const balance = await fetchBalanceOf(tokens[i], account);
    result.push(balance.toString());
  }
  return result;
}

async function main() {
  const whale = config.Whale;
  const balances = await fetchBalancesOf(whale);

  const currentPath = process.cwd();
  const filePath = path.join(currentPath, `./src/static/whale.ts`);
  const jsonString = JSON.stringify(balances);
  const prefix = "export const balances: string[] = ";
  const firstLinePayload = prefix + jsonString;
  const secondLinePayload = `\nexport const whaleAddress: string = \"${whale}\";`
  fs.writeFileSync(filePath, firstLinePayload + secondLinePayload);
  console.log(`${whale} balance written`);
}

main();