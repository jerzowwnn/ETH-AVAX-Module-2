import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmt, setDepositAmt] = useState(0);
  const [withdrawAmt, setWithdrawAmt] = useState(0);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm && depositAmt > 0) {
      let tx = await atm.deposit(depositAmt);
      const receipt = await tx.wait();
      setTransactionDetails(receipt);
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm && withdrawAmt > 0) {
      let tx = await atm.withdraw(withdrawAmt);
      const receipt = await tx.wait();
      setTransactionDetails(receipt);
      getBalance();
    }
  };

  const renderTransactionDetails = () => {
    if (transactionDetails) {
      return (
        <div>
          <h3>Transaction Details</h3>
          <p>Transaction Hash: {transactionDetails.transactionHash}</p>
          <p>Block Number: {transactionDetails.blockNumber}</p>
          <p>Gas Used: {transactionDetails.gasUsed.toString()}</p>
        </div>
      );
    }
    return null;
  };

  const initUser = () => {
    // Check to see if user has MetaMask
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <div>
          <input
            type="number"
            placeholder="Deposit Amount"
            value={depositAmt}
            onChange={(e) => setDepositAmt(parseInt(e.target.value))}
          />
          <button onClick={deposit}>Deposit</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="Withdraw Amount"
            value={withdrawAmt}
            onChange={(e) => setWithdrawAmt(parseInt(e.target.value))}
          />
          <button onClick={withdraw}>Withdraw</button>
        </div>
        {renderTransactionDetails()}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, [ethWallet]);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
        input {
          margin-right: 10px;
        }
      `}</style>
    </main>
  );
}