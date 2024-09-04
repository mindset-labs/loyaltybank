import { Card, Row, Col, Statistic } from 'antd'
import { Bar, Line } from 'react-chartjs-2'
import { useEffect } from 'react'
import { weekStart, weekEnd } from '@formkit/tempo'
import PageLayout from '../components/PageLayout'
import { fetchOverallStatistics, fetchTransactionsAggregations } from '../store/aggregations'
import { RootState, useAppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { UserOutlined, TeamOutlined, TransactionOutlined, DollarOutlined, GiftOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const Home = () => {
    const dispatch = useAppDispatch()
    const { transactions, overallStatistics, loading, error } = useSelector((state: RootState) => state.aggregations)

    useEffect(() => {
        const fetchData = debounce(() => {
            dispatch(fetchTransactionsAggregations({
                from: weekStart(new Date()),
                to: weekEnd(new Date())
            }))
            dispatch(fetchOverallStatistics())
        })

        fetchData()

        return () => {
            fetchData.cancel()
        }
    }, [dispatch])

    const transactionChartData = {
        labels: transactions.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Total Transactions',
                data: transactions.map(item => item.totalTransactions),
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    }

    const amountChartData = {
        labels: transactions.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Total Amounts',
                data: transactions.map(item => item.totalAmount),
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            // title: {
            //     display: true,
            //     text: 'Transaction Data',
            // },
        },
    }

    console.log(overallStatistics)

    return (
        <PageLayout>
            <div className="dashboard">
                <Row gutter={16}>
                    <Col span={24}>
                        <Card title="Overall Statistics" bordered={true}>
                            <Row gutter={16}>
                                <Col span={4}>
                                    <Statistic
                                        title="Total Users"
                                        value={ overallStatistics?.totalUsers }
                                        prefix={<UserOutlined />}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Active Communities"
                                        value={ overallStatistics?.totalActiveCommunities }
                                        prefix={<TeamOutlined />}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Total Transactions"
                                        value={ overallStatistics?.totalTransactions }
                                        prefix={<TransactionOutlined />}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Total Amount"
                                        value={ overallStatistics?.totalTransactionAmount }
                                        prefix={<DollarOutlined />}
                                        precision={2}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Average Amount"
                                        value={ overallStatistics?.averageTransactionAmount }
                                        prefix={<DollarOutlined />}
                                        precision={2}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Statistic
                                        title="Total Reward Amount"
                                        value={ overallStatistics?.totalRewardAmount }
                                        prefix={<GiftOutlined />}
                                        precision={0}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Total Transactions" bordered={true}>
                            <Bar data={transactionChartData} options={chartOptions} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Transaction Amounts" bordered={false}>
                            <Line data={amountChartData} options={chartOptions} />
                        </Card>
                    </Col>
                </Row>
            </div>
        </PageLayout>
    )
}

export default Home