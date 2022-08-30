import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

// Constants
const TWITTER_HANDLE = "benyam_7";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
  "https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
  "https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
  "https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [gifList, setGifList] = useState([]);
  const [gifInputValue, setGifInputValue] = useState("");
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

  const sendGif = async () => {
    if (gifInputValue.length) {
      console.log("Gif", gifInputValue);
      setGifList([...gifList, gifInputValue]);
      setGifInputValue("");
    } else {
      console.log("empty");
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

  const renderConnectedContainer = () => {
    return (
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            onChange={(event) => {
              const { value } = event.target;
              setGifInputValue(value);
            }}
            value={gifInputValue}
            type="text"
            placeholder="Enter gif link!"
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
          {gifList.map((gif) => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      checkIfWalletIsConnected();
    };
    onLoad();
    // the reason why we're doing this is, currently Phantom team suggests waiting for
    // the window to fully finish loading before checking for the solana object.

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching gif list...");
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);
  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
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
