import { useEffect, useState } from 'react';
import styles from "@/styles/Tables.module.css";
import Cookies from 'js-cookie';
import ViewReservation from "./Forms/View_Reservation";
import Swal from 'sweetalert2';
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';


export default function Reservations( { reload }) {
  const [SelectedModal, setSelectedModal] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = Cookies.get('user_id');
  const [SelectedReservation, setSelectedReservation] = useState(null);

  function handleViewForm (reservation){
    setSelectedModal("ViewReservation");
    setSelectedReservation(reservation);
  }
  function handleFormClose (){
    setSelectedModal("");
    reload();
  }


  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/Incharge_api/reservations`);
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchReservations();
    }
  }, [user_id]);

  const handleApprove = async (reservation) => {
    const confirm = await Swal.fire({
      title: 'Approve Reservation?',
      text: `Are you sure you want to approve ${reservation.users_transactions_user_idTousers.last_name}'s reservation?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/Incharge_api/reservations`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_id: reservation.transaction_id,
            action: 'approve',
            approved_by_id: user_id,
          }),
        });

        if (res.ok) {
          Swal.fire('Approved!', 'The reservation has been approved.', 'success');
          fetchReservations();
        } else {
          Swal.fire('Error', 'Failed to approve reservation.', 'error');
        }
      } catch (error) {
        console.error('Error approving reservation:', error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  const handleDecline = async (reservation) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: 'Reject Reservation',
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel'
    });

    if (isConfirmed) {
      try {
        const res = await fetch(`/api/Incharge_api/reservations`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_id: reservation.transaction_id,
            action: 'reject',
            approved_by_id: user_id,
            comments_after_use: reason,
          }),
        });

        if (res.ok) {
          Swal.fire('Rejected!', 'The reservation has been declined.', 'success');
          fetchReservations();
        } else {
          Swal.fire('Error', 'Failed to reject reservation.', 'error');
        }
      } catch (error) {
        console.error('Error rejecting reservation:', error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading Reservations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Reservations</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Table to manage pending reservations.</p>
        </div>
        <div className="p-3 rounded-full bg-blue-100 text-blue-500">
          <FiCalendar size={30} />
        </div>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Use</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time of Use</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.transaction_id} className='hover:bg-gray-50'>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.users_transactions_user_idTousers.last_name}, {reservation.users_transactions_user_idTousers.first_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.transaction_category === 'AVR_Venue' ? 'Venue' : reservation.transaction_category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(reservation.date_of_use).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - {new Date(reservation.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.transaction_category === 'AVR_Venue' ? 'AVR Venue' : (
                    <ul>
                      {reservation.equipment.map((equipment) => (
                        <li key={equipment.equipment_id}>{equipment.name}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                  <button
                    onClick={() => handleViewForm(reservation)}
                    className="text-blue-600 hover:text-blue-900 flex gap-1 items-center"
                  >
                    <FaEye /> 
                    View
                  </button>
                  <button
                    onClick={() => handleApprove(reservation)}
                    className="text-green-600 hover:text-green-900 flex gap-1 items-center"
                  > 
                  <FaCheckCircle/>
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(reservation)}
                    className="text-red-600 hover:text-red-900 flex gap-1 items-center"
                  >
                    <FaTimesCircle/>
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            {SelectedModal === "ViewReservation" && (
                <div className={styles.BlurryBackground}>
                    <ViewReservation onClose={handleFormClose} reservation={SelectedReservation}  />
                </div>
            )}
    </div>
  );
}
