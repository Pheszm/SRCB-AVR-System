import { useEffect, useState } from 'react';
import styles from "@/styles/Tables.module.css";
import Cookies from 'js-cookie';
import ViewTransaction from "./Forms/View_Transaction";
import { QR_Login } from "@/components/QR_Scanning";
import EvaluateModal from './Forms/Evaluate_modal';
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
  const [QRAction, setQRAction] = useState(null);

  const [SelectedModal, setSelectedModal] = useState('');
  const [SelectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = Cookies.get('user_id');

  const [isQRVisible, setIsQRVisible] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/Incharge_api/transactions`);
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
      method: 'PUT', // Changed from POST to PUT
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


  const CheckOutProcess = async (transaction) => {
    setSelectedTransaction(transaction);
    setQRAction('checkout'); 
    setIsQRVisible(true);
  };


  const ReturnProcess = (transaction) => {
    setSelectedTransaction(transaction); 
    setIsQRVisible(true); 
    setQRAction('return'); 
  };

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



  const handleQRSuccess = async (decodedText) => {
  setIsQRVisible(false);

  const parts = decodedText.split('-');
  const qrId = parts.length === 2 ? parts[1] : decodedText;

  const isValid = (
    SelectedTransaction.users_transactions_user_idTousers.staff_id === qrId ||
    SelectedTransaction.users_transactions_user_idTousers.student_id === qrId
  );

  if (!isValid) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid QR',
      text: 'This QR code does not match the user for this transaction.',
    });
    return;
  }

  if (QRAction === 'checkout') {
    const confirm = await Swal.fire({
      title: 'Confirm Checkout',
      text: 'Are you sure you want to check out this transaction?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch('/api/Incharge_api/transactions', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_id: SelectedTransaction.transaction_id,
            action: 'checkout',
          }),
        });

        const result = await response.json();

        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Checkout completed successfully.',
          });
          fetchTransactions();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Checkout Failed',
            text: result.message,
          });
        }
      } catch (error) {
        console.error("Checkout error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during checkout.',
        });
      }
    }
  }

  if (QRAction === 'return') {
    // Valid scan → show evaluation modal
    setEvaluationTransaction(SelectedTransaction);
    setShowEvaluationModal(true);
  }

  // Reset state
  setQRAction(null);
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
                Name
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
                    {transaction.users_transactions_user_idTousers.last_name}, {transaction.users_transactions_user_idTousers.first_name}
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
                    className="text-gray-500 hover:text-gray-600 flex gap-1 items-center"
                  >
                    <FaEye/>
                    View
                  </button>
                  
                  {transaction.transaction_status === "Upcoming" && ( /* IF DEPLOYED Status = Ongoing */
                    <button
                      onClick={() => CheckOutProcess(transaction)}
                      className="text-green-600 hover:text-green-900 flex gap-1 items-center"
                    >
                      <FaCartArrowDown/>
                      Check Out
                    </button>
                  )}

                  {transaction.transaction_status === "Check_Out" && (
                    <button
                      onClick={() => ReturnProcess(transaction)}
                      className="text-blue-600 hover:text-blue-900 flex gap-1 items-center"
                    >
                      <FaUndo/>
                      Return
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


      {isQRVisible && (
        <div className={styles.BlurryBackground}>
            <QR_Login
            ScanningStatus={isQRVisible}
            onScanSuccess={handleQRSuccess}
            CloseForm={() => setIsQRVisible(false)}
            />
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
