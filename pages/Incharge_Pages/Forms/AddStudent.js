import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';



export default function Adding_Item_Form() {
    const [itemName, setItemName] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Item Name:', itemName);
        console.log('Selected Option:', selectedOption);
    };

    return (
        <div className={styles.AddItemForm}>
            <form onSubmit={handleSubmit}>
                <div className={styles.ImageArea}>
                    <button>Upload</button>
                </div>
                <input type="text" placeholder="Item Name" />
                <div className={styles.selectWrapper}>
                    <input 
                        list="options" 
                        id="inputable-select" 
                        className={styles.searchableSelect} 
                        placeholder="Category" 
                        value={selectedOption} 
                        onChange={(e) => setSelectedOption(e.target.value)} 
                    />
                    <datalist id="options">
                        <option value="Cleaning Materials" />
                        <option value="Instruments" />
                        <option value="Output Devices" />
                        <option value="Input Devices" />
                    </datalist>
                </div>
                <input type="number" placeholder="Quantity" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
