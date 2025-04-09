import Swal from 'sweetalert2'; // Import SweetAlert2
import styles from "@/styles/Incharge.module.css";
import React, { useState, useEffect } from 'react';
import AddItemsForm from "./Forms/Items/Add_Items";
import ViewItemsForm from "./Forms/Items/View_Items";
import UpdateItemsForm from "./Forms/Items/Update_Items";

export default function Incharge_Items() {
    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
        setSelectForm(page);
    };

    const [selecteditem, setSelecteditem] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showActions, setShowActions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const rowsPerPage = 10;

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/Incharge_Func/Item_Func/Fetch_item_Func');
            const data = await response.json();
            setItems(data);
            const uniqueCategories = [...new Set(data.map(item => item.I_Category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Function to remove an item (update status to "Removed")
    // Function to remove an item (update status to "Removed")
const removeItem = async (itemId, itemName) => {
    const C_id = sessionStorage.getItem('userId'); // Get C_id (userId) from sessionStorage
    
    if (!C_id) {
        await Swal.fire('Error!', 'User ID is not available. Please log in.', 'error');
        return;
    }

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to mark "${itemName}" as archived. You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, mark it as archive!',
    });

    if (result.isConfirmed) {
        // Optimistically update the UI (set I_Status to 'Removed')
        setItems(prevItems => prevItems.map(item =>
            item.I_id === itemId ? { ...item, I_Status: 'Removed' } : item
        ));

        try {
            const response = await fetch('/api/Incharge_Func/Item_Func/Remove_item_Func', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    I_id: itemId,
                    C_id: C_id,  // Pass C_id along with I_id
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item status');
            }

            await Swal.fire('Marked as archived!', 'The item has been marked as archived.', 'success');
            fetchItems();
        } catch (error) {
            console.error('Error updating item status:', error);
            await Swal.fire('Error!', 'There was an issue updating the item status.', 'error');
            // If error occurs, refetch items to restore the previous status
            fetchItems();
        }
    }
};


    const filteredData = items.filter(
        ({ I_Name, I_Category, I_Quantity, I_Availability }) =>
            (selectedCategory === "" || I_Category === selectedCategory) &&
            (I_Name.toLowerCase().includes(search.toLowerCase()) ||
                I_Quantity.toString().toLowerCase().includes(search.toLowerCase()) ||
                I_Availability.toString().toLowerCase().includes(search.toLowerCase()) ||
                I_Category.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleFormClose = () => {
        handlePageChange("");
        fetchItems();
    };

    const handleViewitem = (item) => {
        setSelecteditem(item);
        handlePageChange("Viewitem");
    };

    const handleEditItem = (item) => {
        setSelecteditem(item);
        handlePageChange("EditItem");  // Trigger the EditItem form
      };

      

    return (
        <div className={styles.ItemBodyArea}>
            <h2>AVR ITEMS</h2>
            <p>Manage and track item availability</p>

            <br /><br />
            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Items"
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

                <button className={styles.SettingsBtn} onClick={() => handlePageChange("AddItem")}>
                    Add Item
                </button>

                <button className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} onClick={() => setShowActions(!showActions)}>
                    Settings
                </button>
            </div>

            {loading ? (
                <p>Loading items...</p>
            ) : (
                <table className={styles.ItemTable}>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th className={styles.QtyColumn}>Quantity</th>
                            <th className={styles.QtyColumn}>Availability</th>
                            <th>Category</th>
                            {showActions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((item) => (
                            <tr key={item.I_id}>
                                <td>{item.I_Name}</td>
                                <td>{item.I_Quantity}</td>
                                <td>{item.I_Availability}</td>
                                <td>{item.I_Category}</td>
                                {showActions && (
                                    <td>
                                        <button onClick={() => handleViewitem(item)}>View</button>
                                        <button className={styles.EditBtnnn} onClick={() => handleEditItem(item)}>Update</button>
                                        <button
                                            className={styles.RemoveBtnnn}
                                            onClick={() => removeItem(item.I_id, item.I_Name)}  // Pass item ID and name
                                        >
                                            Archive
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className={styles.PagenationArea}>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span className={styles.Pagenumberr}>{currentPage}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            


            {SelectedModification === "AddItem" && (
                <div className={styles.BlurryBackground}>
                    <AddItemsForm category={categories} onClose={handleFormClose} />
    
                </div>
            )}

            {SelectedModification === "Viewitem" && (
                <div className={styles.BlurryBackground}>
                    <ViewItemsForm item={selecteditem} onClose={handleFormClose} />
                   
                </div>
            )}

            {SelectedModification === "EditItem" && (
                <div className={styles.BlurryBackground}>
                    <UpdateItemsForm item={selecteditem} category={categories} onClose={handleFormClose} />
       
                </div>
            )}
        </div>
    );
}
