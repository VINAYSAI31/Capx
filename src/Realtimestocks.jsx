import React, { useState, useEffect } from 'react';

export function RealTimestocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [alert, setAlert] = useState(null); // New state for custom alerts
  const API_KEY = '8CGEKJ2P0XRH5R0E'; // Replace with your Alpha Vantage API key

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${API_KEY}`
        );
        console.log('Response Status:', response.status); // Log status code
        if (response.ok) {
          const data = await response.text();
          console.log('CSV Data:', data); // Log raw data
          if (data) {
            const parsedData = parseCSV(data);
            console.log('Parsed CSV:', parsedData); // Log parsed data
            setStocks(parsedData);
          } else {
            setError('No data received from API');
          }
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching stock data:', err); // Log the error
        setError('Failed to fetch stocks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchStockData();
  }, []);
  

  const parseCSV = (data) => {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(',');
        const stock = {};
        headers.forEach((header, index) => {
          stock[header.trim()] = values[index]?.trim();
        });
        return stock;
      });
  };

  const handleAddStock = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!quantity || !buyPrice) {
      setAlert({ type: 'error', message: 'Please enter valid quantity and buy price.' });
      return;
    }

    const payload = {
      stockName: selectedStock.name,
      ticker: selectedStock.symbol,
      quantity: parseInt(quantity, 10),
      buyPrice: parseFloat(buyPrice),
    };

    try {
      const response = await fetch('https://capx-backend-production.up.railway.app/api/stocks/addstock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Stock added successfully!' });
        setShowModal(false);
        setQuantity('');
        setBuyPrice('');
      } else {
        setAlert({ type: 'error', message: 'Failed to add stock. Please try again.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error while adding stock.' });
    }
  };

  // Hide the alert automatically after 3 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Stock Market Listing</h1>

      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {alert.message}
        </div>
      )}

      {loading && <p className="text-center">Loading stocks...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && stocks.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Symbol</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Exchange</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.slice(0, 50).map((stock, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{stock.symbol}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.name}</td>
                <td className="border border-gray-300 px-4 py-2">{stock.exchange}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleAddStock(stock)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Stock</h2>
            <p className="mb-4">
              <strong>Stock:</strong> {selectedStock.name} ({selectedStock.symbol})
            </p>
            <label className="block mb-2">
              Quantity:
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </label>
            <label className="block mb-4">
              Buy Price:
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
              />
            </label>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
