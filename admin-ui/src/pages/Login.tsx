import { useAppDispatch, useAppSelector } from '../store'
import PageLayout from '../components/PageLayout'
import { Form, Input, Button, Checkbox, FormProps } from 'antd'
import { Navigate } from 'react-router-dom'
import { Content } from 'antd/es/layout/layout'
import { login } from '../store/auth'

type FieldType = {
    email: string
    password: string
    remember?: string
}

const Login = () => {
    const dispatch = useAppDispatch()
    const auth = useAppSelector((state) => state.auth)

    if (auth.isAuthenticated) {
        return <Navigate to="/" />
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        dispatch(login(values))
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    return (
        <PageLayout style={{ height: '100vh' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 800, minWidth: 500, backgroundColor: 'white', padding: 40, borderRadius: 10 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <h1 style={{ textAlign: 'center' }}>Login</h1>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' }, 
                            { type: 'email', message: 'Please enter a valid email address!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            style={{ width: '100%', padding: 20 }}
                            loading={auth.loading}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </PageLayout>
    )
}

export default Login