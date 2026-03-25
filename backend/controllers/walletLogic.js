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
        const signaturesInfo = await connection.getSignaturesForAddress(publicKey, { limit: 15 });
        const signatures = signaturesInfo.map(info => info.signature);

        if (signatures.length === 0) {
            return res.status(200).json({ success: true, transactions: [] });
        }

        // Fetch parsed transaction details
        const parsedTransactions = await connection.getParsedTransactions(signatures, { 
            maxSupportedTransactionVersion: 0 
        });

        // Format into readable data
        const formattedTransactions = parsedTransactions.map((tx, index) => {
            if (!tx || !tx.meta) return null;
            
            // Find the user's account index in this transaction
            const accountIndex = tx.transaction.message.accountKeys.findIndex(
                (acc) => acc.pubkey.toString() === address
            );

            if (accountIndex === -1) return null;

            const preBalance = tx.meta.preBalances[accountIndex] / LAMPORTS_PER_SOL;
            const postBalance = tx.meta.postBalances[accountIndex] / LAMPORTS_PER_SOL;
            const balanceChange = postBalance - preBalance;
            
            const isFeePayer = accountIndex === 0;
            const fee = isFeePayer ? (tx.meta.fee / LAMPORTS_PER_SOL) : 0;
            
            // Deduct the network fee from the balance change if they sent the transaction
            let actualTransferAmount = balanceChange;
            if (isFeePayer && balanceChange < 0) {
                actualTransferAmount = balanceChange + fee;
            }

            let type = 'Interact'; // Fallback
            if (actualTransferAmount > 0) type = 'Receive';
            else if (actualTransferAmount < 0) type = 'Send';

            return {
                signature: signatures[index],
                date: tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'Unknown',
                type,
                amount: Math.abs(parseFloat(actualTransferAmount.toFixed(9))),
                fee: fee,
                status: tx.meta.err ? 'Failed' : 'Success',
                explorerUrl: `https://solscan.io/tx/${signatures[index]}?cluster=devnet`
            };
        }).filter(tx => tx !== null);

        return res.status(200).json({
            success: true,
            transactions: formattedTransactions
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
