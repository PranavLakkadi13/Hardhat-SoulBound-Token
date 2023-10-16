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
        });
        it("should increase the token balance when an Token is minted", async () => {
            const prebalance = await Contract.getTokenCount();
            assert.equal(prebalance.toString(),"0")
            await Contract.safeMint(accounts[1].address, "Hello");  
            const postbalance = await Contract.getTokenCount();
            assert.equal(postbalance.toString(), "1");
        });
        it("updates the balanceOf the user address", async () => {
            await Contract.safeMint(accounts[1].address, "Hello");
            const balanceOf = await Contract.balanceOf(accounts[1].address);
            assert.equal(balanceOf.toString(),"1");
            const ownerOf = await Contract.ownerOf("0");
            assert.equal(ownerOf.toString(),accounts[1].address )
        });
        it("should revert if the minting address is address 0", async () => {
            await expect(Contract.safeMint(ethers.constants.AddressZero, "Hello")).to.be.revertedWith("ERC721: mint to the zero address");
        });
        it("Should update the token URIs Mapping", async () => {
            await Contract.safeMint(accounts[1].address, "Hello");
            const tokenURI = await Contract.tokenURI("0");
            assert.equal(tokenURI.toString(),"Hello");
        });
        it("Emits an Event", async () => {
            await expect(Contract.safeMint(accounts[1].address, "Hello")).to.emit(Contract,"Transfer").withArgs(ethers.constants.AddressZero,accounts[1].address,0);
            // The below event test will result in the updated tokencounter to 1
            await expect(Contract.safeMint(accounts[1].address, "Hello123")).to.emit(Contract,"Attest").withArgs(accounts[1].address,1);
        })
    });

    // describe("Burn function", () => {
    //     it()
    // })
});
