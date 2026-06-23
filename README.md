# 🛒 ShopAI — AI-Powered E-Commerce Product Recommendation System

> An intelligent multi-agent product research assistant that searches across Google, Amazon, Walmart, and eBay — then analyzes results using CrewAI to give you the best recommendation, YouTube reviews, news analysis, pros & cons, and star ratings.

---

## 📸 Features

- 🔍 **Smart Product Search** — searches 4 marketplaces simultaneously
- 🤖 **AI Recommendations** — powered by CrewAI multi-agent pipeline
- ⭐ **Star Rating UI** — visual rating bars extracted from product data
- 👍 **Pros & Cons Table** — auto-generated from AI analysis
- ⚖️ **Product Comparison** — compare two products side by side
- 💰 **Price Filter** — filter results by min/max budget
- 🎥 **YouTube Reviews** — top 5 embedded review videos
- 📰 **News & Market Analysis** — latest product news via SerpAPI
- 📜 **Search History** — saved to MySQL with timestamps and delete option

---

## 🗂️ Project Structure

```
ai_ecommerce_project/
│
├── backend/                        # Flask API
│   ├── app.py                      # Main Flask application
│   ├── crew.py                     # CrewAI crew definition
│   ├── agents.py                   # AI agents (researcher, reviewer, analyst)
│   ├── tasks.py                    # CrewAI tasks
│   ├── prompts.py                  # Agent prompts
│   ├── database.py                 # SQLAlchemy DB connection
│   ├── config.py                   # App configuration
│   ├── requirements.txt            # Python dependencies
│   ├── models/
│   │   └── history.py              # SearchHistory database model
│   └── tools/
│       ├── serp_shopping.py        # SerpAPI search functions
│       ├── youtube_tool.py         # YouTube review fetcher
│       └── news_tool.py            # News fetcher
│
├── frontend/                       # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                 # Root component + state management
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # Global CSS variables & base styles
│   │   ├── App.css                 # Layout styles
│   │   └── components/
│   │       ├── Sidebar.jsx         # Navigation sidebar
│   │       ├── Sidebar.css
│   │       ├── ChatPage.jsx        # Search + results + all features
│   │       ├── ChatPage.css
│   │       ├── YoutubePage.jsx     # Embedded YouTube reviews
│   │       ├── YoutubePage.css
│   │       ├── HistoryPage.jsx     # Search history with delete
│   │       └── HistoryPage.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── venv/                           # Python virtual environment
└── .env                            # API keys and DB config (DO NOT commit)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios, Lucide React |
| Backend | Python, Flask, Flask-CORS |
| AI Agents | CrewAI, LiteLLM |
| LLM | OpenRouter API |
| Search | SerpAPI (Google, Amazon, Walmart, eBay, YouTube, News) |
| Database | MySQL + SQLAlchemy + PyMySQL |
| Styling | Custom CSS with CSS Variables |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL Server
- VS Code (recommended)

---

### 1. Clone or Download the Project

### 2. Set Up Python Virtual Environment

```powershell
python -m venv venv
venv\Scripts\activate
```

---

### 3. Install Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

Create a `.env` file in the root folder:

> Get your SerpAPI key at https://serpapi.com
> Get your OpenRouter key at https://openrouter.ai

---

### 5. Set Up the Database

Open MySQL Workbench and run:

CREATE DATABASE ai_ecommerce;

USE ai_ecommerce;

---

### 6. Run the Backend

```powershell
cd backend
python app.py
```

---

### 7. Run the Frontend

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/search` | Search and analyze a product |
| GET | `/youtube/<product>` | Get YouTube reviews |
| GET | `/history` | Get all search history |
| DELETE | `/history/delete/<id>` | Delete a history record |

### Example POST `/search`

**Request:**
```json
{
  "product": "iPhone 15"
}
```

**Response:**
```json
{
  "status": "success",
  "product": "iPhone 15",
  "recommendation": "...",
  "youtube_reviews": "...",
  "news_analysis": "...",
  "youtube_links": ["https://youtube.com/..."]
}
```

---

## 🤖 How the AI Works

```
User searches "iPhone 15"
        ↓
SerpAPI fetches results from:
  → Google Shopping
  → Amazon
  → Walmart
  → eBay
  → YouTube (top 5 videos)
  → Google News
        ↓
CrewAI Multi-Agent Pipeline:
  Agent 1 → Product Researcher  (finds best product + price)
  Agent 2 → YouTube Reviewer    (summarizes video reviews)
  Agent 3 → News Analyst        (analyzes market news)
        ↓
Results returned to React frontend
        ↓
Saved to MySQL history
```

---

## 🌟 Frontend Features Guide

| Feature | How to Use |
|---|---|
| **Search** | Type product name → press Enter or click Search |
| **Compare** | Click "Compare Products" → enter two products |
| **Price Filter** | Click "Price Filter" → set min/max → Apply |
| **Star Rating** | Auto-shown after search if rating found |
| **Pros & Cons** | Auto-generated under every recommendation |
| **YouTube Reviews** | Click "YouTube Reviews" in sidebar |
| **History** | Click "History" in sidebar → delete with trash icon |

---

## ⚠️ Known Limitations

- SerpAPI free plan allows **100 searches/month**
- Search takes **30–60 seconds** due to multi-agent AI processing
- Price filter works on the first price found in AI recommendation text
- YouTube embeds may not work for age-restricted videos

---
