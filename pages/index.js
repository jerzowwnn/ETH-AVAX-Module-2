import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json"; // Update path as per your project

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(null); // State to store MetaMask instance
  const [account, setAccount] = useState(""); // State to store connected account address
  const [atmContract, setATMContract] = useState(null); // State to store smart contract instance
  const [ownerAddress, setOwnerAddress] = useState(""); // State to store contract owner address
  const [totalDonations, setTotalDonations] = useState(0); // State to store total donations

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your contract address
  const atmABI = atm_abi.abi; // ABI of your smart contract

  // Function to initialize MetaMask
  const initMetaMask = async () => {
    if (window.ethereum) {
      const wallet = new ethers.providers.Web3Provider(window.ethereum);
      setEthWallet(wallet);
    } else {
      alert("MetaMask extension not detected. Please install MetaMask.");
    }
  };

  // Function to connect MetaMask account
  const connectAccount = async () => {
    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  // Function to initialize smart contract instance
  const initContract = () => {
    if (ethWallet) {
      const contract = new ethers.Contract(contractAddress, atmABI, ethWallet.getSigner());
      setATMContract(contract);
    }
  };

  // Function to fetch and display contract owner and total donations
  const fetchContractData = async () => {
    if (atmContract) {
      try {
        const owner = await atmContract.getContractOwner();
        setOwnerAddress(owner);

        const donations = await atmContract.getTotalDonations();
        setTotalDonations(donations.toNumber());
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    }
  };

  // Function to handle donation
  const donate = async () => {
    if (atmContract) {
      try {
        const amount = ethers.utils.parseEther("1"); // Convert 1 ETH to Wei
        const tx = await atmContract.donate({ value: amount });
        await tx.wait();
        fetchContractData(); // Refresh contract data after donation
      } catch (error) {
        console.error("Error donating:", error);
      }
    }
  };

  // Initialize MetaMask and contract on component mount
  useEffect(() => {
    initMetaMask();
    initContract();
  }, []);

  // Render UI based on MetaMask connection and contract initialization
  return (
    <main className="container">
      <header>
        <h1>Welcome to the Charity Donation Tracker!</h1>
      </header>
      {!account ? (
        <button onClick={connectAccount}>Connect MetaMask</button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <p>Contract Owner: {ownerAddress}</p>
          <p>Total Donations: {totalDonations}</p>
          <button onClick={donate}>Donate 1 ETH</button>
        </div>
      )}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
