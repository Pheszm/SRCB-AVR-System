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

    // Sample data generation
    const data = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        studentId: `C2299${index + 1}`,
        fullname: [
            "Alice Reyes", "Bob Santos", "Charlie Dela Cruz", "Diana Lopez", "Ethan Perez", "Fiona Garcia", 
            "George Mendoza", "Hannah Flores", "Irene Bautista", "Jack Alvarez", "Karen Ramos", "Louis Villanueva", 
            "Maria Cruz", "Nathan Diaz", "Olivia Santos", "Paulina Reyes", "Quincy Castillo", "Rafael Bautista", 
            "Sophia Garcia", "Tommy Perez", "Ursula Valdez", "Victor Ramos", "Wendy Mendoza", "Xander Lopez", 
            "Yvonne Flores", "Zack Alvarez", "Ariana Villanueva", "Brandon Diaz", "Cynthia Cruz", "Daryl Reyes"
        ][index], // Appropriately set names
        category: [
            "Basic Education Department",
            "Higher Education Department",
            "Senior High School Department"
        ][index % 3], // Assign a rotating category to each student
        level: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Freshman", "Sophomore", "Junior", "Senior"][
            Math.floor(index % 10 / 2)
        ], // Assign levels based on the student's index
    }));

    // Extract unique categories from the data
    const categories = [...new Set(data.map(item => item.category))];

    const filteredData = data.filter(
        ({ studentId, fullname, category }) =>
            (selectedCategory === "" || category === selectedCategory) &&
            (studentId.toLowerCase().includes(search.toLowerCase()) ||
            fullname.toLowerCase().includes(search.toLowerCase()) ||
            category.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className={styles.ItemBodyArea}>
            <h2>SRCB STUDENTS</h2>
            <p>Manage account for srcb students</p>

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

                <button className={styles.SettingsBtn} onClick={() => handlePageChange("AddItem")}>
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
                    {currentRows.map(({ id, studentId, fullname, category, level }) => (
                        <tr key={id}>
                            <td>{studentId}</td>
                            <td>{fullname}</td>
                            <td>{category}</td>
                            <td>{level}</td>
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
