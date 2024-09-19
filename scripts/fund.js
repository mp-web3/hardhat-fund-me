const { ethers, deployments, getNamedAccounts } = require("hardhat")

// Fund a contract quickly

async function main() {
    const { deployer } = await getNamedAccounts()
    const valueInEth = 0.05
    const sendValue = ethers.utils.parseEther(valueInEth.toString())
    const fundMeDeployment = await deployments.get("FundMe")
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    console.log(
        `Sending at address: ${fundMeDeployment.address} FundMe Contract ${valueInEth} Ethers...`,
    )
    const transactionResponse = await fundMe.fund({
        value: sendValue,
    })
    await transactionResponse.wait(1)
    console.log(
        `${valueInEth} Ethers sent to FundMe Contract at address: ${fundMeDeployment.address}`,
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
