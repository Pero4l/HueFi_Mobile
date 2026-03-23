const { Keypair } = require("@solana/web3.js");

// Generate new wallet
const wallet = Keypair.generate();

console.log("Public Key:", wallet.publicKey.toString());
console.log("Private Key:", wallet.secretKey.toString());
console.log("wallet:", wallet.wallet);
