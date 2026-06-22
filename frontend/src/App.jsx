import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPage from './components/ChatPage';
import YoutubePage from './components/YoutubePage';
import HistoryPage from './components/HistoryPage';
import './index.css';
import './App.css';

export default function App() {
  const [page, setPage] = useState('chat');
  const [recentChats, setRecentChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [lastProduct, setLastProduct] = useState('');

  const handleSearch = (query, data) => {
    setRecentChats(prev => {
      const updated = [query, ...prev.filter(c => c !== query)];
      return updated.slice(0, 8);
    });
    setYoutubeLinks(data.youtube_links || []);
    setLastProduct(query);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setPage('chat');
  };

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        setPage={setPage}
        recentChats={recentChats}
        onSelectChat={handleSelectChat}
      />
      <main className="main-content">
        {page === 'chat' && (
          <ChatPage
            onSearch={handleSearch}
            initialQuery={selectedChat}
          />
        )}
        {page === 'youtube' && (
          <YoutubePage youtubeLinks={youtubeLinks} product={lastProduct} />
        )}
        {page === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}
