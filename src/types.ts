export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: { time: string; price: number; open: number; high: number; low: number; close: number }[];
}

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgPrice: number;
}

export interface UserState {
  balance: number;
  portfolio: PortfolioItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
