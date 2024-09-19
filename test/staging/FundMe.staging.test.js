const { deployments, ethers, network, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

/// These are the tests we run on an actual testnet before deploying

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.05")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              const fundMeDeployment = await deployments.get("FundMe")
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMeDeployment.address,
              )
          })

          it("Allows accounts to fund and owner to withdraw", async () => {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address,
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
