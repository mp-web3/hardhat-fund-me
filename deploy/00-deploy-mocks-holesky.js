const { network } = require("hardhat")
const {
    testnetChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId

    if (testnetChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        const mockV3Aggregator = await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            network: "holesky",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed!")
        log("--------------------------------------------------------------")

        await verify(mockV3Aggregator.address, [DECIMALS, INITIAL_ANSWER])
    }
}

module.exports.tags = ["all", "mocks", "mocks-local", "holesky"]
