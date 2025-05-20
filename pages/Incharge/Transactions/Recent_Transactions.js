import { useEffect, useState } from 'react';
import styles from "@/styles/Tables.module.css";
import Cookies from 'js-cookie';
import ViewTransaction from "./Forms/View_Transaction";
import { FaEye } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

export default function Transactions({ reload }) {
  const [SelectedModal, setSelectedModal] = useState('');
  const [SelectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7;
  const user_id = Cookies.get('user_id');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/Incharge_api/recent_transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchTransactions();
    }
  }, [user_id]);

  useEffect(() => {
    filterTransactions();
    setCurrentPage(1);
  }, [searchTerm, selectedMonth, selectedStatus, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        `${transaction.users_transactions_user_idTousers.first_name} ${transaction.users_transactions_user_idTousers.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date_of_use);
        const [year, month] = selectedMonth.split("-").map(Number);
        return (
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() + 1 === month
        );
      });
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (transaction) => transaction.transaction_status === selectedStatus
      );
    }

    setFilteredTransactions(filtered);
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const pageCount = Math.ceil(filteredTransactions.length / rowsPerPage);

  const CloseModal = () => {
    setSelectedModal('');
    fetchTransactions();
    reload();
  };

  const handleAddTransaction = (transaction) => {
    setSelectedModal("ViewTransaction");
    setSelectedTransaction(transaction);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading Recent Transaction...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Table to manage transactions</p>
        </div>
        <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
          <FiClock size={30} />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="On_Time">Returned on Time</option>
          <option value="Late">Returned Late</option>
          <option value="Expired">Unsuccessful</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Use</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time of Use</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.transaction_id} className='hover:bg-gray-50'>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.transaction_status === "On_Time" && <span className="text-green-600">Returned on Time</span>}
                  {transaction.transaction_status === "Late" && <span className="text-red-600">Returned Late</span>}
                  {transaction.transaction_status === "Expired" && <span className="text-gray-600">Unsuccessful</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.users_transactions_user_idTousers.last_name}, {transaction.users_transactions_user_idTousers.first_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(transaction.date_of_use).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(transaction.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(transaction.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {transaction.transaction_category === 'AVR_Venue' ? 'AVR Venue' : (
                    <ul>
                      {transaction.equipment.map((equipment) => (
                        <li key={equipment.equipment_id} className='flex gap-3 items-center'>{equipment.name} <p className='text-red-300 text-xs'>  {equipment.equipment_health_afteruse !== 'None' ? equipment.equipment_health_afteruse : ''}</p></li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleAddTransaction(transaction)}
                    className="text-blue-500 hover:text-blue-600 flex gap-1 items-center"
                  >
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {SelectedModal === 'ViewTransaction' && SelectedTransaction && (
        <div className={`${styles.BlurryBackground}`}>
          <ViewTransaction onClose={CloseModal} transaction={SelectedTransaction} />
        </div>
      )}
    </div>
  );
}
