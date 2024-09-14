# hardhat-fund-me

## Repo setup and installation

The only notable thing here is that we are going to override the `@nomicfoundation/hardhat-ethers` with `npm:hardhat-deploy-ethers` by running the following command:

```
yarn add --dev @nomicfoundation/hardhat-ethers: npm:hardhat-deploy-ethers ethers
```

or in a more updated version we are going to use the `hardhat-deploy-ethers` plugin.

check again here: https://youtu.be/gyMwXuJrbJQ?si=X21LzP70DSVDFOEW&t=36788

### Overriding `@nomicfoundation/hardhat-ethers` to keep track of our deployed contracts

- Create a folder named deploy: here is where we'll put our deploy.js scripts
- This will allow ethers to keep track and remember all the different depoyments we make of our contracts
- All the scripts added to the `deploy` folder will run when we run `hardhat deploy`
- Therefore it is best practice to name the contracts starting with a number so that they will be run in the desired order


## Mocking contracts

Fortunately Chainlink has a Mock of the V3Aggregator here: https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/tests/MockV3Aggregator.sol

