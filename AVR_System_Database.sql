CREATE DATABASE srcb_avr_system;

CREATE TABLE activity_logs (
  logs_id INT AUTO_INCREMENT PRIMARY KEY,
  C_id INT NULL,
  DateTimeModified DATETIME DEFAULT CURRENT_TIMESTAMP,
  Action VARCHAR(255) NULL,
  Record_Id INT NULL,
  incharge_id INT NULL,
  FOREIGN KEY (C_id) REFERENCES incharge(C_id),
  FOREIGN KEY (incharge_id) REFERENCES incharge(C_id)
);

CREATE TABLE admin (
  A_id INT AUTO_INCREMENT PRIMARY KEY,
  A_QRcode VARCHAR(255) NULL,
  A_Status VARCHAR(50) DEFAULT 'Active',
  A_Username VARCHAR(255) NULL,
  A_Password VARCHAR(255) NULL
);

CREATE TABLE incharge (
  C_id INT AUTO_INCREMENT PRIMARY KEY,
  C_QRcode VARCHAR(255) NULL,
  C_Status VARCHAR(50) DEFAULT 'Active',
  C_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
  C_Fullname VARCHAR(255) NULL,
  C_Username VARCHAR(255) NULL,
  C_Password VARCHAR(255) NULL,
  C_Email VARCHAR(255) NULL,
  C_PhoneNo VARCHAR(20) NULL,
  C_Sex VARCHAR(20) NULL,
  C_Image TEXT NULL
);

CREATE TABLE item (
  I_id INT AUTO_INCREMENT PRIMARY KEY,
  C_id INT NULL,
  I_QRcode VARCHAR(255) NULL,
  I_Status VARCHAR(50) DEFAULT 'Active',
  I_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
  I_Name VARCHAR(255) NULL,
  I_Category VARCHAR(255) NULL,
  I_Quantity INT NULL,
  I_Availability INT NULL,
  C_Image TEXT NULL,
  FOREIGN KEY (C_id) REFERENCES incharge(C_id)
);

CREATE TABLE items_needed (
  needed_id INT AUTO_INCREMENT PRIMARY KEY,
  transac_id INT NULL,
  I_id INT NULL,
  Quantity INT NULL,
  FOREIGN KEY (transac_id) REFERENCES transaction(transac_id),
  FOREIGN KEY (I_id) REFERENCES item(I_id)
);

CREATE TABLE staff (
  T_id INT AUTO_INCREMENT PRIMARY KEY,
  T_QRcode VARCHAR(255) NULL,
  T_Status VARCHAR(50) DEFAULT 'Active',
  T_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
  T_Username VARCHAR(255) NULL,
  T_Password VARCHAR(255) NULL,
  T_Email VARCHAR(255) NULL,
  T_PhoneNo VARCHAR(20) NULL,
  T_Sex VARCHAR(20) NULL,
  T_Fullname VARCHAR(255) NULL
);

CREATE TABLE student (
  S_id INT AUTO_INCREMENT PRIMARY KEY,
  S_QRcode VARCHAR(255) NULL,
  S_Status VARCHAR(50) DEFAULT 'Active',
  S_DateTimeCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
  S_Level VARCHAR(50) NULL,
  S_StudentID VARCHAR(50) NULL,
  S_Fullname VARCHAR(255) NULL,
  S_Category VARCHAR(100) NULL,
  S_Sex VARCHAR(20) NULL,
  S_Email VARCHAR(255) NULL,
  S_PhoneNo VARCHAR(20) NULL,
  S_Username VARCHAR(255) NULL,
  S_Password VARCHAR(255) NULL
);


CREATE TABLE transaction (
  transac_id INT AUTO_INCREMENT PRIMARY KEY,
  DateTimeFiled DATETIME DEFAULT CURRENT_TIMESTAMP,
  Usertype VARCHAR(50) NULL,
  User_id INT NULL,
  requestedby_id INT NULL,
  approvedby_id INT NULL,
  reservation_status VARCHAR(50) DEFAULT 'Pending',
  transac_status VARCHAR(50) DEFAULT 'Active',
  transac_reason TEXT NULL,
  Transac_Category VARCHAR(255) NULL,
  dateofuse DATETIME NULL,
  fromtime TIME NULL,
  totime TIME NULL,
  returnedtime DATETIME NULL,
  comments_afteruse TEXT NULL,
  notif_status VARCHAR(50) DEFAULT 'Unread',
  FOREIGN KEY (User_id) REFERENCES student(S_id),
  FOREIGN KEY (User_id) REFERENCES staff(T_id),
  FOREIGN KEY (requestedby_id) REFERENCES staff(T_id),
  FOREIGN KEY (approvedby_id) REFERENCES staff(T_id)
);
