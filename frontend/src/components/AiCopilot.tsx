import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Input, List, Avatar, Spin, Typography, message } from 'antd';
import { RobotOutlined, SendOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;
const { TextArea } = Input;

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const STORAGE_KEY = 'ai-copilot-messages';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AiCopilot: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Ref để tự động cuộn xuống cuối khung chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Giai đoạn 2: Lấy lịch sử từ localStorage nếu có
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Lỗi parse localStorage:', e);
      }
    }
    return [
      {
        sender: 'ai',
        text: 'Xin chào! Tôi là AI Copilot. Bạn muốn hỏi gì về thị trường Crypto hôm nay?',
      },
    ];
  });

  // Lưu tin nhắn vào localStorage mỗi khi messages thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  // Hàm tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hàm xóa lịch sử chat
  const clearHistory = () => {
    const initialMessages: Message[] = [
      {
        sender: 'ai',
        text: 'Xin chào! Tôi là AI Copilot. Bạn muốn hỏi gì về thị trường Crypto hôm nay?',
      },
    ];
    setMessages(initialMessages);
    localStorage.removeItem(STORAGE_KEY);
    message.success('Đã xóa lịch sử trò chuyện!');
  };

const handleSend = async () => {
  if (!input.trim() || loading) return;

  const userMsg = input.trim();

  setInput('');
  setMessages((prev) => [
    ...prev,
    { sender: 'user', text: userMsg },
  ]);
  setLoading(true);

  try {
    console.log(API_URL);
    console.log(`${API_URL}/api/ai/chat`);
    const res = await axios.post(
      `${API_URL}/api/ai/chat`,
      {
        prompt: userMsg,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    );

    const reply =
      typeof res.data?.reply === 'string'
        ? res.data.reply
        : 'AI không trả về nội dung hợp lệ.';

    setMessages((prev) => [
      ...prev,
      { sender: 'ai', text: reply },
    ]);
  } catch (error: unknown) {
    let errorMsg = 'Không thể kết nối tới AI Gateway.';

    if (axios.isAxiosError(error)) {
      console.error('AI API error:', {
        requestUrl: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        responseData: error.response?.data,
        message: error.message,
      });

      if (!error.response) {
        errorMsg =
          'Không nhận được phản hồi từ Gateway. Kiểm tra Kong, CORS hoặc URL API.';
      } else if (error.response.status === 404) {
        errorMsg = 'Không tìm thấy route /api/ai/chat trên Kong Gateway.';
      } else if (error.response.status === 502) {
        errorMsg = 'Kong Gateway không kết nối được tới BE-ms.';
      } else if (error.response.status === 500) {
        errorMsg = 'BE-ms gặp lỗi khi xử lý yêu cầu AI.';
      } else {
        errorMsg =
          error.response.data?.message ||
          `Gateway trả về lỗi HTTP ${error.response.status}.`;
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: `⚠️ Lỗi: ${errorMsg}`,
      },
    ]);

    message.error('Gửi tin nhắn thất bại!');
  } finally {
    setLoading(false);
  }
};

  // Xử lý phím Enter (Gửi) và Shift+Enter (Xuống dòng)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng mặc định của Enter
      handleSend();
    }
  };

  return (
    <>
      {/* Nút Floating Robot */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<RobotOutlined style={{ fontSize: '24px' }} />}
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
        }}
      />

      {/* Cửa sổ Drawer Chat */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RobotOutlined style={{ color: '#1890ff', fontSize: 20 }} />
              <span>CoinMarketCap AI Copilot</span>
            </div>
            {/* Nút xóa lịch sử */}
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={clearHistory}
              title="Xóa lịch sử chat"
            />
          </div>
        }
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={380}
        styles={{
          body: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#0c1017',
            padding: '16px',
          },
          header: { background: '#0c1017', color: '#fff' },
        }}
      >
        {/* Danh sách tin nhắn */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    maxWidth: '85%',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    icon={msg.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{
                      backgroundColor: msg.sender === 'user' ? '#87d068' : '#1890ff',
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      background: msg.sender === 'user' ? '#1890ff' : '#1f2937',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      lineHeight: '1.5',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            )}
          />
          {loading && (
            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <Spin size="small" /> <Text type="secondary" style={{ color: '#8592a3', fontSize: 12 }}>AI đang phân tích thị trường...</Text>
            </div>
          )}
          {/* Element ẩn để cuộn tới */}
          <div ref={messagesEndRef} />
        </div>

        {/* Ô nhập tin nhắn hỗ trợ Shift + Enter */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <TextArea
            placeholder="Nhập câu hỏi (Enter để gửi, Shift+Enter xuống dòng)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            style={{ height: 'auto', padding: '8px 16px' }}
          />
        </div>
      </Drawer>
    </>
  );
};

export default AiCopilot;