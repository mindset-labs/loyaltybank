import { useAppDispatch, useAppSelector } from '../store'
import PageLayout from '../components/PageLayout'
import { Button, Row, Table, Tag, Tooltip, Typography } from 'antd'
import { useEffect } from 'react'
import { fetchMyCommunities } from '../store/communities'
import { Community, Membership } from '@apiTypes'
import { EditOutlined, MailOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Communities = () => {
    const dispatch = useAppDispatch()
    const { communities, loading, error } = useAppSelector((state) => state.communities)

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
            dataIndex: 'memberships',
            key: 'memberships',
            render: (memberships: Membership[]) => memberships.length,
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
                dataSource={communities}
                columns={columns}
                pagination={false}
            />
        </PageLayout>
    )
}

export default Communities