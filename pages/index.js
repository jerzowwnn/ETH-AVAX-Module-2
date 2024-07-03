import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json"; // Update path as per your project

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [ownerAddress, setOwnerAddress] = useState(undefined);
  const [totalDonations, setTotalDonations] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your contract address
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts[0]);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
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
    handleAccount(accounts[0]);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
    getContractDetails();
  };

  const getContractDetails = async () => {
    if (atm) {
      const owner = await atm.getContractOwner();
      setOwnerAddress(owner);

      const donations = await atm.getTotalDonations();
      setTotalDonations(donations.toNumber());
    }
  };

  const donate = async () => {
    if (atm) {
      const amount = ethers.utils.parseEther("1"); // Convert 1 ETH to Wei
      const tx = await atm.donate({ value: amount });
      await tx.wait();
      getContractDetails();
    }
  };

  const initUser = () => {
    // Check if MetaMask is installed
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this application.</p>;
    }

    // Check if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    if (!ownerAddress || totalDonations === undefined) {
      getContractDetails();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Contract Owner: {ownerAddress}</p>
        <p>Total Donations: {totalDonations}</p>
        <button onClick={donate}>Donate 1 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Charity Donation Tracker!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
