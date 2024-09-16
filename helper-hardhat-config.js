const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x2cb920F445813D8E23B19B5cA38d5534Bf6e59D3",
    },

    17000: {
        name: "holesky",
        ethUsdPriceFeed: "",
    },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 2 * 1e12

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
