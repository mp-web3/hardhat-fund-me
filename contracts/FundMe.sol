// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

/**
 * @title A contract for crowd funding
 * @author Mattia Papa
 * @notice This contract is a sample of a funding contract
 * @dev It implements PriceConverter as library
 */
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address public immutable i_owner;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    AggregatorV3Interface public priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    error FundMe__NotOwner();
    error NotEnoughEth();
    error SendFailed();
    error CallFailed();

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds this contract
     */
    function fund() public payable {
        if (msg.value.getConversionRate(priceFeed) <= MINIMUM_USD) {
            revert NotEnoughEth();
        }
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function getMinimumUsdInWei() public view returns (uint256) {
        return PriceConverter.convertMinimumUsdToWei(MINIMUM_USD, priceFeed);
    }

    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < funders.length; i++) {
            // reset the mapping by setting 0 the amount funded by any funder
            addressToAmountFunded[funders[i]] = 0;
        }

        // reset funders array
        funders = new address[](0);

        // withdraw the funds
        /// We can do this by using 3 different methods:
        // 1. transfer
        // 2. send
        // 3. call

        /// 1. transfer
        // transfer automatically reverts if the transfer fails
        payable(msg.sender).transfer(address(this).balance);
        /// 2. send
        // send revert only if we specify the require
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        if (!sendSuccess) {
            revert SendFailed();
        }
        /// 3. call
        // call is a low level interaction
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!callSuccess) {
            revert CallFailed();
        }
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }
}
