DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;
CREATE TABLE departments (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY name_UNIQUE (name)
);

CREATE TABLE roles (
 id int NOT NULL AUTO_INCREMENT,
 title varchar(30) NOT NULL,
 salary decimal(6,2) DEFAULT NULL,
 department_id int DEFAULT NULL,
  PRIMARY KEY (id),
  KEY department_id_idx (department_id),
  CONSTRAINT department_id FOREIGN KEY (department_id) REFERENCES departments (id)
);

CREATE TABLE employees (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id int NOT NULL,
  manager_id int DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY employeeID_UNIQUE (id),
  KEY manager_id_idx (manager_id),
  KEY role_id_idx (role_id),
  CONSTRAINT manager_id FOREIGN KEY (manager_id) REFERENCES employees (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT role_id FOREIGN KEY (role_id) REFERENCES roles (id)
);