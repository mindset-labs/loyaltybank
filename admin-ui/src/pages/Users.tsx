import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchAllUsers } from '../store/users'
import PageLayout from '../components/PageLayout'
import { Button, Row, Space, Table, TablePaginationConfig, Typography } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { TableParams } from 'src/utils/common'

const Users = () => {
    const dispatch = useAppDispatch()
    const { users, loading, error, total } = useAppSelector((state) => state.users)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })

    useEffect(() => {
        dispatch(fetchAllUsers({
            skip: ((tableParams.pagination?.current ?? 1) - 1) * (tableParams.pagination?.pageSize ?? 10),
            take: tableParams.pagination?.pageSize ?? 10,
        }))
    }, [dispatch, tableParams.pagination])

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({ pagination })
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => {
                const date = new Date(text)
                return date.toLocaleDateString('en-GB')
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: any) => (
                <Space direction="horizontal">
                    <Button type="link" onClick={() => alert('Edit User')}>
                        <EditOutlined />
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <PageLayout>
            <Row justify="space-between" align="middle">
                <Typography.Title level={3}>My Communities</Typography.Title>
                <Button type="primary" ghost onClick={() => alert('Add Community')} icon={<PlusOutlined />}>
                    Add Community
                </Button>
            </Row>
            <Table
                loading={loading}
                dataSource={users}
                columns={columns}
                pagination={{ pageSize: 10, total }}
                onChange={handleTableChange}
            />
        </PageLayout>
    )
}

export default Users