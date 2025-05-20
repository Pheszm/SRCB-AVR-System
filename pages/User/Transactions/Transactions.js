import { useEffect, useState } from 'react';
import styles from "@/styles/Tables.module.css";
import Cookies from 'js-cookie';
import ViewTransaction from "./Form/View_Transaction";
import EvaluateModal from './Form/Evaluate_modal';
import Swal from 'sweetalert2';
import { FaExchangeAlt } from 'react-icons/fa';

import {
  FaEye,
  FaCartArrowDown,
  FaUndo 
} from 'react-icons/fa';

export default function Transactions( { reload } ) {
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationTransaction, setEvaluationTransaction] = useState(null);


  const [SelectedModal, setSelectedModal] = useState('');
  const [SelectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = Cookies.get('user_id');




  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/User_api/transactions?user_id=${user_id}`);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };




  const UpdateTransactionStatus = async () => {
  try {
    const response = await fetch('/api/Incharge_api/UpdateTransactions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update transactions");
    }

    return await response.json();
  } catch (error) {
    console.error("Update error:", error.message);
    throw error;
  }
};


const CancelProcess = async (transaction) => {
  const confirm = await Swal.fire({
    title: 'Cancel Transaction?',
    text: 'This cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Cancel It',
    confirmButtonColor: '#d33',
  });

  if (!confirm.isConfirmed) return;

  const response = await fetch('/api/User_api/transactions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: Number(transaction.transaction_id) })
  });

  if (response.ok) {
    await Swal.fire('Cancelled!', '', 'success');
    fetchTransactions();
  } else {
    const error = await response.json();
    await Swal.fire('Error!', error.message || 'Cancellation failed', 'error');
  }
};


  useEffect(() => {
    if (user_id) {
      UpdateTransactionStatus();
      fetchTransactions();
    }
  }, [user_id]);

  const CloseModal = () => {
    setSelectedModal('');
    fetchTransactions(); 
    reload();
  };

  const [SelectedReservation, setSelectedReservation] = useState(null);
  const handleAddTransaction = (transaction) => {
    setSelectedModal("ViewTransaction");
    setSelectedReservation(transaction);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading Transactions...</p>
      </div>
    );
  }



const handleEvaluationSubmit = async (evaluations) => {
  try {
    const response = await fetch('/api/Incharge_api/transactions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: evaluationTransaction.transaction_id,
        action: 'return',
        evaluations: evaluations.map(e => ({
          needed_id: e.needed_id,
          equipment_id: e.equipment_id,
          condition: e.condition,
        })),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Return Completed',
        text: 'Return and evaluation submitted successfully.',
      });
      setShowEvaluationModal(false);
      fetchTransactions();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: result.message,
      });
    }
  } catch (error) {
    console.error("Evaluation return error:", error);
    Swal.fire({
      icon: 'error',
      title: 'Server Error',
      text: 'An error occurred while submitting the return.',
    });
  }
};



  return (
    <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Transactions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Table to manage transactions
          </p>
        </div>
          <div className="p-3 rounded-full bg-green-100 text-green-500">
            <FaExchangeAlt size={30} />
          </div>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date of Use
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time of Use
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Needs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...transactions]
              .sort((a, b) => {
                const order = {
                  'Check_Out': 1,
                  'Ongoing': 2,
                  'Upcoming': 3,
                };
                return (order[a.transaction_status] || 99) - (order[b.transaction_status] || 99);
              })
              .map((transaction) => (
              <tr key={transaction.transaction_id} className='hover:bg-gray-50'>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.transaction_status === "Upcoming" && (
                    <p className="text-sm text-yellow-600">Upcoming</p>
                  )}
                  {transaction.transaction_status === "Check_Out" && (
                    <p className="text-sm text-blue-600">Checked Out</p>
                  )}
                  {transaction.transaction_status === "Ongoing" && (
                    <p className="text-sm text-green-600">Ongoing</p>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date_of_use).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(transaction.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.transaction_category === 'AVR_Venue' ? 'AVR Venue' : (
                    <ul>
                      {transaction.equipment.map((equipment) => (
                        <li key={equipment.equipment_id}>
                          {equipment.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                  <button
                    onClick={() => handleAddTransaction(transaction)}
                    className="text-blue-500 hover:text-blue-600 flex gap-1 items-center"
                  >
                    <FaEye/>
                    View
                  </button>


                  {transaction.transaction_status !== "Check_Out" && (
                    <button
                      onClick={() => CancelProcess(transaction)}
                      className="text-yellow-600 hover:text-yellow-900 flex gap-1 items-center"
                    >
                      <FaUndo/>
                      Cancel
                    </button>
                  )}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {SelectedModal === 'ViewTransaction' && (
        <div className={`${styles.BlurryBackground}`}>
          <ViewTransaction onClose={CloseModal} transaction={SelectedReservation} />
        </div>
      )}


      {showEvaluationModal && evaluationTransaction && (
        <div className={styles.BlurryBackground}>
          <EvaluateModal
            transaction={evaluationTransaction}
            onClose={() => setShowEvaluationModal(false)}
            onSubmit={handleEvaluationSubmit}
          />
        </div>
      )}

    </div>
  );
}
