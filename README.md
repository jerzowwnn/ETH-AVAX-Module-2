# ETH-AVAX-Module-2
# Overview
This repository contains my files for the Module 2 project in the ETH + AVAX Proof: Intermediate EVM Course. It holds a contract named Assessment.sol, which is a smart contract for a simple bank system containing two functions. It provides the following functionalities:
- getBalance() = a function that returns the current balance stored in the contract
- depositWithdraw() = a function that enables the owner to deposit or withdraw funds from the contract's balance. 

It also contains index.js, which is an application for the Assessment.sol contract. It displays the results of the function in its frontend.

# Prerequisites
In using the files contained in this repository, one must have the following:
- Gitpod, VS Code, or any compiler capable of running Solidity contracts and React
- Metamask browser extension

# Usage
To use the files in this repository, here is a step-by-step guide.
1. Open this repository in Gitpod. You may also clone this on your local device.
2. Open a terminal (Terminal 1). Enter npx hardhat node.
3. Open a new terminal (Terminal 2). Enter npx hardhat run --network localhost scripts/deploy.js.
4. Open a new terminal (Terminal 3). Enter npm run dev.
5. Navigate to the link displayed on Terminal 3.
6. Once there, connect to a Metamask account. You may copy the private key from the accounts generated in Terminal 1.
7. Interact with the application. 
