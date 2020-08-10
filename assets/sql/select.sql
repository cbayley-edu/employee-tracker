USE employee_tracker_db;

SELECT  *
FROM    department;

SELECT  *
FROM    role;

SELECT  *
FROM    employee;

SELECT  *
FROM    employee e
LEFT JOIN role r ON r.id = e.role_id
LEFT JOIN department d on d.id = r.department_id
LEFT JOIN employee m on m.id = e.manager_id;

-- ALL EMPLOYEES
SELECT  e.id, e.first_name, e.last_name, r.title, d.name department, ROUND(r.salary, 0) salary, CONCAT(m.first_name, " ", m.last_name) manager
FROM    employee e
LEFT JOIN role r ON r.id = e.role_id
LEFT JOIN department d on d.id = r.department_id
LEFT JOIN employee m on m.id = e.manager_id;

-- ACTIVE EMPLOYEES
SELECT  e.id, e.active, e.first_name, e.last_name, r.title, d.name department, ROUND(r.salary, 0) salary, CONCAT(m.first_name, " ", m.last_name) manager
FROM    employee e
LEFT JOIN role r ON r.id = e.role_id
LEFT JOIN department d on d.id = r.department_id
LEFT JOIN employee m on m.id = e.manager_id
WHERE   e.active = true;

-- INACTIVE EMPLOYEES
SELECT  e.id, e.active, e.status, e.first_name, e.last_name, r.title, d.name department, ROUND(r.salary, 0) salary, CONCAT(m.first_name, " ", m.last_name) manager
FROM    employee e
LEFT JOIN role r ON r.id = e.role_id
LEFT JOIN department d on d.id = r.department_id
LEFT JOIN employee m on m.id = e.manager_id
WHERE   e.active = false;