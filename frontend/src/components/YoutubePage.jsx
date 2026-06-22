import { PlayCircle, ExternalLink } from 'lucide-react';
import './YoutubePage.css';

export default function YoutubePage({ youtubeLinks, product }) {
  if (!youtubeLinks || youtubeLinks.length === 0) {
    return (
      <div className="yt-page">
        <div className="yt-header">
          <PlayCircle size={22} />
          <h1>YouTube Reviews</h1>
        </div>
        <div className="yt-empty">
          <PlayCircle size={40} strokeWidth={1.5} />
          <p>No reviews yet. Search for a product first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="yt-page">
      <div className="yt-header">
        <PlayCircle size={22} />
        <h1>YouTube Reviews</h1>
        {product && <span className="yt-product-tag">{product}</span>}
      </div>

      <div className="yt-grid">
        {youtubeLinks.map((link, i) => (
          <div key={i} className="yt-card">
            <div className="yt-embed-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${getYTId(link)}`}
                title={`Review ${i + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="yt-card-footer">
              <span className="yt-badge">Review #{i + 1}</span>
              <a href={link} target="_blank" rel="noreferrer" className="yt-open-link">
                Open on YouTube <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getYTId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : '';
}
