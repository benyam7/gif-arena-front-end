import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
// SystemProgram is a reference to the Solana runtime
const { SystemProgram, Keypair } = web3;

import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import idl from "./idl.json";

// create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// get programId from idl file
let programId = new PublicKey(idl.metadata.address);

// set our network to devnet
const network = clusterApiUrl("devnet");

// controls how we wanna ack when a trnsaction is "done"
// basicaly we choose when to receive confirmation, when our transaction has succeeded.
// we can wait till one node approves it: "processed" or
// we can wait till the whole Solana chain to acknowledge it : "finalized" in this case.

const opts = {
  preflightCommitment: "processed",
};

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

  const getGifList = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setGifList(account.gifList);
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  };

  // creates a 1provider` which is an autheticated connection to solana
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );

    return provider;
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      console.log("ping");
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "creadted a new Base Account w/address: ",
        baseAccount.publicKey.toString()
      );
      await getGifList();
    } catch (error) {
      console.log("Error in createGifAccount: ", error);
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
    // if gifList is null, i.e it means the program account hasn't been intitilized.
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do One-Time Initilization For GIF Program Account
          </button>
        </div>
      );
    } else {
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
            {gifList.map((item, index) => (
              <div className="gif-item" key={index}>
                <img src={item.gifLink} alt={gif} />
              </div>
            ))}
          </div>
        </div>
      );
    }
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
      getGifList();
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
