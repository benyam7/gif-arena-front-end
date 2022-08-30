import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

// Constants
const TWITTER_HANDLE = "benyam_7";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const checkIfLoggedIn = async (solana) => {
    try {
      const res = await solana.connect({ onlyIfTrusted: true });
      console.log("response", res);
      console.log("Connected with publick key", res.publicKey.toBase58());
      setWalletAddress(res.publicKey.toString());
    } catch (e) {
      if (e.code === 4001) {
      }
    }
  };
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          checkIfLoggedIn(solana);
        }
      } else {
        alert("No, solana wallet found. Go get Phantom 👻");
      }
    } catch (e) {
      console.log("Error when checking for a wallet.");
    }
  };

  const connectWalletManually = async () => {
    try {
      const { solana } = window;
      const res = await solana.connect();

      setWalletAddress(res.publicKey.toString());
    } catch (error) {
      console.log("Error while trying to connect manullay", error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWalletManually}
    >
      Connect Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      checkIfWalletIsConnected();
    };
    // the reason why we're doing this is, currently Phantom team suggests waiting for
    // the window to fully finish loading before checking for the solana object.

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
