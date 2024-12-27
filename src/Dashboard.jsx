import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { FaWallet } from 'react-icons/fa';
import { StockList } from './StockList';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [topStock, setTopStock] = useState(null);

  // Fetch stock data from an API
  useEffect(() => {
    fetch('https://capx-backend-production.up.railway.app/api/stocks/getall')
      .then((response) => response.json())
      .then((data) => {
        setStocks(data);

        // Find top performing stock
        const bestStock = data.reduce((top, stock) => {
          // Assuming 'gain' or similar metric is available; adjust logic as needed
          const performance = stock.gain || stock.currentPrice - stock.purchasePrice; 
          return !top || performance > top.performance
            ? { name: stock.name, performance }
            : top;
        }, null);

        setTopStock(bestStock);
      })
      .catch((error) => console.error('Error fetching stock data:', error));
  }, []);

  // Fetch portfolio value from the API
  useEffect(() => {
    fetch('https://capx-backend-production.up.railway.app/api/stocks/portfolio-value')
      .then((response) => response.json())
      .then((data) => setPortfolioValue(data))
      .catch((error) => console.error('Error fetching portfolio value:', error));
  }, []);

  useEffect(() => {
    fetch('https://capx-backend-production.up.railway.app/api/stocks/getall')
      .then((response) => response.json())
      .then((data) => {
        console.log('Stock Data:', data); // Log API response
        setStocks(data);
  
        // Calculate the top-performing stock based on investment value
        const topStock = data.reduce((best, stock) => {
          const investment = stock.buyPrice * stock.quantity; // Calculate total investment
          return !best || investment > best.investment
            ? { name: stock.stockName, investment } // Use stock.stockName instead of stock.name
            : best;
        }, null);
  
        console.log('Top Stock:', topStock); // Log the resulting top stock
        setTopStock(topStock); // Save for rendering
      })
      .catch((error) => console.error('Error fetching stock data:', error));
  }, []);
  
  
  // Format currency function
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FaWallet className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Portfolio Tracker</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Portfolio Value Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Portfolio Value</p>
              <p className="text-2xl font-bold">{formatCurrency(portfolioValue)}</p>
            </div>
          </div>
        </div>

{/* Top Performing Stock Card */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <div className="flex items-center">
    <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
    <div>
      <p className="text-sm text-gray-500">Top Performing Stock</p>
      <p className="text-2xl font-bold">
        {topStock ? `${topStock.name} (${formatCurrency(topStock.investment)})` : 'N/A'}
      </p>
    </div>
  </div>
</div>



        {/* Number of Holdings Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Number of Holdings</p>
              <p className="text-2xl font-bold">{stocks.length}</p>
            </div>
          </div>
        </div>
      </div>
      <StockList />
    </>
  );
};

export default Dashboard;
