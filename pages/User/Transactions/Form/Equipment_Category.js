import React, { useState, useEffect } from 'react';
import * as AiIcons_fi from "react-icons/fi";
import styles from "@/styles/Tables.module.css";

export default function EquipmentCategory({ onClose, onSelectItem }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState({}); // Track open categories

  const fetchEquipment = async () => {
    try {
      const res = await fetch('/api/User_api/equipments');  // Fetch the equipment data
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch equipment list.');
      setEquipmentList(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();  // Fetch equipment on component mount
  }, []);

  // Group equipment by category
  const groupedByCategory = equipmentList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Filter categories based on search query
  const filteredCategories = Object.entries(groupedByCategory).filter(([category, items]) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle the visibility of a category
  const handleToggleCategory = (category) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const handleSelectEquipment = (equipment) => {
    // Handle the equipment reservation logic directly
    console.log("Selected Equipment: ", equipment);
    alert(`You have reserved the equipment: ${equipment.name}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading equipment...</p>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-600 text-lg py-12">{`Error: ${error}`}</div>;
  }

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg max-h-screen overflow-auto">
      <div className="flex justify-between items-center px-6 py-5 sm:px-8">
        <div className="border-b border-gray-200 pb-3">
          <h3 className="text-2xl font-semibold text-gray-900">Equipment Categories</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Click a category to view and select equipment for reservation.</p>
        </div>
        <div className="w-1/3">
          <input
            type="text"
            className="px-4 py-2 border rounded-md w-full text-sm"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto max-h-[calc(100vh-200px)] px-6 py-4">
        {filteredCategories.map(([category, items]) => (
          items.length > 0 && (
            <div key={category} className="mb-6">
              {/* Category Header */}
              <div className="flex justify-between items-center cursor-pointer py-3 text-lg font-medium text-gray-900 cursor-pointer hover:bg-gray-100 p-5" onClick={() => handleToggleCategory(category)}>
                <span>{category}</span>
                <span className={`text-sm ${openCategories[category] ? 'text-green-600' : 'text-gray-500'}`}>
                  {openCategories[category] ? '▲' : '▼'}
                </span>
              </div>

              {/* Category Items */}
              {openCategories[category] && (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment Name</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((equipment) => (
                        <tr
                          key={equipment.equipment_id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => {onSelectItem(equipment); onClose();}}
                        >
                          <td className="px-6 py-4 text-sm font-100 text-gray-900">{equipment.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        ))}
      </div>

      <div className="flex justify-end px-6 py-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
