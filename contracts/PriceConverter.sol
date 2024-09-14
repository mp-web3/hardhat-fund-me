// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "./AggregatorV3Interface.sol";

// Address of deployed interface for interacting with the onchain datafeed on Sepolia 0x2cb920F445813D8E23B19B5cA38d5534Bf6e59D3
library PriceConverter {
    AggregatorV3Interface internal constant priceFeed =
        AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);

    uint256 constant PRECISION = 1e18;

    function decimals() internal view returns (uint8) {
        return priceFeed.decimals();
    }

    function getPrice() internal view returns (uint256) {
        (, /* uint80 roundID */ int price, , , ) = /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
        priceFeed.latestRoundData();

        // price is expressed as ETH in terms of USD
        // so if ETH/USD is 3000$, `int price` will be 3000 + 1e8 = 3000_0000_0000
        // if we want to return as uint256 we need to:
        // 1. Multiply by 1e10 (the missing 10 decimals)
        // 2. typecast int into uint256

        return uint256(price * 1e10);
    }

    function getVersion() internal view returns (uint256) {
        return priceFeed.version();
    }

    function getConversionRate(
        uint256 ethAmount
    ) internal view returns (uint256) {
        // Assuming a price of ETH/USD = 3000
        // getPrice() = 3000 * 1e18
        // ethAmount = 1 * 1e18
        // We are returning (3000 * 1e18 * 1e18)/1e18 = 3000 * 1e18
        return (getPrice() * ethAmount) / PRECISION;
    }

    function convertMinimumUsdToWei(
        uint256 _minimumUsd
    ) internal view returns (uint256) {
        // Get the ETH price in USD (scaled to 1e18)
        uint256 ethPrice = getPrice();

        // Convert the minimum USD (already scaled to 1e18) to ETH by dividing by ETH price
        // (minimumUsd * PRECISION) / ethPrice gives the equivalent ETH amount
        uint256 ethAmountInWei = (_minimumUsd * PRECISION) / ethPrice;

        return ethAmountInWei; // Return the amount in Wei
    }
}
