import { useAppDispatch, useAppSelector } from '../store'
import PageLayout from '../components/PageLayout'
import { Button, Form, Input, Modal, Row, Switch, Table, Tag, Tooltip, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { fetchMyCommunities } from '../store/communities'
import { Community, Membership } from '@apiTypes'
import { EditOutlined, MailOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Communities = () => {
    const dispatch = useAppDispatch()
    const { communities, loading, error } = useAppSelector((state) => state.communities)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        dispatch(fetchMyCommunities())
    }, [dispatch])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Community) => (
                <Link to={`/communities/${record.id}`}>
                    <Typography.Link style={{ fontWeight: 'bold' }}>{text}</Typography.Link>
                </Link>
            ),
            width: '15%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                switch (status) {
                    case 'ACTIVE':
                        return <Tag color="green">Active</Tag>
                    case 'INACTIVE':
                        return <Tag color="red">Inactive</Tag>
                    default:
                        return <Tag color="default">{status}</Tag>
                }
            },
        },
        {
            title: 'Members',
            dataIndex: ['_count', 'memberships'],
            key: 'memberships',
            render: (count: number) => count,
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: string, record: Community) => (
                <Row justify="space-between" align="middle">
                    <Tooltip title="Edit Community">
                        <Button
                            type="link"
                            onClick={() => alert(record.id)}
                        >
                            <EditOutlined />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Invite Members">
                        <Button
                            type="link"
                            onClick={() => alert(record.id)}
                        >
                            <MailOutlined />
                        </Button>
                    </Tooltip>
                </Row>
            ),
            width: '128px'
        },
    ]

    const handleSubmit = async (values: any) => {
        console.log('Form values:', values)
    }

    const handleFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const renderNewCommunityModal = () => {
        return (
            <Modal
                title="Create New Community"
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
                    form.resetFields()
                    setIsModalVisible(false)
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Community Name"
                        rules={[{ required: true, message: 'Please input the community name!' }]}
                    >
                        <Input maxLength={60} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Community Description"
                        rules={[{ required: true, message: 'Please input the community description!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="isPublic"
                        label="Community Visibility"
                        rules={[{ required: true, message: 'Please select the community visibility!' }]}
                    >
                        <Switch checkedChildren="Public" unCheckedChildren="Private" defaultChecked={true} />
                    </Form.Item>
                    <Form.Item
                        name="pointsTokenName"
                        label="Points Token Name"
                        rules={[{ required: true, message: 'Please input the points token name!' }]}
                    >
                        <Input placeholder="e.g. Smiles Points" />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    return (
        <PageLayout>
            <Row justify="space-between" align="middle">
                <Typography.Title level={3}>My Communities</Typography.Title>
                <Button type="primary" ghost onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                    Add Community
                </Button>
            </Row>
            <Table
                loading={loading}
                dataSource={communities}
                columns={columns}
                pagination={false}
            />
            {renderNewCommunityModal()}
        </PageLayout>
    )
}

export default Communities