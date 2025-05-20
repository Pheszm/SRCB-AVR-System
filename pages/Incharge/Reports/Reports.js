import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FiClock } from 'react-icons/fi';

export default function Transactions({ reload }) {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
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
  }, [selectedMonth, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

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

    setFilteredTransactions(filtered);
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const pageCount = Math.ceil(filteredTransactions.length / rowsPerPage);

  const handlePrint = () => {
    const selectedMonthText = selectedMonth
      ? new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })
      : 'All Dates';

    const currentDate = new Date().toLocaleString();

    const getStatusText = (status) => {
      if (status === "On_Time") return "Returned on Time";
      if (status === "Late") return "Returned Late";
      if (status === "Expired") return "Unsuccessful";
      return status;
    };

    const rowsHtml = filteredTransactions.map(transaction => {
      const statusText = getStatusText(transaction.transaction_status);
      const statusClass = transaction.transaction_status === "On_Time" ? "text-green-600" : 
                         transaction.transaction_status === "Late" ? "text-red-600" : "text-gray-600";
      const name = `${transaction.users_transactions_user_idTousers.last_name}, ${transaction.users_transactions_user_idTousers.first_name}`;
      const dateOfUse = new Date(transaction.date_of_use).toLocaleDateString();
      const timeOfUse = `${new Date(transaction.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(transaction.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
      
      const needs = transaction.transaction_category === 'AVR_Venue'
        ? 'AVR Venue'
        : (transaction.equipment && transaction.equipment.length > 0
          ? `<ul class="list-disc pl-5">${transaction.equipment.map(e => 
              `<li>${e.name}${e.equipment_health_afteruse && e.equipment_health_afteruse !== 'None' 
                ? ` <span style="color: #dc2626; font-size: 0.75rem;">(${e.equipment_health_afteruse})</span>` 
                : ''}</li>`
            ).join('')}</ul>`
          : 'None');

      return `
        <tr class="hover:bg-gray-50">
          <td class="border px-4 py-2 ${statusClass}">${statusText}</td>
          <td class="border px-4 py-2">${name}</td>
          <td class="border px-4 py-2">${dateOfUse}</td>
          <td class="border px-4 py-2">${timeOfUse}</td>
          <td class="border px-4 py-2">${needs}</td>
        </tr>
      `;
    }).join('');

    const html = `
      <html>
        <head>
          <title>SRCB AVR Transactions Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              margin: 0;
              padding: 20px;
              color: #374151;
              background-color: #fff;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            
            .header h1 {
              color: #111827;
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            
            .header .subtitle {
              color: #6b7280;
              font-size: 14px;
              font-weight: 400;
            }
            
            .report-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 13px;
              background-color: #f9fafb;
              padding: 12px 15px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
            }
            
            .info-group {
              display: flex;
              gap: 15px;
            }
            
            .info-item strong {
              color: #4b5563;
              font-weight: 500;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
              font-size: 13px;
            }
            
            th {
              background-color: #f3f4f6;
              color: #111827;
              font-weight: 500;
              text-align: left;
              padding: 12px 15px;
              border: 1px solid #e5e7eb;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            
            td {
              padding: 10px 15px;
              border: 1px solid #e5e7eb;
              vertical-align: top;
            }
            
            .text-green-600 { color: #16a34a; }
            .text-red-600 { color: #dc2626; }
            .text-gray-600 { color: #4b5563; }
            
            .footer {
              margin-top: 30px;
              text-align: right;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            
            .list-disc {
              list-style-type: disc;
              padding-left: 20px;
              margin: 0;
            }
            
            @media print {
              @page {
                size: auto;
                margin: 10mm;
              }
              
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SRCB AVR TRANSACTIONS REPORT</h1>
            <div class="subtitle">Detailed list of all equipment and venue reservations</div>
          </div>
          
          <div class="report-info">
            <div class="info-group">
              <div class="info-item">
                <strong>Date Exported:</strong> ${currentDate}
              </div>
              <div class="info-item">
                <strong>Filtered By:</strong> ${selectedMonthText}
              </div>
            </div>
            <div class="info-item">
              <strong>Total Records:</strong> ${filteredTransactions.length}
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Date of Use</th>
                <th>Time of Use</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          
          <div class="footer">
            Generated by SRCB AVR Management System
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 200);
  };

  return (
    <>
      <style jsx>{`
        @media print {
          .screen-only {
            display: none;
          }
          .print-only {
            display: block;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <div className="screen-only bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Reports</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Table for reports of the transactions</p>
          </div>
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
            <FiClock size={30} />
          </div>
        </div>

        <div className="p-4 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <label className="px-3 py-1 text-sm text-gray-600">
              Selected Month: 
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>

          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
          >
            Print
          </button>
        </div>

        {loading && <div className="p-4 text-center">Loading...</div>}

        <div className="bg-white overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Use</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time of Use</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs</th>
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
                        {transaction.equipment && transaction.equipment.map((equipment) => (
                          <li key={equipment.equipment_id} className='flex gap-3 items-center'>{equipment.name} <p className='text-red-300 text-xs'>  {equipment.equipment_health_afteruse !== 'None' ? equipment.equipment_health_afteruse : ''}</p></li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </div>

      <div className="print-only px-4">
        <h2 className="text-md font-semibold mb-4">SRCB AVR Recent Transactions</h2>
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Status</th>
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Date of Use</th>
              <th className="border px-2 py-1 text-left">Time of Use</th>
              <th className="border px-2 py-1 text-left">Needs</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td className="border px-2 py-1">
                  {transaction.transaction_status === "On_Time" && "Returned on Time"}
                  {transaction.transaction_status === "Late" && "Returned Late"}
                  {transaction.transaction_status === "Expired" && "Unsuccessful"}
                </td>
                <td className="border px-2 py-1">
                  {transaction.users_transactions_user_idTousers.last_name}, {transaction.users_transactions_user_idTousers.first_name}
                </td>
                <td className="border px-2 py-1">
                  {new Date(transaction.date_of_use).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">
                  {new Date(transaction.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(transaction.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </td>
                <td className="border px-2 py-1">
                  {transaction.transaction_category === 'AVR_Venue' ? 'AVR Venue' : (
                    <ul className="list-disc pl-5">
                      {transaction.equipment && transaction.equipment.map((equipment) => (
                        <li key={equipment.equipment_id}>
                          {equipment.name}
                          {equipment.equipment_health_afteruse && equipment.equipment_health_afteruse !== 'None' && (
                            <span className="text-red-300 text-xs"> ({equipment.equipment_health_afteruse})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}