import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie'; 
import EquipmentCategory from "./Equipment_Category";
import styles from "@/styles/Tables.module.css";
import Swal from 'sweetalert2';


export default function StudentReservationForm({ onClose }) {
  const [reservationType, setReservationType] = useState("equipment");
  const [showConflictDropdown, setShowConflictDropdown] = useState(false);
  const router = useRouter();

  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);



  const endTime = useRef("");
  const UpdateEndTime = (newDate) => {
    endTime.current = newDate;
    fetchConflictingItems();
  };

  const startTime = useRef("");
  const UpdateStartTime = (newDate) => {
    startTime.current = newDate;
    fetchConflictingItems();
  };

  const date = useRef("");
  const UpdateDate = (newDate) => {
    date.current = newDate;
    fetchConflictingItems();
  };


  const [conflictingItems, setConflictingItems] = useState([]);


  const toggleReservationType = () => {
    setReservationType(reservationType === "equipment" ? "venue" : "equipment");
    setConflictingItems([]);
    setSelectedItems([]);
  };

  const toggleConflictDropdown = () => {
    setShowConflictDropdown(!showConflictDropdown);
  };

  const user_id = Cookies.get('user_id');
  const user_type = Cookies.get('user_type');

  const [user, setUser] = useState(null);

  const fetchConflictingItems = async () => {
      try {
        const selectedStart = new Date(`${date.current}T${startTime.current}`);
        const selectedEnd = new Date(`${date.current}T${endTime.current}`);
        
        const response = await fetch('/api/User_api/checkConflicts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date_of_use: date.current,
            start_time: selectedStart,
            end_time: selectedEnd,
            reservationType,
            selectedItems: reservationType === 'equipment' ? selectedItems.current.map(item => item.equipment_id) : []
          }),
        });
        
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setConflictingItems(data.conflicts || []);
        } else {
          console.error('Error fetching conflicts:', data.error);
          setConflictingItems([]);
        }
      } catch (error) {
        console.error('Failed to fetch conflicts:', error);
        setConflictingItems([]);
      } finally {

      }
    };



  useEffect(() => {
    endTime.current = "";
    startTime.current = "";
    date.current = "";
    selectedItems.current = [];
    async function fetchUserProfile() {
      if (!user_id) return;
  
      try {
        const res = await fetch('/api/users', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id }),
        });
  
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error('Error fetching user profile:', data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    }
  
    fetchUserProfile();
  }, [user_id]);

  const [staffList, setStaffList] = useState([]);
  const [requestedBy, setRequestedBy] = useState("");
  const [requestedBy_id, setRequestedBy_id] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch("/api/users?type=staff");
        const data = await res.json();
        setStaffList(data);
      } catch (error) {
        console.error("Failed to fetch staff list", error);
      }
    }

    fetchStaff();
  }, []);

  const [showEquipmentCategory, setShowEquipmentCategory] = useState(false);

  const handleAddItemClick = () => {
    setShowEquipmentCategory(!showEquipmentCategory);
  };


  const selectedItems = useRef([]);
  const setSelectedItems = (newDate) => {
    selectedItems.current = newDate;
    fetchConflictingItems();
  };

  const handleItemSelect = (equipment) => {
    const itemExists = selectedItems.current.find(i => i.equipment_id === equipment.equipment_id);
    if (itemExists) {
      setSelectedItems(selectedItems.current.map(i => 
        i.equipment_id === equipment.equipment_id ? {...i, equipment_id: i.equipment_id, name: i.name} : i
      ));
    } else {
      setSelectedItems([...selectedItems.current, {equipment_id: equipment.equipment_id, name: equipment.name }]);
    }
    fetchConflictingItems();
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.current.filter(item => item.equipment_id !== id));
    fetchConflictingItems();
  };

  const handleSubmitReservation = async () => {
  if (!date.current || !startTime.current || !endTime.current || !purpose) {
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill all required fields.',
    });
  }

  if (reservationType === 'equipment' && selectedItems.length === 0) {
    return Swal.fire({
      icon: 'warning',
      title: 'No Equipment Selected',
      text: 'Please select at least one equipment item.',
    });
  }

  if (!requestedBy && user_type !== "Staff") {
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Requester',
      text: 'Please select a staff member to request the transaction.',
    });
  }

  const selectedDate = new Date(date.current);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date();
  minDate.setDate(today.getDate() + 3); // 3 days from now

  if (selectedDate < minDate) {
    return Swal.fire({
      icon: 'error',
      title: 'Invalid Date',
      text: 'Reservation date must be at least 3 days from today.',
    });
  }

  const startHour = parseInt(startTime.current.split(":")[0], 10);
  const endHour = parseInt(endTime.current.split(":")[0], 10);
  const startMin = parseInt(startTime.current.split(":")[1], 10);
  const endMin = parseInt(endTime.current.split(":")[1], 10);

  const isStartValid = startHour >= 8 && (startHour < 17 || (startHour === 17 && startMin === 0));
  const isEndValid = endHour <= 17 && (endHour > 8 || (endHour === 8 && endMin === 0));

  if (!isStartValid || !isEndValid) {
    return Swal.fire({
      icon: 'error',
      title: 'Invalid Time',
      text: 'Time must be between 8:00 AM and 5:00 PM.',
    });
  }

  setIsSubmitting(true);

  try {
    const response = await fetch('/api/User_api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        requested_by_id: user_type === "Staff" ? null : requestedBy_id,
        reservationType,
        date_of_use: date.current,
        start_time: startTime.current,
        end_time: endTime.current,
        purpose,
        selectedItems: reservationType === 'equipment' ? selectedItems.current : []
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit reservation');
    }

    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Reservation submitted successfully!',
    });

    onClose();

  } catch (error) {
    console.error('Error submitting reservation:', error);
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: error.message || 'Failed to submit reservation',
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen flex items-center p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 sm:px-6 py-4 sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-0">
                Reservation Form
              </h1>
              <div className="flex items-center justify-center w-full sm:w-auto">
                <span className="text-white text-xs sm:text-sm font-medium mr-2 sm:mr-3">
                  Type:
                </span>
                <button
                  onClick={toggleReservationType}
                  className={`relative inline-flex h-7 sm:h-8 items-center rounded-full w-36 sm:w-48 transition-colors duration-300 ease-in-out ${
                    reservationType === "equipment" ? "bg-blue-100" : "bg-blue-200"
                  }`}
                >
                  <span
                    className={`absolute left-0 w-1/2 h-full flex items-center justify-center text-xs sm:text-sm font-medium z-10 ${
                      reservationType === "equipment"
                        ? "text-blue-800"
                        : "text-gray-600"
                    }`}
                  >
                    Equipment
                  </span>
                  <span
                    className={`absolute right-0 w-1/2 h-full flex items-center justify-center text-xs sm:text-sm font-medium z-10 ${
                      reservationType === "venue"
                        ? "text-blue-800"
                        : "text-gray-600"
                    }`}
                  >
                    Venue
                  </span>
                  <span
                    className={`absolute left-0.5 top-0.5 sm:left-1 sm:top-1 bg-white w-[46%] h-6 sm:h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      reservationType === "venue" ? "translate-x-[75px] sm:translate-x-[98px]" : ""
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Content - Scrollable area */}
          <div className="overflow-y-auto max-h-[calc(100vh-180px)] p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
              {/* Left side - Form fields */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                <div
                  className={`grid grid-cols-1 ${
                    user_type === "Staff" ? "md:grid-cols-1" : "md:grid-cols-2"
                  } gap-4 sm:gap-6`}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="text-blue-700 w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="Your name"
                      value={user ? `${user.first_name} ${user.last_name}` : "loading..."}
                      readOnly
                    />
                  </div>
                  
                  {user_type !== "Staff" &&(
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Requested By
                    </label>
                    <input
                      type="text"
                      value={requestedBy}
                      onFocus={() => setShowDropdown(true)}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setRequestedBy(e.target.value);
                        setShowDropdown(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowDropdown(false);
                          const isValid = staffList.some((staff) =>
                            `${staff.first_name} ${staff.last_name}`.toLowerCase() ===
                            requestedBy.toLowerCase()
                          );

                          if (!isValid) {
                            setRequestedBy("");
                            setSearchTerm("");
                          }
                        }, 150);
                      }}
                      placeholder="Search and select staff..."
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />

                    {showDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {staffList
                          .filter((staff) =>
                            `${staff.first_name} ${staff.last_name}`
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .slice(0, 5)
                          .map((staff) => (
                            <div
                              key={staff.user_id}
                              onMouseDown={() => {
                                setRequestedBy(`${staff.first_name} ${staff.last_name}`);
                                setSearchTerm(`${staff.first_name} ${staff.last_name}`);
                                setRequestedBy_id(staff.user_id);
                                setShowDropdown(false);
                              }}
                              className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                            >
                              {staff.first_name} {staff.last_name}
                            </div>
                          ))}

                        {staffList.filter((staff) =>
                          `${staff.first_name} ${staff.last_name}`
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-2 text-gray-500 text-sm">No results found</div>
                        )}
                      </div>
                    )}
                  </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={date.current}
                      onChange={(e) => UpdateDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      From
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={startTime.current}
                      onChange={(e) => UpdateStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      To
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={endTime.current}
                      onChange={(e) => UpdateEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Purpose
                  </label>
                  <textarea
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                    placeholder="Purpose of use..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Right side - Equipment/Venue selection */}
              <div className="lg:col-span-4 mt-4 sm:mt-0">
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                      {reservationType === "equipment"
                        ? "Equipment List"
                        : "Venue Reservation"}
                    </h2>
                    {reservationType === "equipment" && (
                      <button
                        onClick={handleAddItemClick}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors text-xs sm:text-sm">
                        Add Item
                      </button>
                    )}
                  </div>

                  <div className="flex-grow overflow-hidden">
                    {reservationType === "equipment" ? (
                      <div className="overflow-auto h-full max-h-[200px] sm:max-h-none">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Item
                              </th>
                              <th
                                scope="col"
                                className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedItems.current.map((item, index) => (
                              <tr key={item.equipment_id || index}>
                                <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-700">
                                  {item.name}
                                </td>
                                <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                  <button
                                    onClick={() => handleRemoveItem(item.equipment_id)}
                                    className="text-red-600 hover:text-red-900 font-medium"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center p-4">
                          <div className="text-lg font-semibold text-gray-700 mb-2">
                            AVR Venue
                          </div>
                          <p className="text-sm text-gray-500">
                            This is the only available venue for reservation.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200 relative">
                    {conflictingItems.length > 0 && (
                    <div 
                      className="flex items-center text-yellow-600 text-xs sm:text-sm font-medium cursor-pointer"
                      onClick={toggleConflictDropdown}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Warning: {conflictingItems.length} items have conflicts
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-2 transition-transform duration-200 ${showConflictDropdown ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    )}
                    

                    {/* Conflict dropdown */}
                    {showConflictDropdown && (
  <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
    <div className="max-h-60 overflow-y-auto">
      {conflictingItems.length > 0 ? (
        conflictingItems.map((item) => (
          <div key={`${item.id}-${item.time}`} className="px-4 py-2 hover:bg-gray-50">
            <div className="text-sm font-medium text-gray-900">
              {item.itemName} - Conflict
            </div>
            <div className="text-xs text-gray-500">
              {item.date} • {item.time}
            </div>
          </div>
        ))
      ) : (
        <div className="px-4 py-2 text-gray-500 text-sm">
          No conflicts found
        </div>
      )}
    </div>
  </div>
)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions - Sticky footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2 sm:gap-4">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReservation}
                disabled={isSubmitting}
                className={`px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors w-full sm:w-auto text-sm sm:text-base ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEquipmentCategory && (
        <div className={styles.BlurryBackground}>
            <EquipmentCategory onClose={handleAddItemClick} onSelectItem={handleItemSelect}/>
        </div>
      )}
    </div>
  );
}