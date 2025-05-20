import { useState, useEffect } from 'react';
import * as AiIcons_fi from "react-icons/fi";
import styles from "@/styles/Tables.module.css";
import Adding from "./Forms/Add_Student";
import Viewing from "./Forms/View_Student";
import Updating from "./Forms/Update_Student";
import Swal from 'sweetalert2';

export default function StudentPage() {
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Handle Modal Forms
    const [SelectedModal, setSelectedModal] = useState(""); 
    const handlePageChange = (page, student = null) => {
        setSelectedModal(page);
        setSelectedStudent(student);
    };
    const handleCloseForm = () => {
        setSelectedModal("");
        fetchStudents();
    };

    // State for students data
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchStudents = async () => {
        try {
            const response = await fetch('/api/Admin_api/students');
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch students data
    useEffect(() => {
        fetchStudents();
    }, []);

    // Delete student function
    const handleDeleteStudent = async (student) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${student.first_name} ${student.last_name}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/Admin_api/students`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: student.user_id
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete student');
                }

                await Swal.fire(
                    'Deleted!',
                    'The student has been deleted.',
                    'success'
                );
                
                // Refresh the student list
                fetchStudents();
            } catch (error) {
                Swal.fire(
                    'Error!',
                    'There was an error deleting the student.',
                    'error'
                );
                console.error('Error deleting student:', error);
            }
        }
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    // Filter states
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedSex, setSelectedSex] = useState("");  // Added sex filter state

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Filter students based on selected filters and search query
    const filteredStudents = students
        .filter((student) => {
            // Search logic - check all columns
            if (searchQuery) {
                const lowerCaseSearchQuery = searchQuery.toLowerCase();
                const searchableFields = [
                    student.student_id?.toString() || '',
                    `${student.last_name}, ${student.first_name}`,
                    student.department || '',
                    student.status || ''
                ].map(field => field.toLowerCase());
                
                if (!searchableFields.some(field => field.includes(lowerCaseSearchQuery))) {
                    return false;
                }
            }


            if (selectedStatus && student.status !== selectedStatus) return false;


            if (selectedSex && student.sex !== selectedSex) return false;

            return true;
        })
        // Add this sort function to sort alphabetically by last name, then first name
        .sort((a, b) => {
            // Compare last names first
            const lastNameCompare = a.last_name.localeCompare(b.last_name);
            if (lastNameCompare !== 0) return lastNameCompare;
            
            // If last names are equal, compare first names
            return a.first_name.localeCompare(b.first_name);
        });

    // Reset to page 1 whenever the filters or search query change
    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const currentStudents = filteredStudents.slice(
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
                <p className="mt-4 text-gray-600 text-sm">Loading students...</p>
            </div>
        );
    }

    if (error) return (
    <div className="flex items-center justify-center h-full">
        <div className="max-w-md p-8 text-center bg-white rounded-lg border border-gray-200">
        <div className="flex justify-center mb-4">
            <AiIcons_fi.FiAlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="mt-4 text-gray-600 text-sm">Error Loading Students</h3>
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
                    <h2>MANAGE STUDENT</h2>
                    <p>Manage Students in the AVR Reservation & Inventory System.</p>
                </span>
            </span>
            <br/><br/>

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Student 🔍"
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

                    {/* New Sex Filter Dropdown */}
                    <select
                        value={selectedSex}
                        onChange={(e) => {
                            setSelectedSex(e.target.value);
                            handleFilterChange();
                        }}
                    >
                        <option value="">All Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <button className={styles.CommonButtons} onClick={() => handlePageChange("Add")}>
                        Add Student +
                    </button>
                </div>
            </div>

            <table className={styles.MainTable}>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Sex</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents.map((student) => (
                        <tr key={student.user_id}>
                            <td>{student.student_id}</td>
                            <td>{student.last_name}, {student.first_name}</td>
                            <td>
                                {student.sex === "Male" ? (
                                    <span className="text-blue-400 font-bold">Male</span>
                                ) : (
                                    <span className="text-pink-400 font-bold">Female</span>
                                )}
                            </td>
                            <td>{student.department}</td>
                            <td>
                                {student.status === "Active" ? (
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
                                    onClick={() => handlePageChange("View", student)}
                                    title="VIEW">
                                    <AiIcons_fi.FiEye size={23} />
                                </button>

                                <button className={styles.EditBtn} 
                                    onClick={() => handlePageChange("Edit", student)}
                                    title="EDIT">
                                    <AiIcons_fi.FiEdit size={23} />
                                </button>

                                <button className={styles.RemoveBtn} 
                                    onClick={() => handleDeleteStudent(student)}
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
                    <Viewing onClose={handleCloseForm} student={selectedStudent}  />
                </div>
            )}

            {SelectedModal === "Edit" && (
                <div className={styles.BlurryBackground}>
                    <Updating onClose={handleCloseForm} student={selectedStudent}  />
                </div>
            )}
        </div>
    );
};
