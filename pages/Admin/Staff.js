import { useState, useEffect } from 'react';
import * as AiIcons_fi from "react-icons/fi";
import styles from "@/styles/Tables.module.css";
import Adding from "./Forms/Add_Staff";
import Viewing from "./Forms/View_Staff";
import Updating from "./Forms/Update_Staff";
import Swal from 'sweetalert2';

export default function StaffPage() {
    const [selectedStaff, setSelectedStaff] = useState(null);

    // Handle Modal Forms
    const [SelectedModal, setSelectedModal] = useState(""); 
    const handlePageChange = (page, staff = null) => {
        setSelectedModal(page);
        setSelectedStaff(staff);
    };
    const handleCloseForm = () => {
        setSelectedModal("");
        fetchStaffs();
    };

    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchStaffs = async () => {
        try {
            const response = await fetch('/api/Admin_api/staffs');
            if (!response.ok) {
                throw new Error('Failed to fetch staffs');
            }
            const data = await response.json();
            setStaffs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    const handleDeleteStaff = async (staff) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${staff.first_name} ${staff.last_name}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/Admin_api/staffs`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: staff.user_id
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete staff');
                }

                await Swal.fire(
                    'Deleted!',
                    'The staff has been deleted.',
                    'success'
                );
                
                fetchStaffs();
            } catch (error) {
                Swal.fire(
                    'Error!',
                    'There was an error deleting the staff.',
                    'error'
                );
                console.error('Error deleting staff:', error);
            }
        }
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    // Filter states
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedGender, setSelectedGender] = useState("");  // New state for gender filter

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStaffs = staffs
        .filter((staff) => {
            // Search logic - check all columns
            if (searchQuery) {
                const lowerCaseSearchQuery = searchQuery.toLowerCase();
                const searchableFields = [
                    staff.staff_id?.toString() || '',
                    `${staff.last_name}, ${staff.first_name}`,
                    staff.department || '',
                    staff.status || ''
                ].map(field => field.toLowerCase());

                if (!searchableFields.some(field => field.includes(lowerCaseSearchQuery))) {
                    return false;
                }
            }

            // Check status filter
            if (selectedStatus && staff.status !== selectedStatus) return false;

            // Check gender filter
            if (selectedGender && staff.sex !== selectedGender) return false;

            return true;
        })
        // Sort alphabetically by last name, then first name
        .sort((a, b) => {
            const lastNameCompare = a.last_name.localeCompare(b.last_name);
            if (lastNameCompare !== 0) return lastNameCompare;
            return a.first_name.localeCompare(b.first_name);
        });

    // Reset to page 1 whenever the filters or search query change
    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
    const currentStaffs = filteredStaffs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle page changes
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 text-sm">Loading staffs...</p>
            </div>
        );
    }

    if (error) return (
    <div className="flex items-center justify-center h-full">
        <div className="max-w-md p-8 text-center bg-white rounded-lg border border-gray-200">
        <div className="flex justify-center mb-4">
            <AiIcons_fi.FiAlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="mt-4 text-gray-600 text-sm">Error Loading Staffs</h3>
        <p className="mb-4 text-gray-600">{error}</p>
        <button
            className="flex items-center justify-center px-4 py-1 mx-auto space-x-2 text-white bg-blue-800 rounded-md hover:bg-blue-900 transition-colors"
            onClick={() => window.location.reload()}
        >
            <AiIcons_fi.FiRefreshCw className="w-5 h-5" />
            <span>Try Again</span>
        </button>
        </div>
    </div>
    );

    return (
        <div className={styles.MainBodyPage}>
            <span className={styles.SpanFlex}>
                <span>
                    <h2>MANAGE STAFF</h2>
                    <p>Manage Staffs in the AVR Reservation & Inventory System.</p>
                </span>
            </span>
            <br/><br/>

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Staff 🔍"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleFilterChange();
                    }}
                />

                <div className={styles.DivFlex}>
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            handleFilterChange();
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    {/* New Gender Filter Dropdown */}
                    <select
                        value={selectedGender}
                        onChange={(e) => {
                            setSelectedGender(e.target.value);
                            handleFilterChange();
                        }}
                    >
                        <option value="">All Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <button className={styles.CommonButtons} onClick={() => handlePageChange("Add")}>
                        Add Staff +
                    </button>
                </div>
            </div>

            <table className={styles.MainTable}>
                <thead>
                    <tr>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Sex</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStaffs.map((staff) => (
                        <tr key={staff.user_id}>
                            <td>{staff.staff_id}</td>
                            <td>{staff.last_name}, {staff.first_name}</td>
                            <td>
                                {staff.sex === "Male" ? (
                                    <span className="text-blue-400 font-bold">Male</span>
                                ) : (
                                    <span className="text-pink-400 font-bold">Female</span>
                                )}
                            </td>
                            <td>
                                {staff.status === "Active" ? (
                                    <span className="inline-block bg-green-100 text-green-800 border border-green-300 rounded-full px-2 font-medium">
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-block bg-red-100 text-red-800 border border-red-300 rounded-full px-2 font-medium">
                                        Inactive
                                    </span>
                                )}
                            </td>
                            <td>
                                <button className={styles.ViewBtn} 
                                    onClick={() => handlePageChange("View", staff)}
                                    title="VIEW">
                                    <AiIcons_fi.FiEye size={23} />
                                </button>

                                <button className={styles.EditBtn} 
                                    onClick={() => handlePageChange("Edit", staff)}
                                    title="EDIT">
                                    <AiIcons_fi.FiEdit size={23} />
                                </button>

                                <button className={styles.RemoveBtn} 
                                    onClick={() => handleDeleteStaff(staff)}
                                    title="REMOVE">
                                    <AiIcons_fi.FiTrash2 size={23} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.PagenationArea}>
                <button className={styles.CommonButtons} onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span className={styles.Pagenumberr}>{currentPage} / {totalPages}</span>
                <button className={styles.CommonButtons} onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {/* MODAL FORMS AREA */}
            {SelectedModal === "Add" && (
                <div className={styles.BlurryBackground}>
                    <Adding onClose={handleCloseForm}  />
                </div>
            )}

            {SelectedModal === "View" && (
                <div className={styles.BlurryBackground}>
                    <Viewing onClose={handleCloseForm} staff={selectedStaff}  />
                </div>
            )}

            {SelectedModal === "Edit" && (
                <div className={styles.BlurryBackground}>
                    <Updating onClose={handleCloseForm} staff={selectedStaff}  />
                </div>
            )}
        </div>
    );
};
