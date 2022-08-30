import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useEffect } from "react";

// Constants
const TWITTER_HANDLE = "benyam_7";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const checkIfWalletIsConnected = () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
        }
      } else {
        alert("No, solana wallet found. Go get Phantom 👻");
      }
    } catch (e) {
      console.log("Error when checking for a wallet.");
    }
  };

  useEffect(() => {
    const onLoad = () => {
      checkIfWalletIsConnected();
    };
    // the reason why we're doing this is, currently Phantom team suggests waiting for
    // the window to fully finish loading before checking for the solana object.
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
