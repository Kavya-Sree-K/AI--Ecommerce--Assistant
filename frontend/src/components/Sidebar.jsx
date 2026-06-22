import { ShoppingBag, PlayCircle, Clock, Sparkles } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { id: 'chat', label: 'Search', icon: ShoppingBag },
  { id: 'youtube', label: 'YouTube Reviews', icon: PlayCircle },
  { id: 'history', label: 'History', icon: Clock },
];

export default function Sidebar({ page, setPage, recentChats, onSelectChat }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><Sparkles size={18} /></div>
        <span className="brand-name">ShopAI</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${page === id ? 'active' : ''}`}
            onClick={() => setPage(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {recentChats.length > 0 && (
        <div className="recent-section">
          <p className="recent-label">Recent Searches</p>
          <ul className="recent-list">
            {recentChats.map((chat, i) => (
              <li key={i}>
                <button className="recent-item" onClick={() => onSelectChat(chat)}>
                  <ShoppingBag size={13} />
                  <span>{chat}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="sidebar-footer">
        <p>Powered by CrewAI + SerpAPI</p>
      </div>
    </aside>
  );
}
