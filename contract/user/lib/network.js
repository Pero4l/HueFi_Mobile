const solanaWeb3 = require("@solana/web3.js");

// Connect to devnet (for testing)
const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl("devnet"),
  "confirmed"
);

console.log("Connected to Solana");