USE employee_tracker_db;

-- -- STANDARD QUERIES -- --
-- Employee List
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
  LEFT JOIN employee m on m.id = e.manager_id

-- Get Departments
SELECT  d.id, d.name 
FROM    department d 
ORDER BY d.name;

-- Get Roles
SELECT  r.id, r.title 
FROM    role r 
ORDER BY r.title;

-- Get Current (Active) Employees
SELECT  e.id, 
          CONCAT(e.first_name, " ", e.last_name) name 
FROM    employee e 
WHERE   e.active = true 
ORDER BY e.first_name;

-- Get Termed (Inactive) Employees
SELECT  e.id, 
          CONCAT(e.first_name, " ", e.last_name) name 
FROM    employee e 
WHERE   e.active = false 
ORDER BY e.first_name;

-- Get Managers
SELECT DISTINCT e.manager_id id, 
          CONCAT(m.first_name, " ", m.last_name) name
FROM    employee e
        INNER JOIN	employee m ON e.manager_id = m.id
WHERE   e.manager_id IS NOT NULL
ORDER BY name;

--  1- ALL EMPLOYEES
-- use standard Employee List query above but append to end:
ORDER BY e.first_name;

--  2- ACTIVE EMPLOYEES
-- use standard Employee List query above but append to end:
WHERE    e.active = true
ORDER BY e.first_name;

--  3- INACTIVE EMPLOYEES
-- use standard Employee List query above but append to end:
WHERE    e.active = false
ORDER BY e.first_name;

--  4- ACTIVE EMPLOYEES BY [{DEPARTMENT}]
-- use standard Get Departments query above

--  5- ACTIVE EMPLOYEES BY [{MANAGER}]
-- use standard Get Managers query above

--  6- ADD EMPLOYEE
-- use standard Get Roles and Get Managers queries above for promtps
-- Insert with No Manager
INSERT INTO employee SET ?, 
  {
    first_name: answer.f_name,
    last_name: answer.l_name,
    role_id: chosenRole.id
  }
-- Insert with Manager
INSERT INTO employee SET ?, 
  {
    first_name: answer.f_name,
    last_name: answer.l_name,
    role_id: chosenRole.id,
    manager_id: chosenMgr.id
  }

--  7- TERMINATE EMPLOYEE
-- use standard Get Current (Active) Employees query above for prompt
UPDATE  employee e
SET     e.active = false
WHERE   e.id = 1; -- ${chosenEmp.id};

--  8- ACTIVATE TERMINATED EMPLOYEE
-- use standard Get Termed (Inactive) Employees query above for prompt
UPDATE  employee e
SET     e.active = true
WHERE   e.id = 1; -- ${chosenEmp.id};

--  9- UPDATE EMPLOYEE ROLE
-- use standard Get Current (Active) Employees and Get Roles queries above for prompts
UPDATE  employee e
SET     e.role_id = 1 -- ${chosenRole.id}
WHERE   e.id = 1; -- ${chosenEmp.id};

-- 10- UPDATE EMPLOYEE MANAGER
-- use standard Get Current (Active) Employees query above for prompts
UPDATE  employee e
SET     e.manager_id = 2 -- ${chosenMgr.id}
WHERE   e.id = 1; -- ${chosenEmp.id};

-- 11- VIEW ALL ROLES
SELECT	r.id ID, r.title Title, d.name Department, 
          CASE
            WHEN r.salary < 100000 THEN 
              REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
            WHEN r.salary >= 100000 THEN 
              REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
          END Salary
FROM	role r
        LEFT JOIN department d on d.id = r.department_id
ORDER BY r.title;

-- 12- ADD ROLE
-- use standard Get Departments query above for prompt
INSERT INTO role SET ?,
  {
      title: answer.title,
      salary: answer.salary,
      department_id: chosenDept.id
  }

-- 13- DELETE ROLE & UPDATE EMPLOYEES (if needed)
-- use standard Get Roles query above for prompt
DELETE FROM role r
WHERE r.id = 1; -- ${chosenRole.id};

UPDATE employee e
SET e.role_id = NULL
WHERE e.role_id = 1; -- ${chosenRole.id};

-- 14- VIEW ALL DEPARTMENTS
SELECT * FROM department ORDER BY name;

-- 15- ADD DEPARTMENT
INSERT INTO department SET ?,
  {
      name: answer.name
  }

-- 16- DELETE DEPARTMENT & UPDATE ROLES (if needed)
-- use standard Get Department query above for prompt
DELETE FROM department d
WHERE d.id = 1; -- ${chosenDept.id};

UPDATE role r
SET r.department_id = NULL
WHERE r.department_id = 1; -- ${chosenDept.id};

-- 17- VIEW BUDGETS
SELECT  d.name Department, 
          CASE
            WHEN r.salary < 100000 THEN 
              REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(SUM(r.salary), 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(SUM(r.salary), 0) as CHAR)), 4), "  $")) 
            WHEN r.salary >= 100000 THEN 
              REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(SUM(r.salary), 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(SUM(r.salary), 0) as CHAR)), 4), " $")) 
          END Salary,  COUNT(e.id) "Emp Count"
FROM  employee e 
        LEFT JOIN role r on r.id = e.role_id
        LEFT JOIN department d on d.id = r.department_id
WHERE e.active = true
GROUP BY  d.name
ORDER BY  Salary desc;

