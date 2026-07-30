import React, { useEffect } from 'react';
import { Table, Avatar } from 'antd';
import { useCryptoStore, type Coin } from '../store/useCryptoStore';

export const CryptoTable: React.FC = () => {
  const { coins, loading, fetchCoins, connectSocket, disconnectSocket } = useCryptoStore();

  useEffect(() => {
    fetchCoins();
    connectSocket(); // Bật kết nối Realtime khi vừa load trang

    return () => {
      disconnectSocket(); // Ngắt khi unmount
    };
  }, []);

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      width: 50,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Coin) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar src={record.image} size="small" />
          <span style={{ fontWeight: 'bold' }}>{text}</span>
          <span style={{ color: '#8592a3', fontSize: '12px' }}>{record.symbol}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Coin) => {
        // Tự động đổi màu chữ/nền tùy theo giá vừa tăng hay giảm
        const color = record.isUp === undefined ? '#fff' : record.isUp ? '#16c784' : '#ea3943';
        return (
          <span style={{ color, fontWeight: 'bold', transition: 'all 0.3s ease' }}>
            ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
          </span>
        );
      },
    },
    {
      title: '24h %',
      dataIndex: 'priceChange24h',
      key: 'priceChange24h',
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#16c784' : '#ea3943' }}>
          {val >= 0 ? '▲' : '▼'} {Math.abs(val || 0).toFixed(2)}%
        </span>
      ),
    },
    {
      title: 'Market Cap',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: (cap: number) => `$${cap?.toLocaleString()}`,
    },
    {
      title: 'Volume (24h)',
      dataIndex: 'volume24h',
      key: 'volume24h',
      render: (vol: number) => `$${vol?.toLocaleString()}`,
    },
  ];

  return (
    <Table
      dataSource={coins}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={false}
      bordered={false}
    />
  );
};

export default CryptoTable;