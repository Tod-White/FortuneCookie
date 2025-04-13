// App.js - Main component
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import fortuneCookieABI from './FortuneCookieABI.json';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xc76a8fcc63646bf419c23f4df8b8825b36b4a135";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [fortune, setFortune] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        setupEventListener();
      } else {
        console.log("No authorized account found");
      }
      
      // Setup provider and contract
      const provider = new ethers.providers.Web3Provider(ethereum);
      setProvider(provider);
      
      const signer = provider.getSigner();
      const fortuneContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fortuneCookieABI,
        signer
      );
      setContract(fortuneContract);
      
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("You need MetaMask to use this app!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      
      // Re-initialize the provider and contract after connecting
      const provider = new ethers.providers.Web3Provider(ethereum);
      setProvider(provider);
      
      const signer = provider.getSigner();
      const fortuneContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fortuneCookieABI,
        signer
      );
      setContract(fortuneContract);
      
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const logoutWallet = () => {
    setCurrentAccount("");
    setContract(null);
    setProvider(null);
    setFortune("");
    setAddressDropdownOpen(false);
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const fortuneContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          fortuneCookieABI,
          signer
        );

        fortuneContract.on("FortuneOpened", (user, fortune, timestamp) => {
          console.log("FortuneOpened event:", { user, fortune, timestamp });
        });

        console.log("Event listener setup complete!");
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const openFortuneCookie = async () => {
    try {
      if (!contract) return;
      
      setLoading(true);
      
      console.log("Opening fortune cookie...");
      const txn = await contract.getRandomFortune();
      
      // Wait for the transaction to be mined
      console.log("Mining...", txn.hash);
      const receipt = await txn.wait();
      console.log("Mined -- transaction hash:", txn.hash);
      
      // Look for the fortune in the transaction events
      const event = receipt.events.find(event => event.event === 'FortuneOpened');
      if (event) {
        const fortuneFromEvent = event.args.fortune;
        setFortune(fortuneFromEvent);
      } else {
        // Fallback if event isn't properly found
        const returnedFortune = await contract.callStatic.getRandomFortune();
        setFortune(returnedFortune);
      }
      
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const followOnTwitter = () => {
    window.open(`https://twitter.com/intent/follow?screen_name=MetaDogeisme`, "_blank");
  };

  const shareFortune = () => {
    const tweetText = encodeURIComponent(`My blockchain fortune cookie says: "${fortune}" via @quillsadventure Fortune Cookie on @Somnia_Network`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  return (
    <div className="app-container">
      <h1>Quills' Fortune Cookie</h1>

      {currentAccount && (
        <div className="address-container">
          <div 
            className="address-display" 
            onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
          >
            Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
            <span className="dropdown-arrow">▼</span>
          </div>
          
          {addressDropdownOpen && (
            <div className="address-dropdown">
              <button className="logout-button" onClick={logoutWallet}>
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      )}
      
      {!currentAccount && (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      
      {currentAccount && (
        <div className="fortune-container">
          <div className={`cookie ${fortune ? 'opened' : ''}`} onClick={!loading && !fortune ? openFortuneCookie : null}>
            <img 
              src={fortune ? "/opened-cookie.png" : "/fortune-cookie.png"} 
              alt="Fortune Cookie" 
              className="cookie-image"
            />
          </div>
          
          {!fortune && !loading && (
            <button className="fortune-button" onClick={openFortuneCookie}>
              Open Your Fortune Cookie
            </button>
          )}
          
          {loading && <p>Breaking open your cookie...</p>}
          
          {fortune && (
            <div className="fortune-result">
              <p className="fortune-text">"{fortune}"</p>
              <button className="share-button" onClick={shareFortune}>
                Share on X
              </button>
              <button className="follow-button" onClick={followOnTwitter}>
                Follow @MetaDogeisme
              </button> 
              <button className="reset-button" onClick={() => setFortune("")}>
                Get Another Fortune
              </button>
            </div>
          )}
        </div>
      )}
      
      <footer>
        <p>Built on Somnia Blockchain</p>
      </footer>
    </div>
  );
}

export default App;