CREATE DATABASE avr_system_srcb;

USE avr_system_srcb;
SET time_zone = '+08:00';


CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    sex ENUM('Male', 'Female'),
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    status ENUM('Active', 'Inactive', 'Deleted') DEFAULT 'Active',
    user_type ENUM('Student', 'Staff', 'Incharge', 'Admin') NOT NULL,
    department VARCHAR(150),
    student_id VARCHAR(20) NULL,
    staff_id VARCHAR(20) NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

CREATE TABLE Equipment (
    equipment_id INT PRIMARY KEY AUTO_INCREMENT,
    qr_code VARCHAR(30), 
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(200) NOT NULL,
    status ENUM('Available', 'Checked Out', 'Maintenance', 'Retired', 'Deleted', 'Lost') DEFAULT 'Available',
    created_by INT NOT NULL,
    health ENUM('New', 'Excellent', 'Good', 'Fair', 'Poor', 'Broken') DEFAULT 'Good',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);




CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    managed_at TIMESTAMP NULL,

    user_id INT,
    requested_by_id INT,
    approved_by_id INT,
    
    reservation_status ENUM('Pending', 'Approved', 'Rejected', 'Expired') DEFAULT 'Pending',
    transaction_status ENUM('Upcoming', 'Check_Out', 'Ready_for_Pickup', 'Ongoing', 'On_Time', 'Late', 'Cancelled', 'Expired') DEFAULT 'Upcoming',
    
    transaction_reason TEXT,
    transaction_category ENUM('Equipment', 'AVR Venue') NOT NULL,

    date_of_use TIMESTAMP NULL,
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    returned_at TIMESTAMP NULL,
    
    comments_after_use TEXT,
    notif_user ENUM('Unread', 'Read') DEFAULT 'Read',
    notif_incharge ENUM('Unread', 'Read') DEFAULT 'Unread',

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (requested_by_id) REFERENCES users(user_id),
    FOREIGN KEY (approved_by_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE needed (
    needed_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT,
    equipment_id INT,    
    equipment_health_afteruse ENUM('None', 'Minor_Damage', 'Major_Damage', 'Lost') DEFAULT 'None',
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
);