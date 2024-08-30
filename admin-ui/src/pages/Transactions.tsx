import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchAllTransactions } from '../store/transactions'
import PageLayout from '../components/PageLayout'
import { Button, Row, Table, TablePaginationConfig, Typography } from 'antd'
import { Transaction } from '@apiTypes'
import { TableParams } from 'src/utils/common'

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
        dispatch(fetchAllTransactions({
            skip: ((tableParams.pagination?.current ?? 1) - 1) * (tableParams.pagination?.pageSize ?? 10),
            take: tableParams.pagination?.pageSize ?? 10,
        }))
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