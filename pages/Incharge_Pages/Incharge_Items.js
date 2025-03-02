import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';
import AddItemsForm from "./Forms/AddStudent";

export default function Incharge_Items() {

    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
        setSelectForm(page);
    };



    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showActions, setShowActions] = useState(false); 
    const [selectedCategory, setSelectedCategory] = useState("");
    const rowsPerPage = 10;

    const data = Array.from({ length: 500 }, (_, index) => ({
        id: index + 1,
        itemName: `Item ${index + 1}`,
        itemType: `${index + 1}`,
        serialNumber: `${index + 1}`,
        category: `Category ${((index % 5) + 1)}`,  // Example category (Category 1 to Category 5)
    }));

    // Extract unique categories from the data
    const categories = [...new Set(data.map(item => item.category))];

    const filteredData = data.filter(
        ({ itemName, itemType, serialNumber, category }) =>
            (selectedCategory === "" || category === selectedCategory) &&
            (itemName.toLowerCase().includes(search.toLowerCase()) ||
            itemType.toLowerCase().includes(search.toLowerCase()) ||
            serialNumber.toLowerCase().includes(search.toLowerCase()) ||
            category.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className={styles.ItemBodyArea}>
            <h2>AVR ITEMS</h2>
            <p>Manage and track item availability</p>
            <br/><br/>
            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value); 
                        setCurrentPage(1); 
                    }}
                />

                <div>
                <select 
                    value={selectedCategory} 
                    onChange={(e) => {setSelectedCategory(e.target.value),
                        setCurrentPage(1); }
                    }
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


            <table className={styles.ItemTable}>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th className={styles.QtyColumn}>Quantity</th>
                        <th className={styles.QtyColumn}>Availability</th>
                        <th>Category</th>
                        {showActions ? <th>Actions</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map(({ id, itemName, itemType, serialNumber, category }) => (
                        <tr key={id}>
                            <td>{itemName}</td>
                            <td>{itemType}</td>
                            <td>{serialNumber}</td>
                            <td>{category}</td>
                            {showActions && (
                                <td>
                                    <button>View</button>
                                    <button>Update</button>
                                    <button>Delete</button>
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
                <span>{currentPage}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {SelectedModification === "AddItem" && (
            <div className={styles.BlurryBackground}>
                 {SelectedModification === "AddItem" && <AddItemsForm/>}
                <button className={styles.closeBtn} onClick={() => handlePageChange("")}>X</button>
            </div>
            )}
        </div>
    );
}
