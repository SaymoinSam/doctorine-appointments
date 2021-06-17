
## 1)  Create the appointments database

```sql
Create DataBase doctor_appointments;
```

## 2)  Create the doctor admin account

```sql
CREATE USER 'dRoOcTtCoOrD'@'localhost' IDENTIFIED BY 'd2R1_o4O$c&3TtC@o7O_rD';
```
## 3)  Grant all to the doctor account

```sql
GRANT ALL PRIVILEGES ON doctor_appointments.* TO 'dRoOcTtCoOrD'@'localhost';
```

## 4)  Select the database doctor_appointments

```sql
Use doctor_appointments;
```

## 5)  Create the table Doctors
```sql
CREATE TABLE if not exists Doctors (
  doctorID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userName varchar(255),
  password varchar(255)
);
```

## 6)  Create the table Patients

```sql
CREATE TABLE if not exists Patients (
  patientID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstName varchar(255),
  lastName varchar(255),
  userName varchar(255),
  email varchar(255),
  cardID varchar(255),
  password varchar(255)
)
```

## 7)  Create the table Appointments

```sql
CREATE TABLE if not exists Appointments (
  appointmentID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hour Int,
  minute Int,
  isTaken Bit(1),
  appointmentPatientID Int,
  FOREIGN KEY (appointmentPatientID) REFERENCES Patients(patientID)
);
```

## All in one sql file

Firstable create the database

```sql
Create DataBase doctor_appointments;
```

Then execute this command *mysql -u root -p doctor_appointments < mysql.sql* in the cmd, after pasting the code below in a file named `mysql.sql` of course 

```sql
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
```