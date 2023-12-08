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
        vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinator"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
        keyHash = networkConfig[chainId]["keyHash"]

    }
    log("----------------------------------------------------")
    log("Deploying waiting for confirmations...")
    const vrfTask = await deploy("VRFTask", {
        from: deployer,
        args: [subscriptionId, vrfCoordinatorAddress, keyHash],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`vrfTask deployed at ${vrfTask.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(vrfTask.address, [subscriptionId, vrfCoordinatorAddress, keyHash])
    }
}

module.exports.tags = ["all", "vrfTask"]