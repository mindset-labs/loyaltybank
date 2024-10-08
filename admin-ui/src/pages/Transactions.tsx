import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchAllTransactions } from '../store/transactions'
import PageLayout from '../components/PageLayout'
import { Button, Row, Table, TablePaginationConfig, Tag, Typography } from 'antd'
import { Transaction, TransactionTypeType } from '@apiTypes'
import { TableParams } from 'src/utils/common'
import { debounce } from 'lodash'

const Transactions = () => {
    const dispatch = useAppDispatch()
    const { transactions, total, loading, error } = useAppSelector((state) => state.transactions)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })

    useEffect(() => {
        const debouncedFetchTransactions = debounce(() => {
            dispatch(fetchAllTransactions({
                skip: ((tableParams.pagination?.current ?? 1) - 1) * (tableParams.pagination?.pageSize ?? 10),
                take: tableParams.pagination?.pageSize ?? 10,
            }))
        }, 200)

        debouncedFetchTransactions()

        return () => {
            debouncedFetchTransactions.cancel()
        }
    }, [dispatch, tableParams])

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({ pagination })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => (
                <Button type="link" onClick={() => alert('View Transaction')}>
                    <Typography.Link>
                        {text.slice(0, 6)}...
                    </Typography.Link>
                </Button>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Type',
            dataIndex: 'transactionType',
            key: 'type',
            render: (type: TransactionTypeType) => {
                switch (type) {
                    case 'PAYMENT':
                        return <Tag color="purple">Payment</Tag>
                    case 'DEPOSIT':
                        return <Tag color="darkgreen">Deposit</Tag>
                    case 'WITHDRAW':
                        return <Tag color="red">Withdraw</Tag>
                    case 'TRANSFER':
                        return <Tag color="darkblue">Transfer</Tag>
                    case 'REWARD':
                        return <Tag color="blue">Reward</Tag>
                    default:
                        return <Tag color="default">{type}</Tag>
                }
            },
        },
        {
            title: 'Subtype',
            dataIndex: 'transactionSubtype',
            key: 'subtype',
        },
        {
            title: 'Sender',
            dataIndex: ['sender', 'name'],
            key: 'sender',
        },
        {
            title: 'Receiver',
            dataIndex: ['receiver', 'name'],
            key: 'receiver',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                switch (status) {
                    case 'COMPLETED':
                        return <Tag color="green">Completed</Tag>
                    case 'FAILED':
                        return <Tag color="red">Failed</Tag>
                    case 'PENDING':
                        return <Tag color="orange">Pending</Tag>
                    default:
                        return <Tag color="default">{status}</Tag>
                }
            },
        },
        {
            title: 'Community',
            dataIndex: ['community', 'name'],
            key: 'community',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (text: string) => {
                const date = new Date(text)
                return date.toLocaleString('en-GB')
            }
        },
        // {
        //     title: 'Actions',
        //     key: 'actions',
        //     render: (text: string, record: any) => (
        //         <Space direction="horizontal">
        //             <Button type="link" onClick={() => alert(`Edit Transaction ${record.id}`)}>
        //                 <EditOutlined />
        //             </Button>
        //         </Space>
        //     ),
        // },
    ]

    return (
        <PageLayout>
            <Row justify="space-between" align="middle">
                <Typography.Title level={3}>Transactions</Typography.Title>
            </Row>
            <Table<Transaction>
                loading={loading}
                dataSource={transactions}
                columns={columns}
                pagination={{ pageSize: 10, total }}
                onChange={handleTableChange}
            />
        </PageLayout>
    )
}

export default Transactions