CREATE TABLE Directorates (
  Directorate_ID INT AUTO_INCREMENT PRIMARY KEY,
  Directorate_Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Programs (
  Program_ID INT AUTO_INCREMENT PRIMARY KEY,
  Program_Name VARCHAR(200) NOT NULL,
  Directorate VARCHAR(100) NOT NULL,
  Sessions_Count INT NOT NULL DEFAULT 0,
  Male_Seats INT NOT NULL DEFAULT 0,
  Female_Seats INT NOT NULL DEFAULT 0,
  Current_Male_Count INT NOT NULL DEFAULT 0,
  Current_Female_Count INT NOT NULL DEFAULT 0,
  Program_Status ENUM('open', 'closed') NOT NULL DEFAULT 'open'
);

CREATE TABLE Students (
  Student_ID INT AUTO_INCREMENT PRIMARY KEY,
  Full_Name VARCHAR(200) NOT NULL,
  ID_Number VARCHAR(50) NOT NULL,
  Phone_Number VARCHAR(30) NOT NULL,
  Birth_Date DATE NOT NULL,
  Gender ENUM('male', 'female') NOT NULL,
  Qualification VARCHAR(100) NOT NULL,
  Directorate VARCHAR(100) NOT NULL,
  Program_ID INT NOT NULL,
  Registration_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  UNIQUE KEY unique_student_id_number (ID_Number),
  UNIQUE KEY unique_student_phone_number (Phone_Number),
  CONSTRAINT fk_students_program FOREIGN KEY (Program_ID) REFERENCES Programs (Program_ID)
);

CREATE TABLE Logs (
  Log_ID INT AUTO_INCREMENT PRIMARY KEY,
  Admin_ID INT NOT NULL,
  Action VARCHAR(255) NOT NULL,
  Date_Time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  IP_Address VARCHAR(45) NOT NULL
);

CREATE TABLE Admins (
  Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) NOT NULL UNIQUE,
  Password_Hash VARCHAR(255) NOT NULL,
  Role VARCHAR(20) NOT NULL DEFAULT 'admin'
);
