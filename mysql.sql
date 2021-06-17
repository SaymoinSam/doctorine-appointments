CREATE USER 'dRoOcTtCoOrD'@'localhost' IDENTIFIED BY 'd2R1_o4O$c&3TtC@o7O_rD';

GRANT ALL PRIVILEGES ON doctor_appointments.* TO 'dRoOcTtCoOrD'@'localhost';

Use doctor_appointments;

CREATE TABLE if not exists Doctors (
  doctorID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userName varchar(255),
  password varchar(255)
);

CREATE TABLE if not exists Patients (
  patientID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstName varchar(255),
  lastName varchar(255),
  userName varchar(255),
  email varchar(255),
  cardID varchar(255),
  password varchar(255)
)

CREATE TABLE if not exists Appointments (
  appointmentID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hour Int,
  minute Int,
  isTaken Bit(1),
  appointmentPatientID Int,
  FOREIGN KEY (appointmentPatientID) REFERENCES Patients(patientID)
);