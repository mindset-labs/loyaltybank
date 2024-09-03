import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchAllUsers } from '../store/users'
import { Button, Form, Input, Modal, Row, Select, Space, Table, TablePaginationConfig, Tag, Typography } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { TableParams } from 'src/utils/common'
import { RoleType, User } from '@apiTypes'
import PageLayout from '../components/PageLayout'
import DebounceSelect from '../components/DebounceSelect'

const Users = () => {
    const dispatch = useAppDispatch()
    const { users, loading, error, total } = useAppSelector((state) => state.users)
    const token = useAppSelector((state) => state.auth.token)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [managedUserValue, setManagedUserValue] = useState<{ label: string; value: string }>()
    const [form] = Form.useForm()
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
            render: (text: string) => (
                <Button type="link" onClick={() => alert('View User')}>
                    <Typography.Link>
                        {text}
                    </Typography.Link>
                </Button>
            )
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
            render: (text: RoleType) => {
                switch (text) {
                    case 'SYSTEM_ADMIN':
                        return <Tag color="purple">System Admin</Tag>
                    case 'ADMIN':
                        return <Tag color="blue">Admin</Tag>
                    case 'USER':
                        return <Tag>User</Tag>
                    default:
                        return <Tag color="red">Unknown</Tag>
                }
            }
        },
        {
            title: 'Managed By',
            dataIndex: 'managedBy',
            key: 'managedBy',
            render: (managedBy: User) => {
                return managedBy?.name
            }
        },
        {
            title: 'Communities',
            dataIndex: ['_count', 'myCommunities'],
            key: 'communities',
            render: (count: number) => {
                return count
            }
        },
        {
            title: 'Transactions',
            dataIndex: '_count',
            key: 'transactions',
            render: ({ transactionsSent, transactionsReceived }: { transactionsSent: number, transactionsReceived: number }) => {
                return transactionsSent + transactionsReceived
            }
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

    const fetchUserList = async (search: string): Promise<{ label: string; value: string }[]> => {
        const query = new URLSearchParams({
            'where[name][contains]': search,
            'where[name][mode]': 'insensitive',
            'select[id]': 'true',
            'select[name]': 'true',
            'select[email]': 'true',
            'take': '10',
            'skip': '0',
        })
        const res = await fetch(`/api/users?${query.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const { data } = await res.json()
        return data.users.map((user: User) => ({ label: user.name, value: user.id }))
    }

    const handleSubmit = async (values: any) => {
        console.log('Form values:', values)
    }

    const handleFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const renderNewUserModal = () => {
        return (
            <Modal
                title="Create New User"
                open={isModalVisible}
                onOk={() => {
                    form
                        .validateFields()
                        .then(async (values) => {
                            await handleSubmit(values)
                            setIsModalVisible(false)
                            form.resetFields()
                        })
                        .catch((error) => handleFinishFailed(error))
                }}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input the email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select>
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="managedBy"
                        label="Managed By"
                    >
                        <DebounceSelect
                            placeholder="Select manager"
                            fetchOptions={fetchUserList}
                            style={{ width: '100%' }}
                            debounceTimeout={500}
                            value={managedUserValue}
                            onChange={(value) => setManagedUserValue(value as { label: string; value: string })}
                            allowClear
                            showSearch
                        />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    return (
        <PageLayout>
            <Row justify="space-between" align="middle">
                <Typography.Title level={3}>Users</Typography.Title>
                <Button type="primary" ghost onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                    Add User
                </Button>
            </Row>
            <Table
                loading={loading}
                dataSource={users}
                columns={columns}
                pagination={{ pageSize: 10, total }}
                onChange={handleTableChange}
            />
            {renderNewUserModal()}
        </PageLayout>
    )
}

export default Users