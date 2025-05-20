import { useEffect, useState } from 'react';
import Student_ReservationForm from "./Form/Reservation_Student";
import styles from "@/styles/Tables.module.css";
import Cookies from 'js-cookie';
import ViewReservation from "./Form/View_Reservation";
import {
  FaEye,
  FaCheckCircle,
  FaUndo
} from 'react-icons/fa';
import Swal from 'sweetalert2';


export default function Reservations() {
  const [SelectedModal, setSelectedModal] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const user_id = Cookies.get('user_id');
  const [SelectedReservation, setSelectedReservation] = useState(null);



  function handleViewForm (reservation){
    setSelectedModal("ViewReservation");
    setSelectedReservation(reservation);
  }


  // Function to fetch reservations for the logged-in user
  const fetchReservations = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const res = await fetch(`/api/User_api/reservations?user_id=${user_id}`);
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false); // Set loading to false once fetching is done
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchReservations();
    }
  }, [user_id]);

  const CloseModal = () => {
    setSelectedModal('');
    fetchReservations(); // Refresh after modal closes (optional)
  };

  const handleAddReservation = () => {
    setSelectedModal("AddReservation");
  };


  
  const CancelProcess = async (reservation) => {
    const { value: message } = await Swal.fire({
      title: 'Cancel Reservation',
      input: 'textarea',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'Enter your reason here...',
      inputAttributes: {
        'aria-label': 'Type your reason here'
      },
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Confirm Cancellation',
      cancelButtonText: 'Go Back',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!';
        }
      }
    });

    if (message) {
      try {
        const response = await fetch('/api/User_api/Cancel_reservation', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transaction_id: reservation.transaction_id,
            message: message
          }),
        });

        if (response.ok) {
          Swal.fire(
            'Cancelled!',
            'Your reservation has been cancelled.',
            'success'
          );
          fetchReservations(); // Refresh the list
        } else {
          throw new Error('Failed to cancel reservation');
        }
      } catch (error) {
        Swal.fire(
          'Error!',
          'There was an issue cancelling your reservation.',
          'error'
        );
        console.error('Cancellation error:', error);
      }
    }
  };



  // If loading, show the spinner and loading message
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Reservations</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Table my upcoming reservations
          </p>
        </div>
        <button
          onClick={handleAddReservation}
          className="bg-blue-600 text-white px-4 rounded-md py-1 text-sm"
        >
          Reserve +
        </button>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
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
            {reservations.map((reservation) => (
              <tr key={reservation.transaction_id} className='hover:bg-gray-50'>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.reservation_status}
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
                  {/* Display "AVR Venue" if category is 'AVR Venue' */}
                  {reservation.transaction_category === 'AVR_Venue' ? 'AVR Venue' : (
                    <ul>
                      {reservation.equipment.map((equipment) => (
                        <li key={equipment.equipment_id}>
                          {equipment.name}
                        </li>
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
                    onClick={() => CancelProcess(reservation)}
                    className="text-yellow-600 hover:text-yellow-900 flex gap-1 items-center"
                  >
                    <FaUndo/>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {SelectedModal === 'AddReservation' && (
        <div className={`${styles.BlurryBackground}`}>
          <Student_ReservationForm onClose={CloseModal} />
        </div>
      )}

      {SelectedModal === "ViewReservation" && (
        <div className={styles.BlurryBackground}>
          <ViewReservation onClose={CloseModal} reservation={SelectedReservation}  />
        </div>
      )}
    </div>
  );
}
