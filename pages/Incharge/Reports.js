import React, { useState, useEffect } from 'react';
import Reports from "./Reports/Reports";
import { FaDesktop, FaBoxes } from 'react-icons/fa';

export default function Transactions() {
  const [fromDateTopUsers, setFromDateTopUsers] = useState('');
  const [toDateTopUsers, setToDateTopUsers] = useState('');
  const [fromDateItems, setFromDateItems] = useState('');
  const [toDateItems, setToDateItems] = useState('');
  const [topUsers, setTopUsers] = useState([]);
  const [mostlyUsedItems, setMostlyUsedItems] = useState([]);

  const fetchTopUsers = async () => {
    try {
      const res = await fetch('/api/Incharge_api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'top-users',
          from: fromDateTopUsers || null,
          to: toDateTopUsers || null,
        }),
      });
      const data = await res.json();
      setTopUsers(data.topUsers || []);
    } catch (error) {
      console.error("Error fetching top users:", error);
      setTopUsers([]);
    }
  };

  const fetchMostlyUsedItems = async () => {
    try {
      const res = await fetch('/api/Incharge_api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mostly-used-items',
          from: fromDateItems || null,
          to: toDateItems || null,
        }),
      });
      const data = await res.json();
      setMostlyUsedItems(data.mostlyUsedItems || []);
    } catch (error) {
      console.error("Error fetching mostly used items:", error);
      setMostlyUsedItems([]);
    }
  };

  useEffect(() => {
    fetchTopUsers();
  }, [fromDateTopUsers, toDateTopUsers]);

  useEffect(() => {
    fetchMostlyUsedItems();
  }, [fromDateItems, toDateItems]);

  function reloadreturn() {}

  const printTopUsers = () => {
    const dateRange = fromDateTopUsers || toDateTopUsers 
      ? `${fromDateTopUsers || 'Start'} to ${toDateTopUsers || 'End'}`
      : 'All Time';
    
    const currentDate = new Date().toLocaleString();

    const html = `
      <html>
        <head>
          <title>Top Users Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            
            body {
              font-family: 'Inter', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #374151;
            }
            
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 15px;
            }
            
            .header h1 {
              color: #111827;
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            
            .report-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 13px;
              background-color: #f9fafb;
              padding: 10px 15px;
              border-radius: 6px;
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
              padding: 10px 15px;
              text-align: left;
              border-bottom: 2px solid #e5e7eb;
            }
            
            td {
              padding: 10px 15px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .rank-cell {
              font-weight: 500;
              color: #4b5563;
            }
            
            .count-cell {
              font-weight: 500;
              color: #1d4ed8;
            }
            
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
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
            <h1>SRCB AVR TOP USERS REPORT</h1>
            <div>Most active users by transaction count</div>
          </div>
          
          <div class="report-info">
            <div><strong>Date Range:</strong> ${dateRange}</div>
            <div><strong>Generated On:</strong> ${currentDate}</div>
            <div><strong>Total Users:</strong> ${topUsers.length}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User Name</th>
                <th>Transaction Count</th>
              </tr>
            </thead>
            <tbody>
              ${topUsers.map((user, index) => `
                <tr>
                  <td class="rank-cell">${index + 1}</td>
                  <td>${user.name}</td>
                  <td class="count-cell">${user.count}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            Generated by SRCB AVR Management System
          </div>
        </body>
      </html>
    `;

    printHtml(html);
  };

  const printMostlyUsedItems = () => {
    const dateRange = fromDateItems || toDateItems 
      ? `${fromDateItems || 'Start'} to ${toDateItems || 'End'}`
      : 'All Time';
    
    const currentDate = new Date().toLocaleString();

    const html = `
      <html>
        <head>
          <title>Most Used Equipment Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
            
            body {
              font-family: 'Inter', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #374151;
            }
            
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 15px;
            }
            
            .header h1 {
              color: #111827;
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 5px;
            }
            
            .report-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 13px;
              background-color: #f9fafb;
              padding: 10px 15px;
              border-radius: 6px;
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
              padding: 10px 15px;
              text-align: left;
              border-bottom: 2px solid #e5e7eb;
            }
            
            td {
              padding: 10px 15px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .rank-cell {
              font-weight: 500;
              color: #4b5563;
            }
            
            .count-cell {
              font-weight: 500;
              color: #059669;
            }
            
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
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
            <h1>SRCB AVR EQUIPMENT USAGE REPORT</h1>
            <div>Most frequently used equipment items</div>
          </div>
          
          <div class="report-info">
            <div><strong>Date Range:</strong> ${dateRange}</div>
            <div><strong>Generated On:</strong> ${currentDate}</div>
            <div><strong>Total Items:</strong> ${mostlyUsedItems.length}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Equipment Name</th>
                <th>Usage Count</th>
              </tr>
            </thead>
            <tbody>
              ${mostlyUsedItems.map((item, index) => `
                <tr>
                  <td class="rank-cell">${index + 1}</td>
                  <td>${item.name}</td>
                  <td class="count-cell">${item.count}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            Generated by SRCB AVR Management System
          </div>
        </body>
      </html>
    `;

    printHtml(html);
  };

  const printHtml = (html) => {
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.style.left = '-1000px';
    iframe.style.top = '-1000px';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    // Wait for content to load before printing
    iframe.onload = function() {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        
        // Remove the iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 300);
    };
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Users Card */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Top Users</h3>
              <p className="text-sm text-gray-500 mb-4">Most active users by transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={printTopUsers}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Print
              </button>
              <div className="flex-shrink-0 bg-violet-100 rounded-full p-3 text-violet-500">
                <FaDesktop className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mb-4 justify-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <label className="block text-sm text-gray-700 mb-1">From:</label>
              <input
                type="date"
                value={fromDateTopUsers}
                onChange={(e) => setFromDateTopUsers(e.target.value)}
                className="border px-2 rounded text-sm border-gray-300 text-violet-700"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <label className="block text-sm text-gray-700 mb-1">To:</label>
              <input
                type="date"
                value={toDateTopUsers}
                onChange={(e) => setToDateTopUsers(e.target.value)}
                className="border px-2 rounded text-sm border-gray-300 text-violet-700"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {topUsers.length > 0 ? (
                topUsers.map((user, index) => (
                  <li key={user.id} className="py-3 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-6 text-center font-medium text-gray-500">{index + 1}.</span>
                      <span className="ml-2 text-gray-700">{user.name}</span>
                    </div>
                    <span className="px-2 py-1 bg-violet-100 text-violet-800 text-xs font-medium rounded-full">
                      {user.count} {user.count === 1 ? 'transaction' : 'transactions'}
                    </span>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">No data available</li>
              )}
            </ul>
          </div>
        </div>

        {/* Mostly Used Items Card */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Mostly Used Equipment</h3>
              <p className="text-sm text-gray-500 mb-4">Frequently requested items</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={printMostlyUsedItems}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Print
              </button>
              <div className="flex-shrink-0 bg-green-100 rounded-full p-3 text-green-500">
                <FaBoxes className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mb-4 justify-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <label className="block text-sm text-gray-700 mb-1">From:</label>
              <input
                type="date"
                value={fromDateItems}
                onChange={(e) => setFromDateItems(e.target.value)}
                className="border px-2 rounded text-sm border-gray-300 text-green-700"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <label className="block text-sm text-gray-700 mb-1">To:</label>
              <input
                type="date"
                value={toDateItems}
                onChange={(e) => setToDateItems(e.target.value)}
                className="border px-2 rounded text-sm border-gray-300 text-green-700"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {mostlyUsedItems.length > 0 ? (
                mostlyUsedItems.map((item, index) => (
                  <li key={item.id} className="py-3 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-6 text-center font-medium text-gray-500">{index + 1}.</span>
                      <span className="ml-2 text-gray-700">{item.name}</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {item.count} {item.count === 1 ? 'use' : 'uses'}
                    </span>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">No data available</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <span className="p-3 inline-block"></span>

      <Reports reload={reloadreturn} />
      <span className='p-10 inline-block'></span> 
    </div>
  );
}