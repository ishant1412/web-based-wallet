import { useState, useRef } from "react";
import React from "react";
import { mnemonicToSeed, generateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import axios from "axios";

type Wallet = {
  privatekey: string;
  publickey: string;
};

export function Page() {

  //creating state variable needed for the page
  const [wallets, setwallets] = useState<Wallet[]>([]);
  const [seeds, setseed] = useState("");
  const [currentindex, setcurrentindex] = useState(0);
  const [ballance, setballance]=useState<number>(0);
  const publickey2= useRef<HTMLInputElement>(null);

  
//mapping the wallets in html components 
  const walletcard = wallets.map((wallet, i) => {
    return (
      <div key={i} className="bg-white shadow p-4 rounded-md mb-4 border">
        <div className="text-indigo-600 font-semibold mb-1">
          Wallet no. {i + 1}
        </div>
        <div className="break-all text-gray-800">
          <span className="font-medium">Public Key:</span> {wallet.publickey}
        </div>
        <div className="break-all text-gray-800">
          <span className="font-medium">Private Key:</span> {wallet.privatekey}
        </div>
      </div>
    );
  });
  
//creating a addwallet functionality
  const addwallet = async () => {
   

    //converting the seedphrases into a unreadable format 
    const seed = mnemonicToSeed(seeds);
     //defining the path for the wallet every new wallet gets new currentindex althogh there should be a different function for mnemonics
    const path = `m/44'/501'/${currentindex}'/0'`;
     

    // as a single seed has many children seeds and thoose seeds have key pairs
    const derivedseed = derivePath(path, (await seed).toString("hex")).key;

    //deriving the private  key from the seed 
    const privatekey = await nacl.sign.keyPair.fromSeed(derivedseed).secretKey;
     //converting the private key in hex format to display on page 
    const hex = Array.from(privatekey)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
   // creating a key pair using the private key this keypai contains the public key
    const keypair = await Keypair.fromSecretKey(privatekey);
    //converting the public key to base 58
    const publickey = keypair.publicKey.toBase58();
    setcurrentindex(currentindex + 1);

    //setting keypair in the wallet
    setwallets([
      ...wallets,
      { publickey: publickey, privatekey: hex }
    ]);
  };
  
 async function generatemnemonic(){
 //generating seedphrases / mnemonics for hd wallets
    const seedphrases = await generateMnemonic(); //returns a string of some mnemonics/words

    setseed(seedphrases);
     //setting them in state variable
 }

 //additonal functionality to get the balance from a public key 
 async function getbal(){
 
 const data =   await axios.post("https://solana-mainnet.g.alchemy.com/v2/MsCkLThXKPIvl0J1nXOT-vbQdzuk2V_7",{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getAccountInfo",
    "params":[publickey2.current?.value]
}); 
console.log(Number(data.data.result.value)*100000000)
setballance(Number(data.data.result.value)*100000000)



 } 

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="mb-6">
          <button  
          onClick={generatemnemonic}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
        >
          generate mnemonics
        </button>
        <button
          onClick={addwallet}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
        >
          Add Wallet
        </button>
           <span className="ml-100 font-bold ">check balance in your sol account: <input  ref={publickey2} className=" rounded  ml-7 w-80 border-solid border-black border-2 h-9" type="text" placeholder="enter your public key " /><button
          onClick={getbal}

          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-4 rounded h-9"
        >
         get balance
        </button> 
        <div className="ml-224">balance: <span className=" bg-gray-300 ml-7 rounded">{ballance}</span></div></span>

    

        <div className="mt-4">
          <div className="text-lg font-medium text-gray-700 mb-1">
            Seed Phrases
          </div>
          <div className="bg-white p-3 rounded shadow-sm text-gray-800 break-words">
            {seeds}
          </div>
        </div>
      </div>
      <div>{walletcard}</div>
      <div><div className="font-bold">will add send crypto functionality soon</div>
    </div>
    </div>

  
  );
 }
