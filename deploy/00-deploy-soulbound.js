const { network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const args = [];

  const SoulboundToken = await deploy("SoulBoundToken", {
    from: deployer,
    args: args, 
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`The contract is deployed at ${SoulboundToken.address}`)
};

module.exports.tags = ["SoulBound"];