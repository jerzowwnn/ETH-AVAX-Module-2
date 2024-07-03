import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [totalDonations, setTotalDonations] = useState(undefined);
  const [donationAmount, setDonationAmount] = useState(0);
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

  const getTotalDonations = async () => {
    if (atm) {
      const total = await atm.getTotalDonations();
      setTotalDonations(ethers.utils.formatEther(total));
    }
  };

  const donate = async () => {
    if (atm && donationAmount > 0) {
      const amount = ethers.utils.parseEther(donationAmount.toString());
      try {
        let tx = await atm.donate({ value: amount });
        const receipt = await tx.wait();
        setTransactionDetails(receipt);
        setDonationAmount(0); // Reset the donation amount
        getTotalDonations();
      } catch (error) {
        console.error("Error donating:", error);
      }
    }
  };

  const renderTransactionDetails = () => {
    if (transactionDetails) {
      return (
        <div className="transaction-details">
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
      return <p>Please install MetaMask in order to use this donation tracker.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button className="connect-button" onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (totalDonations === undefined) {
      getTotalDonations();
    }

    return (
      <div className="user-container">
        <p><strong>Your Account:</strong> {account}</p>
        <p><strong>Total Donations:</strong> {totalDonations} ETH</p>
        <div className="donation-container">
          <input
            type="number"
            placeholder="Donation Amount in ETH"
            value={donationAmount}
            onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
            min="0"
          />
          <button className="donate-button" onClick={donate} disabled={donationAmount <= 0}>Donate</button>
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
        <h1>Welcome to the Charity Donation Tracker!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        header {
          background-color: #0070f3;
          color: white;
          padding: 10px 0;
          border-radius: 5px;
        }
        .connect-button, .donate-button {
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          margin-top: 10px;
        }
        .connect-button:disabled, .donate-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .connect-button:hover:enabled, .donate-button:hover:enabled {
          background-color: #005bb5;
        }
        .user-container {
          margin-top: 20px;
        }
        .donation-container {
          margin-top: 10px;
        }
        input {
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #cccccc;
          border-radius: 5px;
          width: calc(100% - 24px);
          margin-right: 10px;
        }
        .transaction-details {
          margin-top: 20px;
          text-align: left;
        }
      `}</style>
    </main>
  );
}
 