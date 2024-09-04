import { useEffect, useState } from 'react'
import { Button, Row, Table, TablePaginationConfig, Tag, Typography } from 'antd'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchAchievements } from '../store/achievements'
import PageLayout from '../components/PageLayout'
import { TableParams } from 'src/utils/common'
import { PlusOutlined } from '@ant-design/icons'
import { AchievementStatusType, Achievement } from '@apiTypes'
import { Link } from 'react-router-dom'
import { debounce } from 'lodash'

const Achievements = () => {
    const dispatch = useAppDispatch()
    const { achievements, total, loading } = useAppSelector((state) => state.achievements)
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    })

    useEffect(() => {
        const debouncedFetchAchievements = debounce(() => {
            dispatch(fetchAchievements({
                skip: ((tableParams.pagination?.current ?? 1) - 1) * (tableParams.pagination?.pageSize ?? 10),
                take: tableParams.pagination?.pageSize ?? 10,
            }))
        }, 200)

        debouncedFetchAchievements()

        return () => {
            debouncedFetchAchievements.cancel()
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
            render: (id: string) => (
                <Link to={`/achievements/${id}`}>
                    <Typography.Link>
                        { id.substring(0, 6) }...
                    </Typography.Link>
                </Link>
            ),
        },
        {
            title: 'Achievement Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Reward Amount',
            dataIndex: 'rewardAmount',
            key: 'rewardAmount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: AchievementStatusType) => {
                switch (status) {
                    case 'ACTIVE':
                        return <Tag color="green">{status}</Tag>
                    case 'INACTIVE':
                        return <Tag color="orange">{status}</Tag>
                    case 'ARCHIVED':
                    default:
                        return <Tag color="gray">{status}</Tag>
                }
            }
        },
        {
            title: 'Earned Count',
            dataIndex: ['_count', 'achievementRewards'],
            key: 'earnedCount',
            render: (count: number) => (
                <Typography.Text>{count}</Typography.Text>
            )
        },
        {
            title: 'Community',
            dataIndex: ['community', 'name'],
            key: 'community',
            render: (communityName: string) => (
                <Typography.Text>{communityName}</Typography.Text>
            )
        }
    ]

    return (
        <PageLayout>
            <Row justify="space-between" align="middle">
                <Typography.Title level={3}>Achievements</Typography.Title>
                <Button type="primary" ghost onClick={() => alert('Add Achievement')} icon={<PlusOutlined />}>
                    Add Achievement
                </Button>
            </Row>
            <Table
                columns={columns}
                dataSource={achievements}
                pagination={{ total, current: tableParams.pagination?.current ?? 1 }}
                loading={loading}
                onChange={handleTableChange}
                rowKey={(record) => record.id}
            />
        </PageLayout>
    )
}

export default Achievements