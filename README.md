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

### Running only Mocked contracts

There is an easy way to deploy only our mock contracts without specifying the path

At the end of the deploy-mock script 

```
module.exports.tags = ["all", "mocks"]
```

Run `yarn hardhat deploy --tags mocks`


### Deploy and verify mock contracts on live testnet

#### Deploy and verify mocks

```
yarn hardhat deploy --tags holesky --network holesky
```

#### Deploy and verify FundMe

```
yarn hardhat deploy --tags fundme --network holesky
```

## Style Guide Solidity

Link: https://docs.soliditylang.org/en/latest/style-guide.html


### Order of the Layout

Link: https://docs.soliditylang.org/en/latest/style-guide.html#order-of-layout

1. Pragma statements
2. Import statements
3. Interfaces
4. Libraries
5. Contracts

### Inside each contract, library, interface, use the following order: ####

1. Type declarations
2. State variables
3. Events
4. Errors
5. Modifiers
6. Functions

### Functions Order ###

1. constructor
2. receive
3. fallback
4. external
5. public
6. internal
7. private
8. view/pure


#### Error codes

This is a best practice because you are able to identify from which contract the error is coming from.

<Name-of-the-contract__Error>

`error FundMe__NotOwner();`

### NatSpecs

Link: https://docs.soliditylang.org/en/latest/natspec-format.html#natspec

Solidity contracts can use a special form of comments to provide rich documentation for functions, return variables and more. This special form is named the Ethereum Natural Language Specification Format (NatSpec).

Natspec is really powerfull not just to inform about our contract and remember why we did things certain ways, but also because we can <b>generate the documentation automatically!</b>

<i>The Solidity compiler only interprets tags if they are external or public. You are welcome to use similar comments for your internal and private functions, but those will not be parsed.</i>

To generate the documentation: 

```
solc --userdoc --devdoc FundeMe.sol
```
## Testing 
Rewatch from there to get a cleare picture of how the tests are set up 
<b>VERY IMPORTANT!</b>
Link: https://youtu.be/gyMwXuJrbJQ?si=XxBvgUQrm_cfUTmX&t=40268



## Gas Optimization, storage and memory

Link to Opcodes with associated costs: https://github.com/crytic/evm-opcodes

### Storage variables

When we declare a storage variable it get slotted in a 32 bytes long format in the storage in its hex format.

Every time we declare a new storage variable it occupies the next slot in the storage. 

#### Arrays example

For dynamic variables such as arrays, the object array take up a slot as hex vaule, the elements inside the array are hashed.

So each array takes up 2 slots:
- A slot which contains a hex value representing the lenght of the array
- A slot which contains a hex value representing the hashed elements of the array

### Constant and Immutable variables

Constant and Immutable variables does not occupy a slot in the storage.
In fact they are part of the contract bytecodes itself (since they cannot change).

### Variables in functions

Variables declared inside a function only exist for the duration of the function execution, therefore they are not added to storage.

They are instead saved in a dedicated temporary data structure.

### Strings

Strings are technically stored as dynamic arrays, therefore we need to specify if they should be in `storage` or `memory`

### What does it matter for gas where we store our variables? 

Reading and writing into storage is way more expensive than memory

## Staging Tests on testnet 

```
yarn hardhat test --network holesky
```

## Running scripts on testnet

```
yarn hardhat run scripts/fund.js --network holesky
```

```
yarn hardhat run scripts/withdraw.js --network holesky
```


## Fixes/Upgrades

Great to hear it's working now!

The main issue was in how you were interacting with the deployed contracts. Here's a breakdown of the problem and fix:

1. **Problem with how contracts were retrieved**:
   - Initially, you were trying to get the `FundMe` contract instance using `deployments.get("FundMe", deployer)`, but `deployments.get` only returns the deployment information (like the address of the deployed contract). 
   - You need to use `ethers.getContractAt("FundMe", fundMeDeployment.address)` to create an instance of the contract to interact with. Similarly, this also applied to `MockV3Aggregator`.

2. **Fixed approach**:
   - First, get the deployment information with `deployments.get("FundMe")` to retrieve the contract's address.
   - Then use `ethers.getContractAt("FundMe", fundMeDeployment.address)` to actually obtain the contract instance and interact with it.

The change ensures that you're correctly retrieving and interacting with the deployed contract on the test network.