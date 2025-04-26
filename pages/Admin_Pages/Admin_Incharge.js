import styles from "@/styles/Admin.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import AddInchargeForm from "./Forms/Add_Incharge"; // Update form name to Add_Incharge
import Swal from 'sweetalert2';  // Import SweetAlert2
import UpdateInchargeForm from './Forms/Update_Incharge'; // Update form name to Update_Incharge
import ViewInchargeForm from './Forms/View_Incharge'; // Update form name to View_Incharge

export default function Incharge_Items() {
    const [data, setData] = useState([]);
    const [selectedIncharge, setSelectedIncharge] = useState(null);
    
    const fetchData = async () => {
        try {
            const response = await fetch('/api/Admin_Func/InchargeFunc'); // Update API endpoint for Incharge
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

    // Filter data based on search input
    const filteredData = data.filter(
        ({ C_Fullname, C_Email, C_Username }) =>
            C_Fullname.toLowerCase().includes(search.toLowerCase()) ||
            C_Email.toLowerCase().includes(search.toLowerCase()) ||
            C_Username.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleFormClose = () => {
        // Refresh the data when the form is closed
        fetchData();
        setSelectForm(""); // Close the form
    };

    const handleUpdateIncharge = (incharge) => {
        setSelectedIncharge(incharge);
        setSelectForm("UpdateIncharge");
    };

    const handleViewIncharge = (incharge) => {
        setSelectedIncharge(incharge);
        setSelectForm("ViewIncharge");
    };

    const handleDeleteIncharge = async (inchargeId, fullname) => {
        // SweetAlert confirmation before proceeding with the delete action
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Removing ${fullname}. You won't be able to revert this!`, 
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });
    
        if (result.isConfirmed) {
            // Optimistically remove the incharge from the UI first
            setData(prevData => prevData.filter(incharge => incharge.C_id !== inchargeId));
    
            try {
                const response = await fetch('/api/Admin_Func/InchargeFunc', { // Update API endpoint for Incharge
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ C_id: inchargeId }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete incharge');
                }
    
                // Show success alert
                await Swal.fire('Deleted!', 'The incharge has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting incharge:', error);
                await Swal.fire('Error!', 'There was an issue deleting the incharge.', 'error');
                // If there's an error, restore the deleted incharge to the table
                fetchData(); 
            }
        }
    };

    return (
        <div className={styles.ItemBodyArea}>
            <h2>SRCB INCHARGES</h2>
            <p>Manage account for srcb incharges</p>

            <br /><br />
            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Incharge"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value); 
                        setCurrentPage(1); 
                    }}
                />

                <button className={styles.SettingsBtn} onClick={() => handlePageChange("AddItem")}>
                    Add Incharge
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
                    {currentRows.map((incharge) => (  // iterate over currentRows, each item is 'incharge'
                        <tr key={incharge.C_id}>  
                            <td>{incharge.C_Fullname}</td> 
                            <td>{incharge.C_Email}</td>
                            <td>{incharge.C_Username}</td>
                            <td>
                                {showActions ? incharge.C_Password : "******"} 
                            </td>
                            {showActions && (
                                <td>
                                    <button
                                    onClick={() => handleViewIncharge(incharge)}
                                    >View
                                    </button>

                                    <button 
                                        className={styles.EditBtnnn} 
                                        onClick={() => handleUpdateIncharge(incharge)}  // Pass full incharge object
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className={styles.RemoveBtnnn} 
                                        onClick={() => handleDeleteIncharge(incharge.C_id, incharge.C_Fullname)}   
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

            {SelectedModification === "ViewIncharge" && selectedIncharge && (
                <div className={styles.BlurryBackground}>
                    <ViewInchargeForm incharge={selectedIncharge} onClose={handleFormClose} onUpdate={fetchData} />

                </div>
            )}

            {SelectedModification === "AddItem" && (
                <div className={styles.BlurryBackground}>
                    <AddInchargeForm onClose={handleFormClose} />
    
                </div>
            )}
            {SelectedModification === "UpdateIncharge" && selectedIncharge && (
                <div className={styles.BlurryBackground}>
                    <UpdateInchargeForm incharge={selectedIncharge} onClose={handleFormClose} onUpdate={fetchData} />

                </div>
            )}

        </div>
    );
}
