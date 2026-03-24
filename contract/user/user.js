const bip39 = require("bip39");
const { Keypair } = require("@solana/web3.js");
const { derivePath } = require("ed25519-hd-key");

// Step 1: Generate mnemonic (12 words)
const mnemonic = bip39.generateMnemonic();

// Step 2: Convert mnemonic → seed
const seed = bip39.mnemonicToSeedSync(mnemonic);

// Step 3: Derive path (Solana standard)
const path = "m/44'/501'/0'/0'";

// Step 4: Get derived seed
const derivedSeed = derivePath(path, seed.toString("hex")).key;

// Step 5: Create wallet
const wallet = Keypair.fromSeed(derivedSeed);


// Outputs
// console.log("Mnemonic:", mnemonic);
// console.log("Public Address:", wallet.publicKey.toString());
// console.log("Private Key (secret):", Buffer.from(wallet.secretKey).toString("hex"));