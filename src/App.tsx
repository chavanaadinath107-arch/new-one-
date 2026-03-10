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
import { UserState } from './types';

const INITIAL_BALANCE = 1000000;

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
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
        return <Home onNavigate={setActiveTab} />;
      case 'learn':
        return <TermExplainer />;
      case 'quiz':
        return <Quiz />;
      case 'simulator':
        return <Simulator userState={userState} onTrade={handleTrade} />;
      case 'chat':
        return <Chatbot />;
      case 'careers':
        return <Careers />;
      default:
        return <Home onNavigate={setActiveTab} />;
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
