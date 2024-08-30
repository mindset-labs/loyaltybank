import { Prisma, Transaction, TransactionStatus, TransactionSubtype, TransactionType } from '@prisma/client'
import dbClient from '@/db'
import { QueryPaging } from '@/common/utils/commonTypes'

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

    /**
     * Query transactions
     * @param where: the where clause for the query
     * @param include: the include for the query
     * @param paging: the paging for the query
     * @returns the queried transactions
     */
    async queryTransactions(
        where: Prisma.TransactionWhereInput,
        include: Prisma.TransactionInclude,
        paging: QueryPaging
    ): Promise<{
        transactions: Transaction[],
        total: number,
    }> {
        const results = await Promise.all([
            dbClient.transaction.findMany({
                where: {
                    ...where,
                },
                include,
                skip: paging?.skip || 0,
                take: paging?.take || 100,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            dbClient.transaction.count({
                where,
            })
        ])

        return {
            transactions: results[0],
            total: results[1],
        }
    }
}

export const transactionService = new TransactionService()
