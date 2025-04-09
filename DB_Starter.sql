
CREATE DATABASE srcb_avr_system;


CREATE TABLE admin (
    A_id INT AUTO_INCREMENT PRIMARY KEY,
    A_QRcode VARCHAR(255),
    A_Status VARCHAR(50) DEFAULT 'Active',
    A_Username VARCHAR(255),
    A_Password VARCHAR(255)
);
INSERT INTO admin (A_QRcode, A_Username, A_Password)
VALUES ('ID-C220030', 'admin', 'admin');




CREATE TABLE staff (
    T_id INT AUTO_INCREMENT PRIMARY KEY,
    T_QRcode VARCHAR(255),
    T_Status VARCHAR(50) DEFAULT 'Active',
    T_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    T_Username VARCHAR(255),
    T_Password VARCHAR(255),
    T_Email VARCHAR(255),
    T_PhoneNo VARCHAR(20),
    T_Sex VARCHAR(20),
    T_Fullname VARCHAR(255)
);


CREATE TABLE student (
    S_id INT AUTO_INCREMENT PRIMARY KEY,
    S_QRcode VARCHAR(255),
    S_Status VARCHAR(50) DEFAULT 'Active',
    S_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    S_Level VARCHAR(50),
    S_StudentID VARCHAR(50),
    S_Fullname VARCHAR(255),
    S_Category VARCHAR(100),
    S_Sex VARCHAR(20),
    S_Email VARCHAR(255),
    S_PhoneNo VARCHAR(20),
    S_Username VARCHAR(255),
    S_Password VARCHAR(255)
);

CREATE TABLE incharge (
    C_id INT AUTO_INCREMENT PRIMARY KEY,
    C_QRcode VARCHAR(255),
    C_Status VARCHAR(50) DEFAULT 'Active',
    C_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    C_Fullname VARCHAR(255),
    C_Username VARCHAR(255),
    C_Password VARCHAR(255),
    C_Email VARCHAR(255),
    C_PhoneNo VARCHAR(20),
    C_Sex VARCHAR(20),
    C_Image TEXT
);


CREATE TABLE Item (
    I_id INT AUTO_INCREMENT PRIMARY KEY,
    C_id INT,
    I_QRcode VARCHAR(255),
    I_Status VARCHAR(50) DEFAULT 'Active',
    I_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    I_Name VARCHAR(255),
    I_Category VARCHAR(255),
    I_Quantity INT,
    I_Availability INT,
    C_Image TEXT
);


CREATE TABLE activity_logs (
    logs_id INT AUTO_INCREMENT PRIMARY KEY,
    C_id INT,
    DateTimeModified DATETIME DEFAULT CURRENT_TIMESTAMP,
    Action VARCHAR(255),
    Record_Id INT
);





CREATE TABLE Transaction (
    transac_id INT AUTO_INCREMENT PRIMARY KEY,
    DateTimeFiled DATETIME DEFAULT CURRENT_TIMESTAMP,

    Usertype VARCHAR(50),
    User_id INT,

    requestedby_id INT,

    approvedby_id INT,
    reservation_status VARCHAR(50) DEFAULT 'Pending',
    
    transac_status VARCHAR(50) DEFAULT 'Active',

    transac_reason TEXT,
    Transac_Category VARCHAR(255),

    dateofuse DATETIME,
    fromtime TIME,
    totime TIME,
    returnedtime DATETIME,

    comments_afteruse TEXT,
    notif_status VARCHAR(50) DEFAULT 'Unread'
);

CREATE TABLE Items_needed (
    needed_id INT AUTO_INCREMENT PRIMARY KEY,
    transac_id INT,
    I_id INT,
    Quantity INT
);

