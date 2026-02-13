# CryptoPulse

Real-time cryptocurrency tracker with live prices, interactive charts, latest news, and AI-powered market analysis.

---

## Features

- **Real-time Price Tracking** - Monitor 10+ cryptocurrencies with live updates
- **Interactive Charts** - Beautiful 24-hour price charts using TradingView's Lightweight Charts
- **Latest News** - Curated crypto news with smooth scroll animations
- **AI Market Analysis** - Get AI-powered insights using Groq + Llama 3.3
- **WebSocket Updates** - Real-time price updates via Binance WebSocket
- **Modern UI** - Glassmorphic design with GSAP animations
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Accessible** - Keyboard navigation and ARIA labels

---

## IMPORTANT NOTICE FOR USA USERS

This application uses the Binance WebSocket API for real-time price updates.
Due to regulatory restrictions, Binance WebSocket connections are blocked for users located in the United States.
If you are in the USA, you will need to use a VPN browser extension and set your location to:

- **South America**
- **Europe**
- **Or another supported region**

Without this, real-time price updates via WebSocket will not work.


## Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### State & Data

- **TanStack Query (React Query)** - Server state management and caching
- **WebSocket API** - Real-time price updates

### UI & Animations

- **GSAP** - Smooth animations
- **Lightweight Charts** - Professional-grade charts
- **CSS Modules** - Scoped styling

### APIs & Services

- **Binance API** - Cryptocurrency price data
- **CryptoCompare API** - News and market data
- **Groq AI API** - AI-powered market analysis (Llama 3.3)

---

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/crypto-pulse.git
cd crypto-pulse
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file (optional - for AI features)

```bash
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server

```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

---

## Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/       # React components
│   ├── Header/
│   ├── Footer/
│   ├── CoinSearch/
│   ├── PriceChart/
│   ├── NewsCard/
│   ├── StatCard/
│   ├── AIAnalysis/
│   ├── LoadingSkeleton/
│   └── ErrorState/
├── hooks/           # Custom React hooks
│   ├── useCoinPrice.ts
│   ├── useWebSocket.ts
│   └── useCryptoNews.ts
├── services/        # API and external services
│   ├── api.ts
│   ├── websocket.ts
│   └── groq.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── formatters.ts
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

---

## Key Features

### Real-time WebSocket Connection

Connects to Binance WebSocket for live price updates with automatic reconnection logic and exponential backoff.

### AI Market Analysis

Integrates Groq's Llama 3.3 model to analyze:

- Price trends and momentum
- News sentiment analysis
- Technical support/resistance levels
- Short-term market outlook

### Smart Data Caching

Uses React Query to cache API responses, reducing unnecessary network requests and improving performance.

### Responsive Design

Mobile-first approach with breakpoints for tablet and desktop, ensuring a great experience on all devices.

---

## Supported Cryptocurrencies

- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Ripple (XRP)
- Solana (SOL)
- Polkadot (DOT)
- Dogecoin (DOGE)
- Avalanche (AVAX)
- Polygon (MATIC)
- Chainlink (LINK)

---

## Contributing

This is a portfolio project, but suggestions and feedback are welcome. Feel free to open an issue or submit a pull request.

---

## License

This project is open source and available under the MIT License.

---

## Author

**Sebastian**

- GitHub: https://github.com/Elohim2598
- LinkedIn: www.linkedin.com/in/sebastianperrone

---

## Acknowledgments

- [Binance API](https://binance.com) for cryptocurrency data
- [CryptoCompare](https://cryptocompare.com) for news API
- [Groq](https://groq.com) for AI inference
- [TradingView Lightweight Charts](https://tradingview.com) for charting library

---

**If you found this project helpful, please consider giving it a star.**
