const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },

    17000: {
        name: "holesky",
        ethUsdPriceFeed: "0xF1d8fF462BA892F25CeF92351F572288610D17e5",
        fundMeAddress: "0xf0848863e31ac2FcAF8E4Bcf6e3CFAD5d2Ef8217",
    },
}

const developmentChains = ["hardhat", "localhost"]
const testnetChains = ["holesky"]
const DECIMALS = 8
const INITIAL_ANSWER = 2 * 1e12

module.exports = {
    networkConfig,
    developmentChains,
    testnetChains,
    DECIMALS,
    INITIAL_ANSWER,
}
