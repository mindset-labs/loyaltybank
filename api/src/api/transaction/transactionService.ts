import { Transaction, TransactionStatus, TransactionSubtype, TransactionType } from '@prisma/client'
import dbClient from '@/db'

export class TransactionService {
    /**
     * Create a placeholder transaction.
     * @param receiverId: the id of the user
     * @param receiverWalletId: the id of the wallet
     * @param amount: the amount of the transaction
     * @param options: the options for the transaction
     * @param options.transactionType: the type of the transaction
     * @param options.transactionSubtype: the subtype of the transaction
     * @returns the created transaction
     */
    async createPlaceholderTransaction(receiverId: string, receiverWalletId: string, amount: number, options?: {
        transactionType?: TransactionType,
        transactionSubtype?: TransactionSubtype,
    }): Promise<Transaction> {
        return dbClient.transaction.create({
            data: {
                transactionType: options?.transactionType || TransactionType.PAYMENT,
                transactionSubtype: options?.transactionSubtype || TransactionSubtype.BALANCE,
                receiverWalletId,
                receiverId,
                amount,
                status: TransactionStatus.PLACEHOLDER,
            }
        })
    }
}

export const transactionService = new TransactionService()
