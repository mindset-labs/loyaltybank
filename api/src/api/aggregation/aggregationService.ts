import dbClient from "@/db"
import { Prisma } from '@prisma/client'
import { overallStats, transactionsByDate } from '@prisma/client/sql'

export class AggregationService {
    aggregateTransactions = async (aggregationQuery: Prisma.TransactionAggregateArgs): Promise<any> => {
        const transactions = await dbClient.transaction.aggregate(aggregationQuery)
        return transactions
    }

    groupTransactionsByDate = async (from: Date, to: Date) => {
        return dbClient.$queryRawTyped(transactionsByDate(from, to))
    }

    getOverallStats = async () => {
        return dbClient.$queryRawTyped(overallStats())
    }
}

export const aggregationService = new AggregationService()
