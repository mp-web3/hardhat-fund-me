const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },

    17000: {
        name: "holesky",
        ethUsdPriceFeed: "",
    },
}

const developmentChains = ["hardhat", "localhost", "holesky"]
const DECIMALS = 8
const INITIAL_ANSWER = 2 * 1e12

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
