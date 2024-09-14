# hardhat-fund-me

## Repo setup and installation

The only notable thing here is that we are going to override the `@nomicfoundation/hardhat-ethers` with `npm:hardhat-deploy-ethers` by running the following command:

```
yarn add --dev @nomicfoundation/hardhat-ethers: npm:hardhat-deploy-ethers ethers
```

or in a more updated version we are going to use the `hardhat-deploy-ethers` plugin.

### hardhat-deploy-ethers plugin installation and usage

<u>It is highly recomennded to read the plugin docs here:</u> https://www.npmjs.com/package/hardhat-deploy-ethers

hardhat-deploy-ethers require the installation of hardhat-deploy and @nomicfoundation/hardhat-ethers

Note that you cannot use @nomicfoundation/hardhat-toolbox for installing @nomicfoundation/hardhat-ethers as this interfere with the typing extensions provided by hardhat-deploy-ethers

```
yarn add --dev @nomicfoundation/hardhat-ethers ethers hardhat-deploy hardhat-deploy-ethers
```

Which means you then add the following statement to your hardhat.config.js:

```
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
```

Or, if you are using TypeScript, add this to your hardhat.config.ts:

```
import '@nomicfoundation/hardhat-ethers';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
```
