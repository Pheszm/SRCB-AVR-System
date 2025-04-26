import styles from "@/styles/Admin.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import AddStaffForm from "./Forms/Add_Staff";
import Swal from 'sweetalert2';  // Import SweetAlert2
import UpdateStaffForm from './Forms/Update_Staff';
import ViewStaffForm from './Forms/View_Staff';

export default function Incharge_Items() {
    const [data, setData] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const fetchData = async () => {
        try {
            const response = await fetch('/api/Admin_Func/StaffFunc');
            if (!response.ok) throw new Error('Failed to fetch data');
            setData(await response.json());
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => { fetchData(); }, []);

    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
        setSelectForm(page);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showActions, setShowActions] = useState(false); 
    const rowsPerPage = 10;

    // Extract unique categories from the data
    const categories = [...new Set(data.map(item => item.category))];

    // Filter data based on search input
    const filteredData = data.filter(
        ({ T_Fullname, T_Email, T_Username }) =>
            T_Fullname.toLowerCase().includes(search.toLowerCase()) ||
            T_Email.toLowerCase().includes(search.toLowerCase()) ||
            T_Username.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleFormClose = () => {
        // Refresh the data when the form is closed
        fetchData();
        setSelectForm(""); // Close the form
    };


    const handleUpdateStaff = (staff) => {
        setSelectedStaff(staff);
        setSelectForm("UpdateStaff");
    };

    const handleViewStaff = (staff) => {
        setSelectedStaff(staff);
        setSelectForm("ViewStaff");
    };

    const handleDeleteStaff = async (staffId, Fullnamee) => {
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
            // Optimistically remove the staff from the UI first
            setData(prevData => prevData.filter(staff => staff.T_id !== staffId));
    
            try {
                const response = await fetch('/api/Admin_Func/StaffFunc', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ T_id: staffId }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete staff');
                }
    
                // Show success alert
                await Swal.fire('Deleted!', 'The staff has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting staff:', error);
                await Swal.fire('Error!', 'There was an issue deleting the staff.', 'error');
                // If there's an error, restore the deleted staff to the table
                fetchData(); 
            }
        }
    };
    

    return (
        <div className={styles.ItemBodyArea}>
            <h2>SRCB STAFF</h2>
            <p>Manage account for srcb staffs</p>

            <br /><br />
            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Staff"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value); 
                        setCurrentPage(1); 
                    }}
                />

                <button className={styles.SettingsBtn} onClick={() => handlePageChange("AddItem")}>
                    Add Staff
                </button>

                <button className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} onClick={() => setShowActions(!showActions)}>
                    Settings
                </button>
            </div>

            <table className={styles.ItemTable}>
                <thead>
                    <tr>
                        <th>Fullname</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Password</th>
                        {showActions ? <th>Actions</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((staff) => (  // iterate over currentRows, each item is 'staff'
                        <tr key={staff.T_id}> 
                            <td>{staff.T_Fullname}</td> 
                            <td>{staff.T_Email}</td>
                            <td>{staff.T_Username}</td>
                            <td>
                                {showActions ? staff.T_Password : "******"} 
                            </td>
                            {showActions && (
                                <td>
                                    <button
                                    onClick={() => handleViewStaff(staff)}
                                    >View
                                    </button>

                                    <button 
                                        className={styles.EditBtnnn} 
                                        onClick={() => handleUpdateStaff(staff)}  // Pass full student object
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className={styles.RemoveBtnnn} 
                                        onClick={() => handleDeleteStaff(staff.T_id, staff.T_Fullname)}   
                                        >                                 
                                        Remove
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

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

            {SelectedModification === "ViewStaff" && selectedStaff && (
                <div className={styles.BlurryBackground}>
                    <ViewStaffForm staff={selectedStaff} onClose={handleFormClose} onUpdate={fetchData} />
                </div>
            )}

            {SelectedModification === "AddItem" && (
                <div className={styles.BlurryBackground}>
                    <AddStaffForm onClose={handleFormClose} />
                </div>
            )}
            {SelectedModification === "UpdateStaff" && selectedStaff && (
                <div className={styles.BlurryBackground}>
                    <UpdateStaffForm staff={selectedStaff} onClose={handleFormClose} onUpdate={fetchData} />
                </div>
            )}

        </div>
    );
}
