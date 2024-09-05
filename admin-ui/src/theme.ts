import { ThemeConfig, theme } from 'antd'

const themeConfig: ThemeConfig = {
    token: {
        // Seed Token
        colorPrimary: '#16a085',
        borderRadius: 20,

        // Alias Token
        // colorBgContainer: '#f6ffed',
    },
    algorithm: [theme.compactAlgorithm],
    components: {
        Table: {
          size: 10
        },
    },
}

export default themeConfig