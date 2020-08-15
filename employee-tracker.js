const mySql = require("mysql");
const inquirer = require("inquirer");
//const { SQLQueries } = require("./functions");

//let sqlQuery = new SQLQueries();

const conn = mySql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yourRootPassword#1!",
    database: "employee_tracker_db"
});

// ascii art for application banner
console.log(`
             ________________________________________________
            /                                                \\
           |    _________________________________________     |
           |   |                                         |    |
           |   | .---.             .                     |    |
           |   | |                 |                     |    |
           |   | |--- .--.--. .,-. | .-. .  . .-. .-.    |    |
           |   | |    |  |  | |   )|(   )|  |(.-'(.-'    |    |
           |   | '---''  '  \`-|\`-' \`-\`-' \`--| \`--'\`--'   |    |
           |   |              |             ;            |    |
           |   |              '          \`-'             |    |
           |   |                                         |    |
           |   | .---.          .               .   .-.  |    |
           |   |   |            |             .'|  :   : |    |
           |   |   |.--..--. .-.|.-. .-. .--.   |  |   | |    |
           |   |   ||   .--|(   |-.'(.-' |      |  :   ; |    |
           |   |   ''   \`--\`-\`-''  \`-\`--''    '---'o\`-'  |    |
           |   |                                         |    |
           |   |_________________________________________|    |
           |                                                  |
            \\_________________________________________________/
                   \\___________________________________/
                ___________________________________________
             _-'    .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.  --- \`-_
          _-'.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.--.  .-.-.\`-_
       _-'.-.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-\`__\`. .-.-.-.\`-_
    _-'.-.-.-.-. .-----.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-----. .-.-.-.-.\`-_
 _-'.-.-.-.-.-. .---.-. .-------------------------. .-.---. .---.-.-.-.\`-_
:-------------------------------------------------------------------------:
\`---._.-------------------------------------------------------------._.---'
`);

// connect to the mysql server and sql database
conn.connect(function(err) {
   if (err) throw err;
   // run the start function after the connection is made to prompt the user
   start();
 });
 
 function start() {
   inquirer
     .prompt({
       name: "todo",
       type: "list",
       message: "What would you like to do?",
       choices: [" 1- View all Employees",
                 " 2- View all Active Employees",
                 " 3- View all Terminated Employees",
                 " 4- View all Active Employees by Department",
                 " 5- View all Active Employees by Manager",
                 " 6- Add Employee",
                 " 7- Terminate Employee",
                 " 8- Activate Terminated Employee",
                 " 9- Update Employee Role",
                 "10- Update Employee Manager",
                 "11- View all Roles",
                 "12- Add Role",
                 "13- Delete a Role",
                 "14- View all Departments",
                 "15- Add Department",
                 "16- Delete a Department",
                 "17- I'm done!"
                 ]
     })
     .then(function(answer) {
        switch (answer.todo.substring(0, 3)) {
        case " 1-":
          console.log(" 1- View all Employees");
          viewAllEmployees();
          break;
        case " 2-":
          console.log(" 2- View all Active Employees");
          viewAllActiveEmployees();
          break;
        case " 3-":  
          console.log(" 3- View all Terminated Employees");
          viewAllTerminatedEmployees();
          break;
        case " 4-":
          console.log(" 4- View all Active Employees by Department");
          viewAllActiveEmployeesByDepartment();
          break;
        case " 5-":
          console.log(" 5- View all Active Employees by Manager");
          viewAllActiveEmployeesByManager();
          break;
        case " 6-":
          console.log(" 6- Add Employee");
          addEmployee();
          break;
        case " 7-":
          console.log(" 7- Terminate Employee");
          terminateEmployee();
          break;
        case " 8-":
          console.log(" 8- Activate Terminated Employee");
          activateTerminatedEmployee();
          break;
        case " 9-":
          console.log(" 9- Update Employee Role");
          updateEmployeeRole();
          break;
        case "10-":
          console.log("10- Update Employee Manager");
          updateEmployeeManager();
          break;
        case "11-":
          console.log("11- View all Roles");
          viewAllRoles();
          break;
        case "12-":
          console.log("12- Add Role");
          addRole();
          break;
        case "13-":
         console.log("13- Delete a Role");
         deleteRole();
         break;
        case "14-":
         console.log("14- View all Departments");
         viewAllDepartments();
         break;
        case "15-":
         console.log("15- Add Department");
         addDepartment();
         break;
        case "16-":
         console.log("16- Delete a Department");
         deleteDepartment();
         break;
        default:
          conn.end();
       }
     });
 }


      // -------------------------------------------------------------------------------------- //
      // --------------------------FUNCTIONS--------------------------------------------------- //
      // -------------------------------------------------------------------------------------- //
// 1- View all Employees
function viewAllEmployees() {
   conn.query(`SELECT  e.id ID, 
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
               LEFT JOIN employee m on m.id = e.manager_id;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 2- View all Active Employees
function viewAllActiveEmployees() {
   conn.query(`SELECT  e.id ID, e.first_name "First Name", e.last_name "Last Name", r.title Title, d.name Department, 
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
               WHERE   e.active = true;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 3- View all Terminated Employees
function viewAllTerminatedEmployees() {
   conn.query(`SELECT  e.id ID, e.first_name "First Name", e.last_name "Last Name", r.title Title, d.name Department, 
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
               WHERE   e.active = false;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 4- View all Active Employees by Department
function viewAllActiveEmployeesByDepartment() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 5- View all Active Employees by Manager
function viewAllActiveEmployeesByManager() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 6- Add Employee
function addEmployee() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 7- Terminate Employee
function terminateEmployee() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 8- Activate Terminated Employee
function activateTerminatedEmployee() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 9- Update Employee Role
function updateEmployeeRole() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 10- Update Employee Manager
function updateEmployeeManager() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });   
}

// 11- View all Roles
function viewAllRoles() {
   conn.query(`SELECT	r.id ID, r.title Title, d.name Department, 
                           CASE
                              WHEN r.salary < 100000 THEN 
                                 REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
                              WHEN r.salary >= 100000 THEN 
                                 REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
                           END Salary
               FROM	role r
               LEFT JOIN department d on d.id = r.department_id;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 12- Add Role
function addRole() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 13- Delete a Role
function deleteRole() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 14- View all Departments
function viewAllDepartments() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 15- Add Department
function addDepartment() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

// 16- Delete a Department
function deleteDepartment() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

