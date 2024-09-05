import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchAllUsers } from '../store/users'
import { Breakpoint, Button, Dropdown, Form, Input, Modal, notification, Row, Select, Space, Table, TablePaginationConfig, Tag, Typography } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { TableParams } from 'src/utils/common'
import { RoleType, User } from '@apiTypes'
import PageLayout from '../components/PageLayout'
import { debounce } from 'lodash'

const Users = () => {
    const dispatch = useAppDispatch()
    const { users, loading, error, total } = useAppSelector((state) => state.users)
    const token = useAppSelector((state) => state.auth.token)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [tableParams, setTableParams] = useState<TableParams & { searchQuery?: string }>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        searchQuery: undefined,
    })
    const [notificationApi, notificationContextHolder] = notification.useNotification()

    useEffect(() => {
        const debouncedFetchUsers = debounce(() => {
            dispatch(fetchAllUsers({
                skip: ((tableParams.pagination?.current ?? 1) - 1) * (tableParams.pagination?.pageSize ?? 10),
                take: tableParams.pagination?.pageSize ?? 10,
                searchQuery: tableParams.searchQuery,
            }))
        }, 200)

        debouncedFetchUsers()

        return () => {
            debouncedFetchUsers.cancel()
        }
    }, [dispatch, tableParams.pagination])

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({ 
            ...tableParams,
            pagination,
        })
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
            ),
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
            },
        },
        {
            title: 'Managed By',
            dataIndex: 'managedBy',
            key: 'managedBy',
            render: (managedBy: User) => {
                return managedBy?.name
            },
            responsive: ['md'] as Breakpoint[],
        },
        {
            title: 'Communities',
            dataIndex: ['_count', 'myCommunities'],
            key: 'communities',
            render: (count: number) => {
                return count
            },
            responsive: ['md'] as Breakpoint[],
        },
        {
            title: 'Transactions',
            dataIndex: '_count',
            key: 'transactions',
            render: ({ transactionsSent, transactionsReceived }: { transactionsSent: number, transactionsReceived: number }) => {
                return transactionsSent + transactionsReceived
            },
            responsive: ['md'] as Breakpoint[],
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => {
                const date = new Date(text)
                return date.toLocaleDateString('en-GB')
            },
            responsive: ['md'] as Breakpoint[],
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
            responsive: ['md'] as Breakpoint[],
        },
    ]

    const handleSubmit = async (values: any) => {
        const response = await fetch('/api/users/managed', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.ok) {
            notificationApi.success({
                message: 'User created successfully',
                description: 'The user has been successfully created.'
            })
        } else {
            const { error } = await response.json()
            throw new Error(`${error.code} - ${error.message}`)
        }
    }

    const handleFinishFailed = (errorInfo: any) => {
        notificationApi.error({
            message: 'Failed to create user',
            description: errorInfo.message,
        })
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
                onCancel={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                }}
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
                            <Select.Option value="USER">User</Select.Option>
                            <Select.Option value="ADMIN">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    return (
        <PageLayout>
            <Row justify="space-between" align="middle">
                <Typography.Title level={3}>Users</Typography.Title>
                <Space size="large">
                    <Input.Search
                        placeholder="Search by name or email" 
                        loading={loading}
                        style={{ width: 250 }}
                        onChange={(e) => {
                            setTableParams({
                                ...tableParams,
                                pagination: {
                                    ...tableParams.pagination,
                                    current: 1,
                                },
                                searchQuery: e.target.value,
                            })
                        }}
                        allowClear
                    />
                    <Button type="primary" ghost onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                        Add User
                    </Button>
                </Space>
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