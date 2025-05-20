import React, { useState, useEffect } from 'react';
import * as AiIcons_fi from "react-icons/fi";
import * as AiIcons_ri from "react-icons/ri";
import styles from "@/styles/Tables.module.css";
import AddEquipment from "./Form/Add_Equipment";
import UpdateEquipment from "./Form/Update_Equipment";
import ViewEquipment from "./Form/View_Equipment";
import { FaBoxes } from 'react-icons/fa';
import { QR_Login } from "@/components/QR_Scanning";
import Swal from 'sweetalert2';

export default function EquipmentByCategory() {
  const [SelectedModal, setSelectedModal] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipmentList, setFilteredEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [SelectedEquipment, setSelectedEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');  
  const [isQRVisible, setIsQRVisible] = useState(false);

  
  const handleQRSuccess = async (decodedText) => {
    setIsQRVisible(false);
    const item = equipmentList.find(equip => equip.qr_code === decodedText);
    
    if (item) {
      handlePageChange("View", item);
    } else {
      await Swal.fire({
        title: 'Equipment Not Found',
        text: `No equipment found with QR code: ${decodedText}`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  


  function CloseModal(){
    setSelectedModal('');
    fetchEquipments();
  }

  const fetchEquipments = async () => {
    try {
      const res = await fetch('/api/Incharge_api/equipments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch equipment list.');
      setEquipmentList(data);
      setFilteredEquipmentList(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEquipmentList(equipmentList);
    } else {
      const filtered = equipmentList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.health.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEquipmentList(filtered);
    }
  }, [searchTerm, equipmentList]);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const grouped = filteredEquipmentList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handlePageChange = (action, data) => {
    setSelectedModal(action);
    setSelectedEquipment(data);
  };

  const handleDeleteStudent = (student) => {
    console.log("Delete clicked", student);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center pt-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading Equipments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-full p-50 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
      <div className="flex justify-between items-start px-4 py-5 sm:px-6">
        <div className="border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Equipment by Category</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Click a category to view items.</p>
        </div>
        <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-500 ml-4">
          <FaBoxes className="h-6 w-6" />
        </div>
      </div>

        <div className="px-4 pb-4 sm:px-6 flex justify-end items-center">
        <div className="flex flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-64"> {/* Constrained search width */}
            <input
              type="text"
              placeholder="Search equipment..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AiIcons_fi.FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsQRVisible(true)}
              className="inline-flex items-center px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition flex-shrink-0"
              title="Scan QR Code"
            >
              <AiIcons_ri.RiQrScanLine size={18} />
              <span className="sr-only md:not-sr-only md:ml-1">QR</span>
            </button>
            <button
              className="inline-flex items-center px-3 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition whitespace-nowrap flex-shrink-0"
              onClick={() => setSelectedModal('AddEquipment')}
            >
              <span className="hidden md:inline">Add Equipment</span>
              <span className="inline md:hidden">+</span>
              <span className="md:ml-1 hidden md:inline">+</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(grouped).map(([category, items]) => {
              const availableCount = items.filter(i => i.status === 'Available').length;
              return (
                <React.Fragment key={category}>
                  <tr className="cursor-pointer hover:bg-gray-50" onClick={() => toggleCategory(category)}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{items.length}</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">{availableCount}</td>
                  </tr>
                  {expandedCategory === category && (
                    <tr>
                      <td colSpan={3} className="bg-gray-50 px-6 py-4">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider">
                              <th className="px-4 py-2 text-left">Name</th>
                              <th className="px-4 py-2 text-left">Status</th>
                              <th className="px-4 py-2 text-left">Health</th>
                              <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                              <tr key={item.equipment_id} className='hover:bg-gray-50'>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                                <td className={`px-4 py-2 text-sm font-medium ${
                                  item.status === 'Available' ? 'text-green-600' :
                                  item.status === 'Checked_Out' ? 'text-red-600' :
                                  item.status === 'Maintenance' ? 'text-yellow-600' :
                                  item.status === 'Retired' ? 'text-gray-500' : 'text-gray-500'
                                }`}>{item.status}</td>
                                <td className={`px-4 py-2 text-sm font-medium ${
                                  ['New', 'Excellent'].includes(item.health) ? 'text-green-600' :
                                  item.health === 'Good' ? 'text-blue-600' :
                                  item.health === 'Fair' ? 'text-yellow-600' :
                                  ['Poor', 'Broken'].includes(item.health) ? 'text-red-600' : 'text-gray-500'
                                }`}>{item.health}</td>
                                <td className="px-4 py-2 text-sm font-medium gap-2 flex">
                                  <button className="text-blue-600 hover:text-blue-800" onClick={() => handlePageChange("View", item)} title="VIEW">
                                    <AiIcons_fi.FiEye size={18} />
                                  </button>
                                  <button className="text-green-600 hover:text-green-800" onClick={() => handlePageChange("Edit", item)} title="EDIT">
                                    <AiIcons_fi.FiEdit size={18} />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteStudent(item)} title="REMOVE">
                                    <AiIcons_fi.FiTrash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {SelectedModal === 'AddEquipment' && (
        <div className={styles.BlurryBackground}>
          <AddEquipment onClose={() => CloseModal()} />
        </div>
      )}
      {SelectedModal === 'Edit' && (
        <div className={styles.BlurryBackground}>
          <UpdateEquipment onClose={() => CloseModal()} equipment={SelectedEquipment} />
        </div>
      )}
      {SelectedModal === 'View' && (
        <div className={styles.BlurryBackground}>
          <ViewEquipment onClose={() => CloseModal()} equipment={SelectedEquipment} />
        </div>
      )}

      {isQRVisible && (
        <div className={styles.BlurryBackground}>
            <QR_Login
            ScanningStatus={isQRVisible}
            onScanSuccess={handleQRSuccess}
            CloseForm={() => setIsQRVisible(false)}
            />
        </div>
      )}

    </div>
  );
}