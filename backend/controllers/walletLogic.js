const { Connection, PublicKey, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Using Solana Devnet for default RPC
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

/**
 * Get Wallet Balance
 * Connects to Solana network and fetches balance in SOL
 */
async function getWalletBalance(req, res) {
    try {
        const { address } = req.user;
        const publicKey = new PublicKey(address);

        const balance = await connection.getBalance(publicKey);

        return res.status(200).json({
            success: true,
            balance: balance / LAMPORTS_PER_SOL,
            lamports: balance
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to get balance", error: error.message });
    }
}

/**
 * Send Tokens (SOL)
 * Signs and sends a transaction using the authenticated user's secret key
 */
async function sendTokens(req, res) {
    try {
        const { recipientAddress, amount } = req.body; // amount is in SOL
        const { address, secretKey } = req.user;

        if (!recipientAddress || !amount) {
            return res.status(400).json({ success: false, message: "Recipient address and amount are required" });
        }

        const senderPublicKey = new PublicKey(address);
        const receiverPublicKey = new PublicKey(recipientAddress);

        // Convert the hex string secretKey back into a Uint8Array
        const secretKeyBytes = Uint8Array.from(Buffer.from(secretKey, 'hex'));
        const senderKeypair = Keypair.fromSecretKey(secretKeyBytes);

        const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderPublicKey,
                toPubkey: receiverPublicKey,
                lamports: lamports,
            })
        );

        // Sign and confirm the transaction
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [senderKeypair]
        );

        return res.status(200).json({
            success: true,
            message: "Transaction successful",
            signature
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Transaction failed", error: error.message });
    }
}

/**
 * Get Transaction History
 * Fetches recent transaction signatures for the authenticated user's wallet
 */
async function getTransactions(req, res) {
    try {
        const { address } = req.user;
        const publicKey = new PublicKey(address);

        // Fetch up to the last 15 transaction signatures
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 15 });

        return res.status(200).json({
            success: true,
            transactions: signatures
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to get transactions", error: error.message });
    }
}

module.exports = {
    getWalletBalance,
    sendTokens,
    getTransactions
};
