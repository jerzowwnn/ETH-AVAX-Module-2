import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import charityAbi from "../artifacts/contracts/CharityDonationTracker.sol/CharityDonationTracker.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [charityContract, setCharityContract] = useState(undefined);
  const [totalDonations, setTotalDonations] = useState(0); // Set initial totalDonations to 0
  const [donationAmount, setDonationAmount] = useState(0); // Set initial donationAmount to 0

  const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const charityABI = charityAbi.abi;

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
    getCharityContract();
  };

  const getCharityContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const charityContract = new ethers.Contract(contractAddress, charityABI, signer);

    setCharityContract(charityContract);
  };

  const getTotalDonations = async () => {
    if (charityContract) {
      const total = await charityContract.getTotalDonations();
      setTotalDonations(ethers.utils.formatEther(total));
    }
  };

  const donate = async () => {
    if (charityContract && donationAmount > 0) {
      const amount = ethers.utils.parseEther(donationAmount.toString());
      let tx = await charityContract.donate({ value: amount });
      await tx.wait();
      setDonationAmount(0); // Reset the donation amount
      getTotalDonations();
    }
  };

  const initUser = () => {
    // Check to see if user has MetaMask
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this donation tracker.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <div>
          <button onClick={connectAccount}>Please connect your MetaMask wallet</button>
        </div>
      );
    }

    if (totalDonations === 0) {
      getTotalDonations();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Total Donations: {totalDonations} ETH</p>
        <div>
          <input
            type="number"
            placeholder="Donation Amount in ETH"
            value={donationAmount}
            onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
            min="0"
          />
        </div>
        <div>
          <button onClick={donate} disabled={donationAmount <= 0}>Donate</button>
        </div>
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
      <div className="content">
        {initUser()}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f0f0; /* Light gray background */
        }
        .content {
          text-align: center;
        }
        input {
          margin-right: 10px;
          padding: 5px;
          font-size: 1rem;
        }
        button {
          padding: 5px 10px;
          font-size: 1rem;
          cursor: pointer;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        button:hover:enabled {
          background-color: #005bb5;
        }
      `}</style>
    </main>
  );
}
