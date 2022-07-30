const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESS_FILE = "../nextjs-smartcontract-lottery/constants/contractAddress.json";
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery/constants/abi.json";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end...");
    updateContractAddresses();
    updateABI();
  }
};

async function updateABI() {
  const lottery = await ethers.getContract("Lottery");
  fs.writeFileSync(FRONT_END_ABI_FILE, lottery.interface.format(ethers.utils.FormatTypes.json));
}

async function updateContractAddresses() {
  const lottery = await ethers.getContract("Lottery");
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf-8"));
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(lottery.address)) {
      currentAddresses[chainId].push(lottery.address);
    }
  } else {
    currentAddresses[chainId] = [lottery.address];
  }
  fs.writeFileSync(FRONT_END_ADDRESS_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ["all", "frontend"];
