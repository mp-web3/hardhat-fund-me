const { ethers, deployments, getNamedAccounts } = require("hardhat")

// Withdraw from FundMe contract quickly

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMeDeployment = await deployments.get("FundMe")
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    console.log(
        `Withdrawing Ethers from FundMe COntract at address ${fundMeDeployment.address}`,
    )
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log(`Ethers sent withdrawn from FundMe Contract`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
