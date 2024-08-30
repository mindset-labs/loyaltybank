import React, { useState } from 'react'
import {
  AppstoreOutlined,
  ShopOutlined,
  TransactionOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Communities from './pages/Communities'
import Users from './pages/Users'
import Transactions from './pages/Transactions'
import Achievements from './pages/Achievements'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAppDispatch, useAppSelector } from './store'
import { logout } from './store/auth'
import NotFound from './pages/NotFound'

const { Header, Content, Footer, Sider } = Layout

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const dispatch = useAppDispatch()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  const renderMenu = () => {
    return (
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
      >
        <Menu.Item key="/" icon={<UserOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/communities" icon={<UploadOutlined />}>
          <Link to="/communities">Communities</Link>
        </Menu.Item>
        <Menu.Item key="/users" icon={<AppstoreOutlined />}>
          <Link to="/users">Users</Link>
        </Menu.Item>
        <Menu.Item key="/transactions" icon={<TransactionOutlined />}>
          <Link to="/transactions">Transactions</Link>
        </Menu.Item>
        <Menu.Item key="/achievements" icon={<ShopOutlined />}>
          <Link to="/achievements">Achievements</Link>
        </Menu.Item>
      </Menu>
    )
  }

  const renderContent = () => {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/users" element={<Users />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  const renderAuthPages = () => {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    )
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  if (isAuthPage) {
    return renderAuthPages()
  } else if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <Layout hasSider>
      <Sider
        style={siderStyle}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className='App-logo' />
        {renderMenu()}
      </Sider>
      <Layout style={{ marginInlineStart: collapsed ? 0 : 200 }}>
        <Header style={{ padding: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
            Hello { user?.name }
          </div>
          <Button type='primary' onClick={() => dispatch(logout())}>Logout</Button>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          {renderContent()}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          LoyaltyBank ©{new Date().getFullYear()} Created by Mindset Labs
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App