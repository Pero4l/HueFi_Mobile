const bip39 = require("bip39");
const { Keypair } = require("@solana/web3.js");
const { derivePath } = require("ed25519-hd-key");

/**
 * Generates a new Solana wallet from a newly generated mnemonic mnemonic.
 * Returns the mnemonic, publicKey (address), and secretKey (private key hex).
 */
function generateWallet() {
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

    return {
        mnemonic,
        publicKey: wallet.publicKey.toString(),
        secretKey: Buffer.from(wallet.secretKey).toString("hex")
    };
}

module.exports = {
    generateWallet
};
