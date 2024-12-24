import React, { useEffect, useState } from "react";

export function StockList() {
  const [updatedStocks, setUpdatedStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const [editModal, setEditModal] = useState({ visible: false, stock: null });
  const [formData, setFormData] = useState({ quantity: "", buyPrice: "" });

  // Fetch stocks from API
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:9090/api/stocks/getall");
        if (response.ok) {
          const data = await response.json();
          setUpdatedStocks(data);
        } else {
          setError("Failed to fetch stocks");
        }
      } catch (err) {
        setError("Error fetching stocks");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Handle stock deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:9090/api/stocks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUpdatedStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
        showAlert("Stock deleted successfully", "success");
      } else {
        showAlert("Failed to delete stock", "error");
      }
    } catch (err) {
      console.error("Error deleting stock:", err);
      showAlert("Error deleting stock", "error");
    }
  };

  // Handle Edit Modal
  const openEditModal = (stock) => {
    setEditModal({ visible: true, stock });
    setFormData({ quantity: stock.quantity, buyPrice: stock.buyPrice });
  };

  const closeEditModal = () => {
    setEditModal({ visible: false, stock: null });
    setFormData({ quantity: "", buyPrice: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { stock } = editModal;

    try {
      const response = await fetch(`http://localhost:9090/api/stocks/${stock.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: formData.quantity,
          buyPrice: formData.buyPrice,
        }),
      });

      if (response.ok) {
        const updatedStock = await response.json();
        setUpdatedStocks((prevStocks) =>
          prevStocks.map((s) => (s.id === updatedStock.id ? updatedStock : s))
        );
        showAlert("Stock updated successfully", "success");
        closeEditModal();
      } else {
        showAlert("Failed to update stock", "error");
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      showAlert("Error updating stock", "error");
    }
  };

  // Show alert function
  const showAlert = (message, type) => {
    setAlert({ message, type, visible: true });
    setTimeout(() => {
      setAlert({ ...alert, visible: false });
    }, 3000);
  };

  if (loading) return <div>Loading stocks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden p-6">
      {/* Alert Box */}
      {alert.visible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${
            alert.type === "success"
              ? "bg-green-100 text-green-700"
              : alert.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {alert.message}
          <button
            className="ml-4 text-gray-500 hover:text-gray-900"
            onClick={() => setAlert({ ...alert, visible: false })}
          >
            ✖
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Edit Stock</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Buy Price</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Heading */}
      <h2 className="text-xl font-bold text-gray-700 mb-4">User Stocks</h2>

      {/* Back to Home Button */}
      <button
        className="mb-4 bg-gray-800 text-white px-4 py-2 rounded"
        onClick={() => (window.location.href = "/")}
      >
        Back to Home
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ticker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {updatedStocks.map((stock) => (
              <tr key={stock.id}>
                <td className="px-6 py-4 whitespace-nowrap">{stock.stockName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.ticker}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${stock.buyPrice?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => openEditModal(stock)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(stock.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
