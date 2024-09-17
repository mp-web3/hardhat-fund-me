const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("FundMe", function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach(async function () {
        // Deploying fundMe contract using Hardhat-deploy
        // Instead of getNamedAccount() we could have also done like so:
        // const accounts = await ethers.getSigners() --> ethers.getSigners() loads all the accounts with an
        // associated `accounts : [privateKey1, privateKey2, privateKey3]`
        // Then we could have picked which accounts to use for what
        // const accountZero = accounts[0]

        // const { deployer } = getNamedAccounts()
        deployer = (await getNamedAccounts()).deployer

        console.log(`deployer address: ${deployer}`)

        // By using deployments.fixture we can specify the contracts we want to deploy
        // by specifying the tags
        await deployments.fixture(["all"])
        // This way whenever we call a function on FundMe it will be from our deployer account
        console.log(`fundMe address: ${fundMe.address}`)
        fundMe = await ethers.getContractAt("FundMe", deployer)

        mockV3Aggregator = await ethers.getContractAt(
            "MockV3Aggregator",
            deployer,
        )
    })

    // In this first test we want to check that the address of the priceFeed has been set correctly
    describe("constructor", function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
})
