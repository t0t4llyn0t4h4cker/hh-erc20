const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const {
	developmentChains,
	INITIAL_SUPPLY,
	TOKEN_NAME,
	TOKEN_SYMBOL,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Our Token Unit tests", async () => {
			const chainId = network.config.chainId
			let token, deployer, user1

			beforeEach(async () => {
				const accounts = await getNamedAccounts()
				deployer = accounts[0]
				user1 = accounts[1]
				await deployments.fixture(["all"]) // deploys everything in deploy with tag all
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
			// describe("transfers", async () => {})
			// describe("allowance", async () => {})
	  })
