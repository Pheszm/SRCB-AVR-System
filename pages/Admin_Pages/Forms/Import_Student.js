import { useState } from 'react';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';  // Import SweetAlert2
import styles from "@/styles/Admin.module.css";

export default function FileImport({ onClose }) {
  const [validRowCount, setValidRowCount] = useState(0);
  const [invalidRowCount, setInvalidRowCount] = useState(0);
  const [fileType, setFileType] = useState("");
  const [parsedData, setParsedData] = useState([]); // Store parsed data

  const isValidCategory = (category) => {
    const validCategories = [
      'Basic Education Department',
      'Senior High Department',
      'Higher Education Department',
    ];
    return validCategories.includes(category);
  };

  const isValidSex = (sex) => {
    return sex === 'Male' || sex === 'Female';
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNo = (phoneNo) => {
    const phoneNoRegex = /^[0-9]{11}$/;
    return phoneNoRegex.test(phoneNo);
  };

  const handleFileUpload = (event) => {
    setValidRowCount(0); // Reset valid row count
    setInvalidRowCount(0); // Reset invalid row count
    setFileType(""); // Reset file type state

    const file = event.target.files[0];
    console.log('File selected:', file); // Debugging: Log the file object

    if (!file) {
      console.error('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      console.log('File read successfully. Raw data:', data); // Debugging: Log raw file data

      let parsedDataTemp = [];

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        try {
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          parsedDataTemp = XLSX.utils.sheet_to_json(firstSheet);
          setFileType('Excel');
        } catch (error) {
          console.error('Error reading Excel file:', error);
          return;
        }
      } else if (file.name.endsWith('.csv')) {
        try {
          parsedDataTemp = XLSX.utils.csv_to_json(data);
          setFileType('CSV');
        } catch (error) {
          console.error('Error reading CSV file:', error);
          return;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please upload a valid Excel or CSV file.',
        });
        return;
      }

      console.log('Parsed Data:', parsedDataTemp);

      let validCount = 0;
      let invalidCount = 0;

      parsedDataTemp.forEach((row, index) => {
        const isValid =
          isValidCategory(row['Category']) &&
          isValidSex(row['Sex']) &&
          isValidEmail(row['Email']) &&
          isValidPhoneNo(row['Phone No.']);

        if (isValid) {
          validCount++;
        } else {
          invalidCount++;
        }

        console.log(`Row ${index + 1}: Valid: ${isValid}`); // Debugging: Log row validation
      });

      setParsedData(parsedDataTemp); // Store parsed data
      setValidRowCount(validCount);
      setInvalidRowCount(invalidCount);

      // Show the SweetAlert with validation results
      Swal.fire({
        icon: 'info',
        title: 'File Validated',
        text: `Valid Rows: ${validCount}\nInvalid Rows: ${invalidCount}`,
      });
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleSave = async () => {
    event.preventDefault(); // Prevents the page from refreshing
    if (validRowCount > 0) {
      try {
        const validRows = parsedData.filter((row) =>
          isValidCategory(row['Category']) &&
          isValidSex(row['Sex']) &&
          isValidEmail(row['Email']) &&
          isValidPhoneNo(row['Phone No.'])
        );
  
        let errorOccurred = false; // To track if any row fails
  
        // Iterate through valid rows and send the data to the backend
        for (const row of validRows) {
          const studentData = {
            S_Level: row['Level'],
            S_StudentID: row['Student ID'],
            S_Fullname: row['Full Name'],
            S_Category: row['Category'],
            S_Sex: row['Sex'],
            S_Email: row['Email'],
            S_PhoneNo: row['Phone No.'],
            // Omit S_Username and S_Password as per your request
          };
  
          try {
            const response = await fetch('/../../api/Admin_Func/StudentFunc', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(studentData),
            });
  
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Error saving row:', errorData.message);
              Swal.fire({
                icon: 'error',
                title: 'Error Saving Data',
                text: errorData.message,
              });
              errorOccurred = true; // Mark that an error occurred but continue with the next row
            }
          } catch (error) {
            console.error('Error during request:', error);
            Swal.fire({
              icon: 'error',
              title: 'Request Error',
              text: 'An error occurred during the request.',
            });
            errorOccurred = true; // Mark that an error occurred but continue with the next row
          }
        }
  
        // Show success message if no error occurred for any row
        if (!errorOccurred) {
          Swal.fire({
            icon: 'success',
            title: 'Data Saved Successfully',
            text: 'Your data has been saved successfully!',
          });
          onClose();
        }
        
      } catch (error) {
        console.error('Error during save process:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error Saving Data',
          text: 'An error occurred while saving the data.',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No Valid Data',
        text: 'No valid data to save. Please upload a valid file.',
      });
    }
  };
  

  return (
    <div className={styles.AddItemForm}>
      <form>
        <span className={styles.SpanHeader}>
          <h2>Upload Excel or CSV File</h2>
          <button onClick={onClose} className={styles.FormCloseButton}>X</button>
        </span>
 
        <h4>NOTE:</h4>
        <img src="./Assets/Img/HelpArea.jpg" alt="Logo" style={{ width: '700px' }} />
        <p>- Always add the Headers in Row 1 from the Guide.</p>
        <p>- Follow the formats/choices.</p>
        <p>- It's case-sensitive, so you must copy the correct format.</p>
        <br />
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />

        {validRowCount > 0 || invalidRowCount > 0 ? (
          <div>
            <h4>Validation Results</h4>
            <p>Valid Rows: {validRowCount}</p>
            <p>Invalid Rows: {invalidRowCount} (Excluded)</p>
            <button onClick={handleSave} className={styles.saveButton}>Save Data</button>
          </div>
        ) : (
          <p></p>
        )}
      </form>
    </div>
  );
}
