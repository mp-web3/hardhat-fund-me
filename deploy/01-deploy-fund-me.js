const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    testnetChains,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (
        developmentChains.includes(network.name) ||
        testnetChains.includes(network.name)
    ) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // = deployments.get(),
        // but since we have already imported `get` from `deployments` module we ca simply use `get`
        ethUsdPriceFeedAddress = ethUsdAggregator.address
        log(ethUsdPriceFeedAddress)
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1, //!IMPORTANT this must be set to 1 for hardhat to work!!!
    })

    // If the network is not a development chain, then we also want to verify the contracts
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // Verify contracts
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }

    log("------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
