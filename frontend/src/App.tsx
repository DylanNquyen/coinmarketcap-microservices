import React, { useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { CryptoTable } from './components/CryptoTable';
import { AiCopilot } from './components/AiCopilot';
import { useCryptoStore } from './store/useCryptoStore';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  // Thay vì dùng setCoins để đổ mock data, ta lấy hàm fetchCoins từ store về
  const fetchCoins = useCryptoStore((state) => state.fetchCoins);

  useEffect(() => {
    // Tự động gọi API lên NestJS để lấy dữ liệu thực khi ứng dụng vừa chạy
    fetchCoins();
  }, [fetchCoins]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#070a0e' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#0c1017' }}>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', marginRight: '32px' }}>
          CoinMarketCap
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ background: 'transparent' }}
          items={[{ key: '1', label: 'Cryptocurrencies' }, { key: '2', label: 'Exchanges' }]}
        />
      </Header>
      
      <Content style={{ padding: '24px 50px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Title level={2} style={{ color: '#fff' }}>Today's Cryptocurrency Prices by Market Cap</Title>
        </div>
        <div style={{ background: '#0c1017', padding: '24px', borderRadius: '8px' }}>
          {/* Component này bên trong sẽ lấy dữ liệu trực tiếp từ store để hiển thị */}
          <CryptoTable />
        </div>
      </Content>
      <AiCopilot />
    </Layout>
  );
};

export default App;