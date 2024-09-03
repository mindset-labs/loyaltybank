SELECT 
    (SELECT COUNT(*) FROM "User")::numeric AS "totalUsers",
    (SELECT COUNT(*) FROM "Community" WHERE status = 'ACTIVE')::numeric AS "totalActiveCommunities",
    (SELECT COUNT(*) FROM "Transaction")::numeric AS "totalTransactions",
    (
        SELECT SUM(amount) 
        FROM "Transaction" 
        WHERE "transactionType" = 'REWARD' AND "transactionSubtype" = 'POINTS'
    )::numeric AS "totalRewardAmount",
    (SELECT COALESCE(SUM(amount), 0) FROM "Transaction")::numeric AS "totalTransactionAmount",
    (SELECT COALESCE(AVG(amount), 0) FROM "Transaction")::numeric AS "averageTransactionAmount"
