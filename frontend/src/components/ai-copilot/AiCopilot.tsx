// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Drawer, Input, List, Avatar, Spin, Typography, message } from 'antd';
// import { RobotOutlined, SendOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const { Text } = Typography;
// const { TextArea } = Input;

// interface Message {
//   sender: 'user' | 'ai';
//   text: string;
// }

// const STORAGE_KEY = 'ai-copilot-messages';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// export const AiCopilot: React.FC = () => {
//   const [visible, setVisible] = useState(false);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   // Ref để tự động cuộn xuống cuối khung chat
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Giai đoạn 2: Lấy lịch sử từ localStorage nếu có
//   const [messages, setMessages] = useState<Message[]>(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch (e) {
//         console.error('Lỗi parse localStorage:', e);
//       }
//     }
//     return [
//       {
//         sender: 'ai',
//         text: 'Xin chào! Tôi là AI Copilot. Bạn muốn hỏi gì về thị trường Crypto hôm nay?',
//       },
//     ];
//   });

//   // Lưu tin nhắn vào localStorage mỗi khi messages thay đổi
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
//     scrollToBottom();
//   }, [messages]);

//   // Hàm tự động cuộn xuống tin nhắn mới nhất
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // Hàm xóa lịch sử chat
//   const clearHistory = () => {
//     const initialMessages: Message[] = [
//       {
//         sender: 'ai',
//         text: 'Xin chào! Tôi là AI Copilot. Bạn muốn hỏi gì về thị trường Crypto hôm nay?',
//       },
//     ];
//     setMessages(initialMessages);
//     localStorage.removeItem(STORAGE_KEY);
//     message.success('Đã xóa lịch sử trò chuyện!');
//   };

// const handleSend = async () => {
//   if (!input.trim() || loading) return;

//   const userMsg = input.trim();

//   setInput('');
//   setMessages((prev) => [
//     ...prev,
//     { sender: 'user', text: userMsg },
//   ]);
//   setLoading(true);

//   try {
//     console.log(API_URL);
//     console.log(`${API_URL}/api/ai/chat`);
//     const res = await axios.post(
//       `${API_URL}/api/ai/chat`,
//       {
//         prompt: userMsg,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         timeout: 30000,
//       },
//     );

//     const reply =
//       typeof res.data?.reply === 'string'
//         ? res.data.reply
//         : 'AI không trả về nội dung hợp lệ.';

//     setMessages((prev) => [
//       ...prev,
//       { sender: 'ai', text: reply },
//     ]);
//   } catch (error: unknown) {
//     let errorMsg = 'Không thể kết nối tới AI Gateway.';

//     if (axios.isAxiosError(error)) {
//       console.error('AI API error:', {
//         requestUrl: error.config?.url,
//         method: error.config?.method,
//         status: error.response?.status,
//         responseData: error.response?.data,
//         message: error.message,
//       });

//       if (!error.response) {
//         errorMsg =
//           'Không nhận được phản hồi từ Gateway. Kiểm tra Kong, CORS hoặc URL API.';
//       } else if (error.response.status === 404) {
//         errorMsg = 'Không tìm thấy route /api/ai/chat trên Kong Gateway.';
//       } else if (error.response.status === 502) {
//         errorMsg = 'Kong Gateway không kết nối được tới BE-ms.';
//       } else if (error.response.status === 500) {
//         errorMsg = 'BE-ms gặp lỗi khi xử lý yêu cầu AI.';
//       } else {
//         errorMsg =
//           error.response.data?.message ||
//           `Gateway trả về lỗi HTTP ${error.response.status}.`;
//       }
//     }

//     setMessages((prev) => [
//       ...prev,
//       {
//         sender: 'ai',
//         text: `⚠️ Lỗi: ${errorMsg}`,
//       },
//     ]);

//     message.error('Gửi tin nhắn thất bại!');
//   } finally {
//     setLoading(false);
//   }
// };

//   // Xử lý phím Enter (Gửi) và Shift+Enter (Xuống dòng)
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault(); // Ngăn xuống dòng mặc định của Enter
//       handleSend();
//     }
//   };

//   return (
//     <>
//       {/* Nút Floating Robot */}
//       <Button
//         type="primary"
//         shape="circle"
//         size="large"
//         icon={<RobotOutlined style={{ fontSize: '24px' }} />}
//         onClick={() => setVisible(true)}
//         style={{
//           position: 'fixed',
//           bottom: 30,
//           right: 30,
//           width: 60,
//           height: 60,
//           zIndex: 1000,
//           boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
//         }}
//       />

//       {/* Cửa sổ Drawer Chat */}
//       <Drawer
//         title={
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <RobotOutlined style={{ color: '#1890ff', fontSize: 20 }} />
//               <span>CoinMarketCap AI Copilot</span>
//             </div>
//             {/* Nút xóa lịch sử */}
//             <Button
//               type="text"
//               danger
//               icon={<DeleteOutlined />}
//               onClick={clearHistory}
//               title="Xóa lịch sử chat"
//             />
//           </div>
//         }
//         placement="right"
//         onClose={() => setVisible(false)}
//         open={visible}
//         width={380}
//         styles={{
//           body: {
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//             background: '#0c1017',
//             padding: '16px',
//           },
//           header: { background: '#0c1017', color: '#fff' },
//         }}
//       >
//         {/* Danh sách tin nhắn */}
//         <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
//           <List
//             dataSource={messages}
//             renderItem={(msg) => (
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
//                   marginBottom: 12,
//                 }}
//               >
//                 <div
//                   style={{
//                     display: 'flex',
//                     gap: 8,
//                     maxWidth: '85%',
//                     flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
//                   }}
//                 >
//                   <Avatar
//                     icon={msg.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
//                     style={{
//                       backgroundColor: msg.sender === 'user' ? '#87d068' : '#1890ff',
//                       flexShrink: 0,
//                     }}
//                   />
//                   <div
//                     style={{
//                       background: msg.sender === 'user' ? '#1890ff' : '#1f2937',
//                       color: '#fff',
//                       padding: '8px 12px',
//                       borderRadius: 8,
//                       fontSize: 13,
//                       lineHeight: '1.5',
//                       whiteSpace: 'pre-line',
//                     }}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               </div>
//             )}
//           />
//           {loading && (
//             <div style={{ textAlign: 'center', margin: '12px 0' }}>
//               <Spin size="small" /> <Text type="secondary" style={{ color: '#8592a3', fontSize: 12 }}>AI đang phân tích thị trường...</Text>
//             </div>
//           )}
//           {/* Element ẩn để cuộn tới */}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Ô nhập tin nhắn hỗ trợ Shift + Enter */}
//         <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
//           <TextArea
//             placeholder="Nhập câu hỏi (Enter để gửi, Shift+Enter xuống dòng)..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             autoSize={{ minRows: 1, maxRows: 4 }}
//             disabled={loading}
//           />
//           <Button
//             type="primary"
//             icon={<SendOutlined />}
//             onClick={handleSend}
//             loading={loading}
//             style={{ height: 'auto', padding: '8px 16px' }}
//           />
//         </div>
//       </Drawer>
//     </>
//   );
// };

// export default AiCopilot;

import React, { useCallback, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  AI_COPILOT_ASK_EVENT,
  type AiCopilotAskEventDetail,
} from './aiCopilot.events';
import styles from './AiCopilot.module.css';
import { usePreferencesStore } from '@/store/usePreferencesStore';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionResultItem;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

const STORAGE_KEY = 'ai-copilot-messages';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AiCopilot: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showHiddenNotice, setShowHiddenNotice] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const language = usePreferencesStore((state) => state.language);
  const isAiAssistantEnabled = usePreferencesStore(
    (state) => state.isAiAssistantEnabled,
  );
  const setAiAssistantEnabled = usePreferencesStore(
    (state) => state.setAiAssistantEnabled,
  );
  const isVietnamese = language === 'vi';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref dùng để focus ô gõ chữ khi bấm hotkey
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  //HOTKEY SHIFT + /
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Bấm Shift + /
      if (e.shiftKey && (e.key === '/' || e.key === '?')) {
        // Nếu người dùng đang gõ chữ trong 1 ô input/textarea khác ngoài AI Copilot thì không trigger hotkey
        const activeElement = document.activeElement;
        const isTypingInOtherInput =
          activeElement &&
          (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') &&
          activeElement !== textareaRef.current;

        if (isTypingInOtherInput) return;

        e.preventDefault(); // Ngăn nhập ký tự '?' vào trang web
        if (isAiAssistantEnabled) {
          setVisible((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isAiAssistantEnabled]);

  useEffect(() => {
    if (!isAiAssistantEnabled) {
      recognitionRef.current?.stop();
    }
  }, [isAiAssistantEnabled]);

  useEffect(() => {
    if (!showHiddenNotice) return;

    const timeoutId = window.setTimeout(() => setShowHiddenNotice(false), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [showHiddenNotice]);

  const hideAssistant = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setVisible(false);
    setShowHiddenNotice(true);
    setAiAssistantEnabled(false);
  };

  // Tự động Focus vào ô nhập tin nhắn khi mở AI Copilot
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [visible]);

  // --- LOGIC NHẬP LIỆU GIỌNG NÓI ---
  const handleVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      'Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói!',
    );
    return;
  }

  if (isListening) {
    recognitionRef.current?.stop();
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = 'vi-VN';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let currentTranscript = '';

    for (
      let index = event.resultIndex;
      index < event.results.length;
      index += 1
    ) {
      currentTranscript +=
        event.results[index][0].transcript;
    }

    if (currentTranscript.trim()) {
      setInput(currentTranscript);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Lỗi microphone:', event.error);

    recognitionRef.current = null;
    setIsListening(false);

    if (event.error === 'not-allowed') {
      alert(
        'Bạn chưa cấp quyền Microphone cho trang web!',
      );
    }
  };

  recognition.onend = () => {
    recognitionRef.current = null;
    setIsListening(false);
  };

  recognitionRef.current = recognition;

  try {
    recognition.start();
  } catch (error) {
    console.error(
      'Không thể bắt đầu thu âm:',
      error,
    );

    recognitionRef.current = null;
    setIsListening(false);
  }
};

  useEffect(() => {
  return () => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
  };
}, []);

  // --- LOGIC LOCAL STORAGE & API AXIOS ---
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
        text: 'Xin chào! Tôi là CMC AI Copilot. Bạn muốn hỏi gì về thị trường Crypto hôm nay?',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearHistory = () => {
    const initialMessages: Message[] = [
      {
        sender: 'ai',
        text: 'Xin chào! Tôi là CMC AI Copilot. Bạn muốn hỏi gì về thị trường Crypto hôm nay?',
      },
    ];
    setMessages(initialMessages);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSend = useCallback(async (overridePrompt?: string) => {
    const userMsg = (overridePrompt || input).trim();
    if (!userMsg || loading) return;

    if (!overridePrompt) setInput('');

    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/ai/chat`,
        { prompt: userMsg },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        },
      );

      const reply =
        typeof res.data?.reply === 'string'
          ? res.data.reply
          : 'AI không trả về nội dung hợp lệ.';

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (error: unknown) {
      let errorMsg = 'Không thể kết nối tới AI Gateway.';
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          errorMsg = 'Không nhận được phản hồi từ Gateway. Kiểm tra Kong, CORS hoặc URL API.';
        } else if (error.response.status === 404) {
          errorMsg = 'Không tìm thấy route /api/ai/chat trên Kong Gateway.';
        } else if (error.response.status === 502) {
          errorMsg = 'Kong Gateway không kết nối được tới BE-ms.';
        } else if (error.response.status === 500) {
          errorMsg = 'BE-ms gặp lỗi khi xử lý yêu cầu AI.';
        } else {
          errorMsg = error.response.data?.message || `Lỗi HTTP ${error.response.status}.`;
        }
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: `⚠️ Lỗi: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  useEffect(() => {
    const handleAskRequest = (event: Event) => {
      const { prompt } = (event as CustomEvent<AiCopilotAskEventDetail>)
        .detail;

      if (!prompt?.trim() || loading) {
        return;
      }

      if (!isAiAssistantEnabled) return;

      setVisible(true);
      setInput(prompt);
      void handleSend(prompt);
    };

    window.addEventListener(AI_COPILOT_ASK_EVENT, handleAskRequest);

    return () => {
      window.removeEventListener(AI_COPILOT_ASK_EVENT, handleAskRequest);
    };
  }, [handleSend, isAiAssistantEnabled, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { label: '🔥 CLARITY bill stalls as Senate recess nears' },
    { label: '📈 Why is the market up today?' },
    { label: '🔀 Are altcoins outperforming Bitcoin?' },
    { label: '🗣 What are the trending narratives?' },
  ];

  return (
    <div className={styles.copilotWrapper}>
      {showHiddenNotice && (
        <div className={styles.hiddenNotice} role="status">
          <strong>
            {isVietnamese ? 'Đã ẩn Trợ lý AI CMC' : 'CMC AI Assistant hidden'}
          </strong>
          <span>
            {isVietnamese
              ? 'Bạn có thể bật lại bất kỳ lúc nào trong menu người dùng.'
              : 'You can enable it again any time in the user menu.'}
          </span>
        </div>
      )}

      {isAiAssistantEnabled && (
        <>
      {visible && (
        <div className={styles.chatCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.aiIcon}>⚡</span>
              <span className={styles.titleText}>CMC AI</span>
              <span className={styles.fullPageBadge}>⤢ View Full Page</span>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.closeButton} onClick={clearHistory} title="Xóa lịch sử">
                🗑
              </button>
              <button className={styles.closeButton} onClick={() => setVisible(false)}>
                ✕
              </button>
            </div>
          </div>

          <div className={styles.suggestionsGrid}>
            {suggestions.map((item, idx) => (
              <button key={idx} className={styles.chip} onClick={() => handleSend(item.label)}>
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.messagesArea}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.msgRow} ${
                  msg.sender === 'user' ? styles.userRow : styles.aiRow
                }`}
              >
                <div
                  className={`${styles.msgBubble} ${
                    msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.msgRow} ${styles.aiRow}`}>
                <div className={`${styles.msgBubble} ${styles.aiBubble}`}>
                  AI đang phân tích dữ liệu...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputSection}>
            <textarea
              ref={textareaRef} // Gắn ref vào đây để tự động focus
              className={styles.inputBox}
              placeholder={isListening ? 'Đang lắng nghe...' : 'Ask CMC AI...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={loading}
            />
            <div className={styles.inputFooter}>
              <div className={styles.proBadge}>
                <span>⚙ Pro · 4 questions left</span>
              </div>
              <div className={styles.inputActions}>
                <button
  type="button"
  className={`${styles.micButton} ${
    isListening ? styles.micActive : ''
  }`}
  onClick={handleVoiceInput}
  title={
    isListening
      ? 'Dừng nhập giọng nói'
      : 'Nhập bằng giọng nói'
  }
  aria-label={
    isListening
      ? 'Dừng nhập giọng nói'
      : 'Nhập bằng giọng nói'
  }
  aria-pressed={isListening}
>
  🎙
</button>
                <button
                  className={styles.sendButton}
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                >
                  ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.triggerBar} onClick={() => setVisible(!visible)}>
        <div className={styles.triggerLeft}>
          <span className={styles.aiIcon}>⚡</span>
          <span>Ask CMC AI</span>
        </div>
        <div className={styles.triggerRight}>
          <span className={styles.shortcutBadge}>Shift + /</span>
          <button
  type="button"
  className={styles.hideButton}
  title={isVietnamese ? 'Ẩn Trợ lý AI CMC' : 'Hide CMC AI Assistant'}
  aria-label={isVietnamese ? 'Ẩn Trợ lý AI CMC' : 'Hide CMC AI Assistant'}
  onClick={hideAssistant}
>
  👁
</button>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AiCopilot;
