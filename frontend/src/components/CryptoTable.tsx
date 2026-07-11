import React, { useEffect } from 'react';
import { Table, Avatar } from 'antd';
import { useCryptoStore, type Coin } from '../store/useCryptoStore';

export const CryptoTable: React.FC = () => {
  const { coins, loading } = useCryptoStore();

  // Định nghĩa các cột cho bảng AntD giống CoinMarketCap
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
      render: (price: number) => `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`,
    },
    {
      title: '1h %',
      dataIndex: 'priceChange1h',
      key: 'priceChange1h',
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#16c784' : '#ea3943' }}>
          {val >= 0 ? '▲' : '▼'} {Math.abs(val).toFixed(2)}%
        </span>
      ),
    },
    {
      title: '24h %',
      dataIndex: 'priceChange24h',
      key: 'priceChange24h',
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#16c784' : '#ea3943' }}>
          {val >= 0 ? '▲' : '▼'} {Math.abs(val).toFixed(2)}%
        </span>
      ),
    },
    {
      title: '7d %',
      dataIndex: 'priceChange7d',
      key: 'priceChange7d',
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#16c784' : '#ea3943' }}>
          {val >= 0 ? '▲' : '▼'} {Math.abs(val).toFixed(2)}%
        </span>
      ),
    },
    {
      title: 'Market Cap',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: (cap: number) => `$${cap.toLocaleString()}`,
    },
    {
      title: 'Volume(24h)',
      dataIndex: 'volume24h',
      key: 'volume24h',
      render: (vol: number) => `$${vol.toLocaleString()}`,
    },
    {
      title: 'Circulating Supply',
      dataIndex: 'circulatingSupply',
      key: 'circulatingSupply',
      render: (supply: number, record: Coin) => `${Math.floor(supply).toLocaleString()} ${record.symbol}`,
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