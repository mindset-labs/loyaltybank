import React, { useEffect } from 'react'
import { Button, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../store'
import { fetchEvents } from '../store/events'
import PageLayout from '../components/PageLayout'
import { EditOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import DebounceSelect from 'src/components/DebounceSelect'
import { Community } from '@apiTypes'

const Events: React.FC = () => {
    const dispatch = useAppDispatch()
    const [isModalVisible, setIsModalVisible] = React.useState(false)
    const [form] = Form.useForm()
    const { events, loading, error } = useSelector((state: RootState) => state.events)
    const token = useSelector((state: RootState) => state.auth.token)
    const [eventCommunityValue, setEventCommunityValue] = React.useState<{ label: string; value: string } | null>(null)

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch])

    const columns = [
        {
            title: 'Event Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Event Tag',
            dataIndex: 'tag',
            key: 'tag',
            render: (text: string) => <Tag>{text}</Tag>,
        },
        {
            title: 'Community',
            dataIndex: ['community', 'name'],
            key: 'community',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Event Logs',
            dataIndex: ['_count', 'eventLogs'],
            key: 'eventLogs',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: any) => (
                <Space direction="horizontal">
                    {/* TODO: Add edit event */}
                    <Button type="link">
                        <EditOutlined />
                    </Button>
                    {/* TODO: Add log event */}
                    <Button type="link">
                        <PlusCircleOutlined />
                    </Button>
                </Space>
            ),
        },
    ]

    const handleSubmit = async (values: any) => {
        console.log('Form values:', values)
    }

    const handleFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const fetchCommunityOptions = async (search: string) => {
        const query = new URLSearchParams({
            'where[name][contains]': search,
            'where[name][mode]': 'insensitive',
            'paging[take]': '10',
            'paging[skip]': '0',
        })
        const response = await fetch(`/api/communities?${query.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        const { data }: { data: { communities: Community[] } } = await response.json()
        return data.communities.map((community: Community) => ({
            value: community.id,
            label: community.name,
        }))
    }

    const renderNewEventModal = () => {
        return (
            <Modal
                title="Create New Event"
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
                        label="Event Name"
                        rules={[{ required: true, message: 'Please input the event name!' }]}
                    >
                        <Input
                            maxLength={60} 
                            onBlur={(e) => {
                                const value = e.target.value.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '')
                                form.setFieldValue('tag', value)
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="tag"
                        label="Event Tag"
                        rules={[{ required: true, message: 'Please input the event tag!' }]}
                    >
                        <Input maxLength={30} />
                    </Form.Item>
                    <Form.Item
                        name="community"
                        label="Community"
                        rules={[{ required: true, message: 'Please select the community!' }]}
                    >
                        <DebounceSelect
                            showSearch
                            placeholder="Select community"
                            fetchOptions={fetchCommunityOptions}
                            debounceTimeout={500}
                            value={eventCommunityValue}
                            onChange={(value) => setEventCommunityValue(value as { label: string; value: string })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    return (
        <PageLayout>
            <Row justify="space-between" align="middle">
                <Typography.Title level={3}>Events</Typography.Title>
                <Button type="primary" ghost onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                    Add Event
                </Button>
            </Row>
            <Table
                columns={columns}
                dataSource={events}
                loading={loading}
                rowKey="id"
            />
            {error && <p>Error: {error}</p>}
            {renderNewEventModal()}
        </PageLayout>
    )
}

export default Events
