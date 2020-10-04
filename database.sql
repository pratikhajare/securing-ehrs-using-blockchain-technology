create database webprojectehrs;

use webprojectehrs;

drop table patient;

create table patient(
   patientId INT NOT NULL AUTO_INCREMENT,
   firstname VARCHAR(100) NOT NULL,
   lastname VARCHAR(100) NOT NULL,
   gender VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    address VARCHAR(100) NOT NULL,
    mobileNo varchar(10) NOT NULL,
    email VARCHAR(20) NOT NULL,
   PRIMARY KEY ( patientId )
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1000;

create table User(
   userId INT NOT NULL AUTO_INCREMENT,
   firstname VARCHAR(100) NOT NULL,
   lastname VARCHAR(100) NOT NULL,
   gender VARCHAR(10) NOT NULL,
   dob date NOT NULL,
    age INT NOT NULL,
    role VARCHAR(10) NOT NULL,
    mobileNo varchar(10) NOT NULL,
    email VARCHAR(20) NOT NULL,
   PRIMARY KEY ( userId )
)ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1000;


select * from patient;