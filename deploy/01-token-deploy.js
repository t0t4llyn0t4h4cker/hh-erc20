const { network, ethers } = require("hardhat")
const {developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()


// maybe not deployments, is mocking needed?
module.exports = async ({ getNamedAccounts, deployments }) => {
    // 
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainID = network.config.chainId

    //constructor args
    const tokenName = "NEWNEW" // string
    const tokenSymbol = "NEW" // string
    const intitialSupply = 1000000 // uint256
    const args = [intitialSupply, tokenName, tokenSymbol]

    // deploy contract
    const ourToken = await deploy("OurToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1
    })
    log(`NEWNEW Token deployed at ${ourToken.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
		await verify(lottery.address, args)
	}

	log("---------------------------------------------------------------------")
}
module.exports.tags = ["all", "deploy"]
