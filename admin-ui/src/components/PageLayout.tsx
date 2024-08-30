import { Layout } from 'antd'
import { PropsWithChildren } from 'react'

interface PageLayoutProps extends PropsWithChildren {
    style?: React.CSSProperties
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, style }) => {
    return (
        <Layout style={{ minHeight: 'calc(100vh - 156px)', ...style }}>
            { children }
        </Layout>
    )
}

export default PageLayout
