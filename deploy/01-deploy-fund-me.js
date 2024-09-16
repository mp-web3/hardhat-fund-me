const {
    networkConfig,
    developmentChains,
    testnetChains,
} = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (
        developmentChains.includes(network.name) ||
        testnetChains.includes(network.name)
    ) {
        const ethUsdAggregator = await get("MockV3Aggregator") // = deployments.get(),
        // but since we have already imported `get` from `deployments` module we ca simply use `get`
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 4,
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
