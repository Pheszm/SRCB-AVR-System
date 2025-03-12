import styles from "@/styles/Admin.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';
import AddItemsForm from "./../Incharge_Pages/Forms/AddStudent";

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

    // Sample data generation for staff (including Fullname, Email, Username, and Password)
    const data = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        fullname: [
            "Alice Reyes", "Bob Santos", "Charlie Dela Cruz", "Diana Lopez", "Ethan Perez", "Fiona Garcia", 
            "George Mendoza", "Hannah Flores", "Irene Bautista", "Jack Alvarez", "Karen Ramos", "Louis Villanueva", 
            "Maria Cruz", "Nathan Diaz", "Olivia Santos", "Paulina Reyes", "Quincy Castillo", "Rafael Bautista", 
            "Sophia Garcia", "Tommy Perez", "Ursula Valdez", "Victor Ramos", "Wendy Mendoza", "Xander Lopez", 
            "Yvonne Flores", "Zack Alvarez", "Ariana Villanueva", "Brandon Diaz", "Cynthia Cruz", "Daryl Reyes"
        ][index], // Appropriately set names
        email: `user${index + 1}@example.com`, // Sample email
        username: `user${index + 1}`, // Sample username
        password: `password${index + 1}`, // Sample password
    }));

    // Extract unique categories from the data
    const categories = [...new Set(data.map(item => item.category))];

    const filteredData = data.filter(
        ({ fullname, email, username, category }) =>
            (selectedCategory === "" || category === selectedCategory) &&
            (email.toLowerCase().includes(search.toLowerCase()) ||
            fullname.toLowerCase().includes(search.toLowerCase()) ||
            username.toLowerCase().includes(search.toLowerCase()) ||
            category.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className={styles.ItemBodyArea}>
            <h2>AVR INCHARGE</h2>
            <p>Manage account for avr incharge</p>

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
                    {currentRows.map(({ id, fullname, email, username, password }) => (
                        <tr key={id}>
                            <td>{fullname}</td>
                            <td>{email}</td>
                            <td>{username}</td>
                            <td>
                                {showActions ? password : "******"} {/* Conditionally render password */}
                            </td>
                            {showActions && (
                                <td>
                                    <button>View</button>
                                    <button className={styles.EditBtnnn}>Update</button>
                                    <button className={styles.RemoveBtnnn}>Delete</button>
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

            {SelectedModification === "AddItem" && (
                <div className={styles.BlurryBackground}>
                    {SelectedModification === "AddItem" && <AddItemsForm/>}
                    <button className={styles.closeBtn} onClick={() => handlePageChange("")}>X</button>
                </div>
            )}
        </div>
    );
}
