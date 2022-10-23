const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const {
	developmentChains,
	INITIAL_SUPPLY,
	TOKEN_NAME,
	TOKEN_SYMBOL,
} = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
	? describe.skip
	: describe("Our Token Staging tests", async () => {
			const chainId = network.config.chainId
			let token, deployer, user1

			beforeEach(async () => {
				const accounts = await getNamedAccounts()
				deployer = accounts.deployer
				user1 = accounts.user1 // change private key since wallet already has allownace unless cleared after first run
				user2 = accounts.user2
				user3 = accounts.user3
				user4 = accounts.user4
				user5 = accounts.user5
				//add more accounts here so each allowance test has a fresh new wallet
				token = await ethers.getContract("OurToken", deployer)
			})
			it("deploys contract", async () => {
				assert(token.address)
			})

			describe("Constructor", async () => {
				it("initializes supply, name, and symbol correctly", async () => {
					const supplyResult = await token.totalSupply() //
					const nameResult = await token.name() // string
					const symbolResult = await token.symbol() //
					assert.equal(supplyResult, INITIAL_SUPPLY)
					assert.equal(nameResult, TOKEN_NAME)
					assert.equal(symbolResult, TOKEN_SYMBOL)
				})
			})
			describe("transfers", async () => {
				it("transfers the tokens", async () => {
					const transferAmount = ethers.utils.parseEther("10")
					await token.transfer(user1, transferAmount)
					const user1Balance = await token.balanceOf(user1)
					assert.equal(transferAmount, user1Balance.toString())
				})
				it("emits transfer event when transfer occurs", async () => {
					const transferAmount = ethers.utils.parseEther("10")
					await expect(token.transfer(user1, transferAmount))
						.to.emit(token, "Transfer")
						.withArgs(deployer, user1, transferAmount)
				})
			})
			describe("allowance", async () => {
				beforeEach(async () => {
					playerToken = await ethers.getContract("OurToken", user1)
				})
				it("should approve other address to spend tokens", async () => {
					const transferAmount = ethers.utils.parseEther("10")
					await token.approve(user1, transferAmount)
					await playerToken.transferFrom(deployer, user1, transferAmount)
					const user1Balance = await token.balanceOf(user1)
					assert.equal(transferAmount, user1Balance.toString())
				})
				it("doesnt allow unapproved members to do transfers", async () => {
					const transferAmount = ethers.utils.parseEther("10")
					await expect(
						playerToken.transferFrom(deployer, user1, transferAmount)
					).to.be.revertedWith("ERC20: insufficient allowance")
				})
				it("emits an approval event when approval occurs", async () => {
					const transferAmount = ethers.utils.parseEther("10")
					await expect(token.approve(user1, transferAmount))
						.to.emit(token, "Approval")
						.withArgs(deployer, user1, transferAmount)
				})
				it("shows allowance being set correctly", async () => {
					//
					const transferAmount = ethers.utils.parseEther("10")
					await token.approve(user1, transferAmount)
					const user1Allowance = await playerToken.allowance(deployer, user1)
					assert.equal(transferAmount, user1Allowance.toString())
				})
				it("wont allow us to go over the allowance", async () => {
					const transferAmountApproval = ethers.utils.parseEther("9")
					const transferAmount = ethers.utils.parseEther("10")
					await token.approve(user1, transferAmountApproval)
					await expect(
						playerToken.transferFrom(deployer, user1, transferAmount)
					).to.be.revertedWith("ERC20: insufficient allowance")
				})
			})
	  })
