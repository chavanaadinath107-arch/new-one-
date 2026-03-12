/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import TermExplainer from './components/TermExplainer';
import Quiz from './components/Quiz';
import Chatbot from './components/Chatbot';
import Simulator from './components/Simulator';
import Careers from './components/Careers';
import Premium from './components/Premium';
import AdminPanel from './components/AdminPanel';
import PortfolioTracker from './components/PortfolioTracker';
import { UserState, Stock } from './types';

const INITIAL_BALANCE = 1000000;

const INITIAL_STOCKS: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, change: 45.20, changePercent: 1.55, history: [] },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.15, change: -12.40, changePercent: -0.30, history: [] },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1450.60, change: 5.15, changePercent: 0.36, history: [] },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1620.30, change: -8.45, changePercent: -0.52, history: [] },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1080.25, change: 12.10, changePercent: 1.13, history: [] },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3240.80, change: 85.40, changePercent: 2.70, history: [] },
];

const generateHistory = (basePrice: number) => {
  const history = [];
  let currentPrice = basePrice;
  for (let i = 40; i >= 0; i--) {
    const time = new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const open = currentPrice;
    const volatility = basePrice * 0.01;
    const close = open + (Math.random() * volatility * 2 - volatility);
    const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
    
    currentPrice = close;
    history.push({ 
      time, 
      price: parseFloat(close.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2))
    });
  }
  return history;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [stocks, setStocks] = useState<Stock[]>(() => 
    INITIAL_STOCKS.map(s => ({ ...s, history: generateHistory(s.price) }))
  );
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('stock_sense_user');
    return saved ? JSON.parse(saved) : {
      balance: INITIAL_BALANCE,
      portfolio: []
    };
  });

  useEffect(() => {
    localStorage.setItem('stock_sense_user', JSON.stringify(userState));
  }, [userState]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const volatility = 0.002;
        const change = stock.price * (Math.random() * volatility * 2 - volatility);
        const newPrice = Math.max(1, stock.price + change);
        
        const open = stock.price;
        const close = newPrice;
        const high = Math.max(open, close) + (Math.random() * stock.price * 0.001);
        const low = Math.min(open, close) - (Math.random() * stock.price * 0.001);

        const newHistory = [...stock.history.slice(1), { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          price: parseFloat(newPrice.toFixed(2)),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2))
        }];
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat((newPrice - stock.history[0].price).toFixed(2)),
          changePercent: parseFloat(((newPrice - stock.history[0].price) / stock.history[0].price * 100).toFixed(2)),
          history: newHistory
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (symbol: string, shares: number, price: number, type: 'buy' | 'sell') => {
    setUserState(prev => {
      const totalCost = shares * price;
      
      if (type === 'buy') {
        if (prev.balance < totalCost) return prev;
        
        const existing = prev.portfolio.find(p => p.symbol === symbol);
        let newPortfolio;
        
        if (existing) {
          const newTotalShares = existing.shares + shares;
          const newAvgPrice = ((existing.avgPrice * existing.shares) + (price * shares)) / newTotalShares;
          newPortfolio = prev.portfolio.map(p => 
            p.symbol === symbol ? { ...p, shares: newTotalShares, avgPrice: parseFloat(newAvgPrice.toFixed(2)) } : p
          );
        } else {
          newPortfolio = [...prev.portfolio, { symbol, shares, avgPrice: price }];
        }
        
        return {
          balance: parseFloat((prev.balance - totalCost).toFixed(2)),
          portfolio: newPortfolio
        };
      } else {
        const existing = prev.portfolio.find(p => p.symbol === symbol);
        if (!existing || existing.shares < shares) return prev;
        
        const newShares = existing.shares - shares;
        let newPortfolio;
        
        if (newShares === 0) {
          newPortfolio = prev.portfolio.filter(p => p.symbol !== symbol);
        } else {
          newPortfolio = prev.portfolio.map(p => 
            p.symbol === symbol ? { ...p, shares: newShares } : p
          );
        }
        
        return {
          balance: parseFloat((prev.balance + totalCost).toFixed(2)),
          portfolio: newPortfolio
        };
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} userState={userState} stocks={stocks} />;
      case 'learn':
        return <TermExplainer />;
      case 'quiz':
        return <Quiz />;
      case 'simulator':
        return <Simulator userState={userState} onTrade={handleTrade} stocks={stocks} setStocks={setStocks} />;
      case 'portfolio':
        return <PortfolioTracker userState={userState} stocks={stocks} />;
      case 'chat':
        return <Chatbot />;
      case 'analytics':
        return <Premium userState={userState} stocks={stocks} />;
      case 'admin':
        return <AdminPanel />;
      case 'careers':
        return <Careers />;
      default:
        return <Home onNavigate={setActiveTab} userState={userState} stocks={stocks} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      balance={userState.balance}
    >
      {renderContent()}
    </Layout>
  );
}
