-- @param {DateTime} $1:from
-- @param {DateTime} $2:to

WITH date_series AS (
    SELECT generate_series($1::date, $2::date - interval '1 day', interval '1 day')::date AS date
)
SELECT
    ds.date,
    COALESCE(COUNT(t.id), 0)::integer AS "totalTransactions",
    COALESCE(SUM(t.amount), 0)::numeric AS "totalAmount",
    COALESCE(SUM(CASE WHEN t."transactionType" = 'PAYMENT' THEN t.amount ELSE 0 END), 0)::numeric AS "totalAmountPayment",
    COALESCE(SUM(CASE WHEN t."transactionType" = 'DEPOSIT' THEN t.amount ELSE 0 END), 0)::numeric AS "totalAmountDeposit",
    COALESCE(SUM(CASE WHEN t."transactionType" = 'WITHDRAW' THEN t.amount ELSE 0 END), 0)::numeric AS "totalAmountWithdraw",
    COALESCE(SUM(CASE WHEN t."transactionType" = 'TRANSFER' THEN t.amount ELSE 0 END), 0)::numeric AS "totalAmountTransfer",
    COALESCE(SUM(CASE WHEN t."transactionType" = 'REWARD' THEN t.amount ELSE 0 END), 0)::numeric AS "totalAmountReward"
FROM date_series ds
LEFT JOIN "Transaction" t ON DATE(t."createdAt"::timestamp) = ds.date
GROUP BY ds.date
ORDER BY ds.date DESC
