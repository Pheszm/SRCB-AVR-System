import { useState, useEffect } from 'react';
import * as AiIcons_fi from "react-icons/fi";
import styles from "@/styles/Tables.module.css";
import Adding from "./Forms/Add_Incharge";
import Viewing from "./Forms/View_Incharge";
import Updating from "./Forms/Update_Incharge";
import Swal from 'sweetalert2';

export default function InchargePage() {
    const [selectedIncharge, setSelectedIncharge] = useState(null);

    // Handle Modal Forms
    const [SelectedModal, setSelectedModal] = useState(""); 
    const handlePageChange = (page, incharge = null) => {
        setSelectedModal(page);
        setSelectedIncharge(incharge);
    };
    const handleCloseForm = () => {
        setSelectedModal("");
        fetchIncharges();
    };

    const [incharges, setIncharges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchIncharges = async () => {
        try {
            const response = await fetch('/api/Admin_api/incharges');
            if (!response.ok) {
                throw new Error('Failed to fetch incharges');
            }
            const data = await response.json();
            setIncharges(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncharges();
    }, []);

    const handleDeleteIncharge = async (incharge) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${incharge.first_name} ${incharge.last_name}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/Admin_api/incharges`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: incharge.user_id
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete incharge');
                }

                await Swal.fire(
                    'Deleted!',
                    'The incharge has been deleted.',
                    'success'
                );
                
                fetchIncharges();
            } catch (error) {
                Swal.fire(
                    'Error!',
                    'There was an error deleting the incharge.',
                    'error'
                );
                console.error('Error deleting incharge:', error);
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

    const filteredIncharges = incharges
        .filter((incharge) => {
            // Search logic - check all columns
            if (searchQuery) {
                const lowerCaseSearchQuery = searchQuery.toLowerCase();
                const searchableFields = [
                    incharge.incharge_id?.toString() || '',
                    `${incharge.last_name}, ${incharge.first_name}`,
                    incharge.department || '',
                    incharge.status || ''
                ].map(field => field.toLowerCase());

                if (!searchableFields.some(field => field.includes(lowerCaseSearchQuery))) {
                    return false;
                }
            }

            // Check status filter
            if (selectedStatus && incharge.status !== selectedStatus) return false;

            // Check gender filter
            if (selectedGender && incharge.sex !== selectedGender) return false;

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
    const totalPages = Math.ceil(filteredIncharges.length / itemsPerPage);
    const currentIncharges = filteredIncharges.slice(
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
                <p className="mt-4 text-gray-600 text-sm">Loading incharges...</p>
            </div>
        );
    }

    if (error) return (
    <div className="flex items-center justify-center h-full">
        <div className="max-w-md p-8 text-center bg-white rounded-lg border border-gray-200">
        <div className="flex justify-center mb-4">
            <AiIcons_fi.FiAlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="mt-4 text-gray-600 text-sm">Error Loading Incharges</h3>
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
                    <h2>MANAGE INCHARGE</h2>
                    <p>Manage Incharges in the AVR Reservation & Inventory System.</p>
                </span>
            </span>
            <br/><br/>

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Incharge 🔍"
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
                        Add Incharge +
                    </button>
                </div>
            </div>

            <table className={styles.MainTable}>
                <thead>
                    <tr>
                        <th>Incharge ID</th>
                        <th>Name</th>
                        <th>Sex</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentIncharges.map((incharge) => (
                        <tr key={incharge.user_id}>
                            <td>{incharge.staff_id}</td>
                            <td>{incharge.last_name}, {incharge.first_name}</td>
                            <td>
                                {incharge.sex === "Male" ? (
                                    <span className="text-blue-400 font-bold">Male</span>
                                ) : (
                                    <span className="text-pink-400 font-bold">Female</span>
                                )}
                            </td>
                            <td>
                                {incharge.status === "Active" ? (
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
                                    onClick={() => handlePageChange("View", incharge)}
                                    title="VIEW">
                                    <AiIcons_fi.FiEye size={23} />
                                </button>

                                <button className={styles.EditBtn} 
                                    onClick={() => handlePageChange("Edit", incharge)}
                                    title="EDIT">
                                    <AiIcons_fi.FiEdit size={23} />
                                </button>

                                <button className={styles.RemoveBtn} 
                                    onClick={() => handleDeleteIncharge(incharge)}
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
                    <Viewing onClose={handleCloseForm} incharge={selectedIncharge}  />
                </div>
            )}

            {SelectedModal === "Edit" && (
                <div className={styles.BlurryBackground}>
                    <Updating onClose={handleCloseForm} incharge={selectedIncharge}  />
                </div>
            )}
        </div>
    );
};
