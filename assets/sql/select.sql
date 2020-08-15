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

--  1- ALL EMPLOYEES
SELECT  e.id ID, 
            CASE
                WHEN e.active THEN "Yes"
                WHEN !e.active THEN "No"
            END Active,
            e.first_name "First Name", e.last_name "Last Name", r.title Title, d.name Department, 
            CASE
			          WHEN r.salary < 100000 THEN 
				          REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
                WHEN r.salary >= 100000 THEN 
				          REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
            END Salary,
            CONCAT(m.first_name, " ", m.last_name) Manager
FROM    employee e
LEFT JOIN role r ON r.id = e.role_id
LEFT JOIN department d on d.id = r.department_id
LEFT JOIN employee m on m.id = e.manager_id;

--  2- ACTIVE EMPLOYEES
SELECT  e.id ID, e.first_name "First Name", e.last_name "Last Name", r.title Title, d.name Department, 
            CASE
			          WHEN r.salary < 100000 THEN 
				          REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
                WHEN r.salary >= 100000 THEN 
				          REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
            END Salary,
            CONCAT(m.first_name, " ", m.last_name) Manager
FROM    employee e
LEFT JOIN role r ON r.id = e.role_id
LEFT JOIN department d on d.id = r.department_id
LEFT JOIN employee m on m.id = e.manager_id
WHERE   e.active = true;

--  3- INACTIVE EMPLOYEES
SELECT  e.id ID, e.first_name "First Name", e.last_name "Last Name", r.title Title, d.name Department, 
            CASE
			          WHEN r.salary < 100000 THEN 
				          REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
                WHEN r.salary >= 100000 THEN 
				          REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
            END Salary,
            CONCAT(m.first_name, " ", m.last_name) Manager
FROM    employee e
LEFT JOIN role r ON r.id = e.role_id
LEFT JOIN department d on d.id = r.department_id
LEFT JOIN employee m on m.id = e.manager_id
WHERE   e.active = false;


--  4- ACTIVE EMPLOYEES BY [{DEPARTMENT}]



--  5- ACTIVE EMPLOYEES BY [{MANAGER}]



--  6- ADD EMPLOYEE



--  7- TERMINATE EMPLOYEE



--  8- ACTIVATE TERMINATED EMPLOYEE



--  9- UPDATE EMPLOYEE ROLE



-- 10- UPDATE EMPLOYEE MANAGER



-- 11- VIEW ALL ROLES
SELECT	r.id ID, r.title Title, d.name Department, 
		      CASE
			      WHEN r.salary < 100000 THEN 
				      REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
            WHEN r.salary >= 100000 THEN 
				      REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
          END Salary
FROM	role r
LEFT JOIN department d on d.id = r.department_id;


-- 12- ADD ROLE




-- 13- DELETE ROLE



-- 14- VIEW ALL DEPARTMENTS



-- 15- ADD DEPARTMENT



-- 16- DELETE DEPARTMENT



