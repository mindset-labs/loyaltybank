import { Transaction } from '@prisma/client'

export class TransactionService {
    async createTransaction(): Promise<Transaction> {
        throw new Error('Not implemented')
    }
}

export const transactionService = new TransactionService()
