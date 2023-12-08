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
        btcPriceFeedAddress = networkConfig[chainId]["btcPriceFeed"]
        ethPriceFeedAddress = networkConfig[chainId]["ethPriceFeed"]
        linkPriceFeedAddress = networkConfig[chainId]["linkPriceFeed"]
    }
    log("----------------------------------------------------")
    log("Deploying waiting for confirmations...")
    const dataFeedTask = await deploy("DataFeedTask", {
        from: deployer,
        args: [linkPriceFeedAddress, btcPriceFeedAddress, ethPriceFeedAddress ],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`DataFeedTask deployed at ${dataFeedTask.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(dataFeedTask.address, [linkPriceFeedAddress, btcPriceFeedAddress, ethPriceFeedAddress])
    }
}

module.exports.tags = ["all", "dataFeedTask"]