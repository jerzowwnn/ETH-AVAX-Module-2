// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address public owner;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount);
    event TotalDonationsUpdated(uint256 total);

    constructor() {
        owner = msg.sender;
        totalDonations = 0;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
        emit TotalDonationsUpdated(totalDonations);
    }

    function getContractOwner() external view returns (address) {
        return owner;
    }

    function getTotalDonations() external view returns (uint256) {
        return totalDonations;
    }
}