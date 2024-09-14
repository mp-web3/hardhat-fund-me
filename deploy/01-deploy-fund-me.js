const { networkConfig } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId

    // if the contract doesn't exist we deploy a minimal version of the contract for our local testing

    const ethUsdPriceFeedAddress =
        networkConfig[chainId]["ethUsdPriceFeedAddress"]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [], // put priceFeed address here
    })
}
