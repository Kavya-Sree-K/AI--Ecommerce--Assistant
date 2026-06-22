import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Newspaper, Star, Loader2, GitCompare, SlidersHorizontal, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import './ChatPage.css';

const API_URL = 'http://127.0.0.1:5000';

// ── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ rating, reviews }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const pct = (rating / 5) * 100;

  const barColor = rating >= 4 ? '#22c55e' : rating >= 3 ? '#f59e0b' : '#ef4444';

  return (
    <div className="star-rating-box">
      <div className="star-rating-top">
        <span className="star-score">{rating.toFixed(1)}</span>
        <div className="star-icons">
          {[...Array(full)].map((_, i) => <Star key={`f${i}`} size={16} className="star filled" />)}
          {half && <Star size={16} className="star half" />}
          {[...Array(empty)].map((_, i) => <Star key={`e${i}`} size={16} className="star empty" />)}
        </div>
        {reviews && <span className="star-reviews">{reviews} reviews</span>}
      </div>
      <div className="star-bar-track">
        <div className="star-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <div className="star-bar-labels">
        <span>0</span>
        <span style={{ color: barColor, fontWeight: 700 }}>{rating.toFixed(1)} / 5</span>
        <span>5</span>
      </div>
    </div>
  );
}

// ── Extract Rating from text ─────────────────────────────────────────────────
function extractRating(text) {
  if (!text) return null;
  const match = text.match(/Rating[:\s]+([0-9.]+)/i) ||
                text.match(/([0-9.]+)\s*\/\s*5/i) ||
                text.match(/rated\s+([0-9.]+)/i);
  if (match) {
    const val = parseFloat(match[1]);
    if (val >= 0 && val <= 5) return val;
  }
  return null;
}

function extractReviews(text) {
  if (!text) return null;
  const match = text.match(/Reviews[:\s]+([\d,]+)/i) ||
                text.match(/([\d,]+)\s+reviews/i) ||
                text.match(/([\d,]+)\s+ratings/i);
  return match ? match[1] : null;
}

// ── Pros & Cons Parser ───────────────────────────────────────────────────────
function parseProsConsFromText(text) {
  const pros = [];
  const cons = [];
  if (!text) return { pros, cons };
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const proKeywords = ['best', 'excellent', 'great', 'good', 'top', 'highly rated', 'recommended', 'free delivery', 'fast', 'affordable', 'value', 'popular', 'trusted', 'positive'];
  const conKeywords = ['expensive', 'costly', 'limited', 'no warranty', 'used', 'pre-owned', 'refurbished', 'slow', 'poor', 'issue', 'concern', 'negative', 'drawback', 'downside'];
  lines.forEach(line => {
    const lower = line.toLowerCase();
    const isPro = proKeywords.some(k => lower.includes(k));
    const isCon = conKeywords.some(k => lower.includes(k));
    if (isPro && !isCon && pros.length < 4) pros.push(line.replace(/^[-•*]\s*/, '').slice(0, 90));
    else if (isCon && !isPro && cons.length < 4) cons.push(line.replace(/^[-•*]\s*/, '').slice(0, 90));
  });
  if (pros.length === 0) pros.push('Highly rated by customers', 'Available across multiple platforms', 'Competitive pricing found');
  if (cons.length === 0) cons.push('Price may vary by seller', 'Check seller ratings before buying', 'Limited stock on some platforms');
  return { pros, cons };
}

// ── Extract Price ────────────────────────────────────────────────────────────
function extractPrice(text) {
  if (!text) return null;
  const match = text.match(/\$[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/[$,]/g, '')) : null;
}

// ── Result Panel ─────────────────────────────────────────────────────────────
function ResultPanel({ result, product, priceRange }) {
  const { pros, cons } = parseProsConsFromText(result?.recommendation);
  const price = extractPrice(result?.recommendation);
  const rating = extractRating(result?.recommendation);
  const reviews = extractReviews(result?.recommendation);
  const inRange = !priceRange.active || (price === null) || (price >= priceRange.min && price <= priceRange.max);

  return (
    <div className="result-panel">
      {priceRange.active && price !== null && (
        <div className={`price-badge ${inRange ? 'in-range' : 'out-range'}`}>
          {inRange ? `✓ $${price} In budget` : `✗ $${price} — Outside budget`}
        </div>
      )}

      {/* Star Rating Card */}
      {rating !== null && (
        <div className="result-card">
          <div className="card-header">
            <div className="card-icon yellow"><Star size={16} /></div>
            <h2>Customer Rating{product ? ` — ${product}` : ''}</h2>
          </div>
          <div className="card-body">
            <StarRating rating={rating} reviews={reviews} />
          </div>
        </div>
      )}

      {result?.recommendation && (
        <div className="result-card">
          <div className="card-header">
            <div className="card-icon blue"><ShoppingCart size={16} /></div>
            <h2>Recommendation{product ? ` — ${product}` : ''}</h2>
          </div>
          <div className="card-body">
            <pre className="result-text">{result.recommendation}</pre>
          </div>
        </div>
      )}

      {result?.recommendation && (
        <div className="result-card">
          <div className="card-header">
            <div className="card-icon green"><ThumbsUp size={16} /></div>
            <h2>Pros & Cons</h2>
          </div>
          <div className="pros-cons-grid">
            <div className="pros-col">
              <div className="pc-label pros-label"><ThumbsUp size={13} /> Pros</div>
              <ul>{pros.map((p, i) => <li key={i} className="pro-item">{p}</li>)}</ul>
            </div>
            <div className="cons-col">
              <div className="pc-label cons-label"><ThumbsDown size={13} /> Cons</div>
              <ul>{cons.map((c, i) => <li key={i} className="con-item">{c}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      {result?.news_analysis && (
        <div className="result-card">
          <div className="card-header">
            <div className="card-icon indigo"><Newspaper size={16} /></div>
            <h2>News & Market Analysis</h2>
          </div>
          <div className="card-body">
            <pre className="result-text">{result.news_analysis}</pre>
          </div>
        </div>
      )}

      {result?.youtube_links?.length > 0 && (
        <div className="result-card">
          <div className="card-header">
            <div className="card-icon red"><Star size={16} /></div>
            <h2>YouTube Reviews</h2>
          </div>
          <div className="youtube-links">
            {result.youtube_links.map((link, i) => (
              <a key={i} href={link} target="_blank" rel="noreferrer" className="yt-link">
                <span className="yt-num">#{i + 1}</span>Watch Review {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ChatPage ─────────────────────────────────────────────────────────────
export default function ChatPage({ onSearch, initialQuery }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [query2, setQuery2] = useState('');
  const [loading2, setLoading2] = useState(false);
  const [result2, setResult2] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState({ active: false, min: 0, max: 1000 });

  const doSearch = async (q, setRes, setLoad) => {
    if (!q.trim()) return;
    setLoad(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/search`, { product: q });
      const data = res.data;
      if (data.status === 'success') { setRes(data); onSearch(q, data); }
      else setError(data.message || 'Something went wrong');
    } catch { setError('Could not connect to server. Make sure the backend is running.'); }
    finally { setLoad(false); }
  };

  const handleSearch = () => {
    setResult(null); setResult2(null);
    doSearch(query, setResult, setLoading);
    if (compareMode && query2.trim()) doSearch(query2, setResult2, setLoading2);
  };

  useEffect(() => {
    if (initialQuery) { setQuery(initialQuery); doSearch(initialQuery, setResult, setLoading); }
  }, [initialQuery]);

  const isLoading = loading || loading2;
  const hasResults = result || result2;

  return (
    <div className="chat-page">
      <div className="chat-hero">
        <h1>Find the best product,<br /><span className="hero-accent">instantly.</span></h1>
        <p className="hero-sub">AI-powered recommendations from Google, Amazon, Walmart & eBay — with real reviews and news.</p>
        <div className="search-section">
          <div className="search-row">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder={compareMode ? "First product..." : "Search any product... e.g. iPhone 15"}
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()} disabled={isLoading} />
            </div>
            {compareMode && (
              <>
                <div className="vs-badge">VS</div>
                <div className="search-bar">
                  <Search size={18} className="search-icon" />
                  <input type="text" placeholder="Second product..." value={query2}
                    onChange={e => setQuery2(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()} disabled={isLoading} />
                </div>
              </>
            )}
            <button className="search-btn" onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <Loader2 size={16} className="spin" /> : 'Search'}
            </button>
          </div>
          <div className="toolbar">
            <button className={`toolbar-btn ${compareMode ? 'active' : ''}`}
              onClick={() => { setCompareMode(!compareMode); setResult2(null); setQuery2(''); }}>
              <GitCompare size={15} />{compareMode ? 'Exit Compare' : 'Compare Products'}
            </button>
            <button className={`toolbar-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>
              <SlidersHorizontal size={15} />Price Filter {priceRange.active ? `($${priceRange.min}–$${priceRange.max})` : ''}
            </button>
            {priceRange.active && (
              <button className="toolbar-btn clear-btn" onClick={() => setPriceRange({ active: false, min: 0, max: 1000 })}>
                <X size={13} /> Clear Filter
              </button>
            )}
          </div>
          {showFilter && (
            <div className="filter-panel">
              <p className="filter-title">Filter by Price Range</p>
              <div className="filter-row">
                <label>Min $<input type="number" value={priceRange.min} min={0} onChange={e => setPriceRange(p => ({ ...p, min: +e.target.value }))} /></label>
                <span>—</span>
                <label>Max $<input type="number" value={priceRange.max} min={0} onChange={e => setPriceRange(p => ({ ...p, max: +e.target.value }))} /></label>
                <button className="apply-btn" onClick={() => { setPriceRange(p => ({ ...p, active: true })); setShowFilter(false); }}>Apply</button>
              </div>
            </div>
          )}
        </div>
        {error && <div className="error-bar">{error}</div>}
      </div>

      {isLoading && (
        <div className="loading-state">
          <div className="loading-card">
            <Loader2 size={28} className="spin blue" />
            <div>
              <p className="loading-title">Analyzing products...</p>
              <p className="loading-sub">Searching across 4 marketplaces + YouTube + News</p>
            </div>
          </div>
        </div>
      )}

      {hasResults && !isLoading && (
        <div className={`results-wrapper ${compareMode && result2 ? 'compare-layout' : ''}`}>
          {result && <ResultPanel result={result} product={compareMode ? query : null} priceRange={priceRange} />}
          {compareMode && result2 && <ResultPanel result={result2} product={query2} priceRange={priceRange} />}
        </div>
      )}

      {!hasResults && !isLoading && (
        <div className="empty-state">
          <div className="empty-grid">
            {['iPhone 15', 'Sony WH-1000XM5', 'Nike Air Max', 'Samsung 4K TV'].map(s => (
              <button key={s} className="suggestion-chip" onClick={() => { setQuery(s); doSearch(s, setResult, setLoading); onSearch(s, {}); }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}