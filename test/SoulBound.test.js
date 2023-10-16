const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("SoulBound Token", () => {
    let Contract;
    let deployer;
    let accounts;
    beforeEach(async () => {
      deployer = (await getNamedAccounts()).deployer;

      await deployments.fixture(["SoulBound"]);

    //   await deployments.get("SoulBoundToken");
      
      Contract = await ethers.getContract('SoulBoundToken');
      accounts = await ethers.getSigners();
    });

    describe("SafeMint Function", () => {
        it("Checks if only the owner can mint the token", async () => {
            await expect(Contract.connect(accounts[1]).safeMint(accounts[1].address, "Hello")).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("only owner can mint", async () => {
          await Contract.safeMint(accounts[1].address, "Hello");
        })
    });
});
