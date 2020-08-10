USE employee_tracker_db;

-- Insert into department table
INSERT INTO `employee_tracker_db`.`department` (`name`)
VALUES ("Engineering/IT");  -- id 1

INSERT INTO `employee_tracker_db`.`department` (`name`)
VALUES ("Finance");         -- id 2

INSERT INTO `employee_tracker_db`.`department` (`name`)
VALUES ("Legal");           -- id 3

INSERT INTO `employee_tracker_db`.`department` (`name`)
VALUES ("Sales");           -- id 4

-- Insert into role table
INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Accountant", 125000, 2);         -- id 1

INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Account Manager", 75000, 2);     -- id 2

INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Lawyer", 190000, 3);             -- id 3

INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Lead Engineer", 150000, 1);      -- id 4

INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Legal Team Lead", 250000, 2);    -- id 5

INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Sales Lead", 100000, 4);         -- id 6

INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Salesperson", 80000, 4);         -- id 7

INSERT INTO `employee_tracker_db`.`role` (`title`, `salary`, `department_id`)
VALUES ("Software Engineer", 120000, 1);  -- id 8

-- Insert into employee table
INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`, `manager_id`)
VALUES ("John", "Doe", 6, 3);               -- id 1

INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`, `manager_id`)
VALUES ("Mike", "Chan", 7, 1);              -- id 2

INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`)
VALUES ("Ashley", "Rodriguez", 4);          -- id 3

INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`, `manager_id`)
VALUES ("Kevin", "Tupik", 8, 1);            -- id 4

INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`)
VALUES ("Malia", "Brown", 1);               -- id 5

INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`)
VALUES ("Sarah", "Lourd", 5);               -- id 6

INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`, `manager_id`)
VALUES ("Tom", "Allen", 3, 6);              -- id 7

INSERT INTO `employee_tracker_db`.`employee` (`first_name`, `last_name`, `role_id`, `manager_id`)
VALUES ("Christian", "Eckenrode", 4, 2);    -- id 8


