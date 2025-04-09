import styles from "@/styles/Admin.module.css";
import React, { useState, useEffect } from 'react';
import AddStudentForm from "./Forms/Add_Student";
import ImportStudentForm from "./Forms/Import_Student";
import UpdateStudentForm from './Forms/Update_Student'; // Import the update form
import ViewStudentForm from './Forms/View_Student';
import Swal from 'sweetalert2';  // Import SweetAlert2

export default function Incharge_Items() {
    const [SelectedModification, setSelectForm] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showActions, setShowActions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [data, setData] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); // State to store the student to be updated
    const rowsPerPage = 10;

    const fetchData = async () => {
        try {
            const response = await fetch('/api/Admin_Func/StudentFunc');
            if (!response.ok) throw new Error('Failed to fetch data');
            setData(await response.json());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const categories = [...new Set(data.map(item => item.S_Category))];

    const filteredData = data.filter(
        ({ S_StudentID, S_Fullname, S_Category }) =>
            (selectedCategory === "" || S_Category === selectedCategory) &&
            (S_StudentID.toLowerCase().includes(search.toLowerCase()) ||
            S_Fullname.toLowerCase().includes(search.toLowerCase()) ||
            S_Category.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handlePageChange = (page) => {
        setSelectForm(page);
    };

    const handleUpdateStudent = (student) => {
        setSelectedStudent(student);
        setSelectForm("UpdateStudent");
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setSelectForm("ViewStudent");
    };

    const handleCloseForm = () => {
        setSelectForm("");
        fetchData();
    };

    const handleDeleteStudent = async (studentId, Fullnamee) => {
        // SweetAlert confirmation before proceeding with the delete action
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Removing ${Fullnamee}. You won't be able to revert this!`, 
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch('/api/Admin_Func/StudentFunc', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ S_id: studentId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete student');
                }

                // Remove the student from the data list after successful deletion
                setData(prevData => prevData.filter(student => student.S_id !== studentId));

                // Show success alert
                await Swal.fire('Deleted!', 'The student has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting student:', error);
                await Swal.fire('Error!', 'There was an issue deleting the student.', 'error');
            }
        }
    };

    return (
        <div className={styles.ItemBodyArea}>
            
            
            <span className={styles.SpanFlex}>
                <span>
                    <h2>SRCB STUDENTS</h2>
                    <p>Manage account for SRCB students</p>
                </span>

                <button className={styles.SettingsBtn} onClick={() => handlePageChange("ImportStudents")}>
                    Import Student List
                </button>
            </span>




            <br /><br />

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Student"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value); 
                        setCurrentPage(1); 
                    }}
                />
                <div>
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <button className={styles.SettingsBtn} onClick={() => handlePageChange("AddStudent")}>
                    Add Student
                </button>

                <button className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} onClick={() => setShowActions(!showActions)}>
                    Settings
                </button>
            </div>

            <table className={styles.ItemTable}>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Fullname</th>
                        <th>Category</th>
                        <th>Level</th>
                        {showActions ? <th>Actions</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((student) => (
                        <tr key={student.S_StudentID}>
                            <td>{student.S_StudentID}</td>
                            <td>{student.S_Fullname}</td>
                            <td>{student.S_Category}</td>
                            <td>{student.S_Level}</td>
                            {showActions && (
                                <td>
                                    <button
                                    onClick={() => handleViewStudent(student)}
                                    >View
                                    </button>
                                    
                                    <button 
                                        className={styles.EditBtnnn} 
                                        onClick={() => handleUpdateStudent(student)}  // Pass full student object
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className={styles.RemoveBtnnn} 
                                        onClick={() => handleDeleteStudent(student.S_id, student.S_Fullname)}   
                                        >                                 
                                        Remove
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {SelectedModification === "ViewStudent" && selectedStudent && (
                <div className={styles.BlurryBackground}>
                    <ViewStudentForm student={selectedStudent} onClose={handleCloseForm} onUpdate={fetchData} />
                </div>
            )}

            {SelectedModification === "UpdateStudent" && selectedStudent && (
                <div className={styles.BlurryBackground}>
                    <UpdateStudentForm student={selectedStudent} onClose={handleCloseForm} onUpdate={fetchData} />
                </div>
            )}

            {SelectedModification === "AddStudent" && (
                <div className={styles.BlurryBackground}>
                    <AddStudentForm onClose={handleCloseForm}/>
                </div>
            )}

            {SelectedModification === "ImportStudents" && (
                <div className={styles.BlurryBackground}>
                    <ImportStudentForm onClose={handleCloseForm}/>
                </div>
            )}

            <div className={styles.PagenationArea}>
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className={styles.Pagenumberr}>{currentPage}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
