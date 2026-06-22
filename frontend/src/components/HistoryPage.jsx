import { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import './HistoryPage.css';

const API_URL = 'http://127.0.0.1:5000';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data.history || []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/history/delete/${id}`);
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch {
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <Clock size={22} />
        <h1>Search History</h1>
        <span className="history-count">{history.length} searches</span>
      </div>

      {loading ? (
        <div className="history-loading">
          <Loader2 size={24} className="spin blue" />
          <span>Loading history...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="history-empty">
          <Clock size={40} strokeWidth={1.5} />
          <p>No search history yet.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-card-top">
                <span className="history-id">#{item.id}</span>
                <span className="history-time">{formatDate(item.timestamp)}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                >
                  {deleting === item.id
                    ? <Loader2 size={14} className="spin" />
                    : <Trash2 size={14} />}
                </button>
              </div>

              {item.recommendation && (
                <p className="history-rec">{item.recommendation.slice(0, 220)}...</p>
              )}

              {item.youtube_link && (
                <a
                  href={item.youtube_link.split(',')[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="history-yt-link"
                >
                  <ExternalLink size={12} /> Watch Review
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
