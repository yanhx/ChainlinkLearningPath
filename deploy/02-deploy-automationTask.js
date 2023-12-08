const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        // const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        // ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        checkInterval = networkConfig[chainId]["checkInterval"]

    }
    log("----------------------------------------------------")
    log("Deploying waiting for confirmations...")
    const automationTask = await deploy("AutomationTask", {
        from: deployer,
        args: [checkInterval],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`automationTask deployed at ${automationTask.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(automationTask.address, [checkInterval])
    }
}

module.exports.tags = ["all", "automationTask"]