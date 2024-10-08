const { deployments, ethers, network, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1") // Converts to BigNumber
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
              // fundMe = await ethers.getContractAt("FundMe", deployer)
              // console.log(`fundMe address: ${fundMe.address}`)

              // Get the deployed FundMe contract address and then the contract instance
              const fundMeDeployment = await deployments.get("FundMe")
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMeDeployment.address,
              )

              // Get the deployed MockV3Aggregator contract address and instance
              const mockV3AggregatorDeployment =
                  await deployments.get("MockV3Aggregator")
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  mockV3AggregatorDeployment.address,
              )
          })

          // In this first test we want to check that the address of the priceFeed has been set correctly
          describe("constructor", function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", function () {
              it("Fails if not enough ETH is sent", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "NotEnoughEth()",
                  )
              })

              it("updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response =
                      await fundMe.getAddressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funders to array of funders,", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(deployer, funder)
              })
          })

          describe("withdraw", function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  // We need to get gas costs
                  // In VS Code we can use a BreakPoint to interrupt the script and debug
                  // In this case we'll use it to see if gasCost is included in the transaction receipt

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address,
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString(),
                  )
              })

              it("allows to withdraw after contract funded by multiple addresses", async () => {
                  // Arrange

                  const accounts = await ethers.getSigners()
                  const fundersNum = 6
                  for (let i = 1; i < fundersNum; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address,
                  )

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString(),
                  )

                  // Make sure that funders[] array is reset
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  // Make sure that the mapped accounts have a corresponding value of 0
                  // Here `i = 0` because we also want to check for the deployer which also send funds to the contract
                  // before each deployement
                  for (i = 0; i < fundersNum; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]

                  const attackerConnectedContract =
                      await fundMe.connect(attacker)
                  await expect(
                      attackerConnectedContract.withdraw(),
                  ).to.be.revertedWith("FundMe__NotOwner()")
              })

              it("cheaperWithdraw function testing", async () => {
                  const accounts = await ethers.getSigners()
                  const fundersNum = 6
                  for (let i = 1; i < fundersNum; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i],
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address,
                  )

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString(),
                  )

                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 0; i < fundersNum; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address,
                          ),
                          0,
                      )
                  }
              })
          })
      })
