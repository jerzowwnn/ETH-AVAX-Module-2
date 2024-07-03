import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [operand1, setOperand1] = useState(0);
  const [operand2, setOperand2] = useState(0);
  const [operationResult, setOperationResult] = useState("");

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
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
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
      const contractBalance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(contractBalance));
    }
  };

  const performOperation = async (operation) => {
    if (atm) {
      let tx;
      if (operation === "add") {
        tx = await atm.add(operand1, operand2, { value: ethers.utils.parseEther("1") });
      } else if (operation === "subtract") {
        tx = await atm.subtract(operand1, operand2, { value: ethers.utils.parseEther("1") });
      }
      await tx.wait();
      getBalance();
      listenForEvents();
    }
  };

  const listenForEvents = () => {
    if (atm) {
      atm.on("Calculation", (sender, operation, operand1, operand2, result) => {
        setOperationResult(`Operation ${operation}: ${operand1} ${operation === "Addition" ? "+" : "-"} ${operand2} = ${result}`);
      });
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  const renderContent = () => {
    if (!ethWallet) {
      return (
        <div>
          <p>Please install MetaMask to use this application.</p>
        </div>
      );
    } else if (!account) {
      return (
        <div>
          <button onClick={connectAccount} className="connect-button">
            Connect MetaMask
          </button>
        </div>
      );
    } else {
      return (
        <div className="user-panel">
          <p className="account-info">Connected Account: {account}</p>
          <p className="balance-info">Account Balance: {balance} ETH</p>
          <div className="operation-inputs">
            <input
              type="number"
              placeholder="Operand 1"
              value={operand1}
              onChange={(e) => setOperand1(e.target.value)}
              className="operand-input"
            />
            <input
              type="number"
              placeholder="Operand 2"
              value={operand2}
              onChange={(e) => setOperand2(e.target.value)}
              className="operand-input"
            />
          </div>
          <div className="operation-buttons">
            <button onClick={() => performOperation("add")} className="operation-button">
              Add
            </button>
            <button onClick={() => performOperation("subtract")} className="operation-button">
              Subtract
            </button>
          </div>
          {operationResult && <p className="operation-result">{operationResult}</p>}
        </div>
      );
    }
  };

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {renderContent()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }

        .connect-button,
        .operation-button {
          margin: 8px;
          padding: 10px;
          font-size: 16px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          outline: none;
        }

        .connect-button:hover,
        .operation-button:hover {
          opacity: 0.8;
        }

        .user-panel {
          width: 80%;
          max-width: 600px;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .account-info,
        .balance-info {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .operation-inputs {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .operand-input {
          flex: 1;
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 8px;
        }

        .operation-buttons {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .operation-result {
          font-size: 16px;
          font-weight: bold;
          color: #28a745;
        }
      `}</style>
    </main>
  );
}
