const mySql = require("mysql");
const inquirer = require("inquirer");

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
                 "13- I'm done!"
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
        default:
          conn.end();
       }
     });
 }

function viewAllEmployees() {
   conn.query(`SELECT  e.id ID, 
                  CASE
                     WHEN e.active THEN "Yes"
                     WHEN !e.active THEN "No"
                  END Active,
                  e.first_name F_Name, e.last_name L_Name, r.title Title, d.name Department, 
                  ROUND(r.salary, 0) Salary, CONCAT(m.first_name, " ", m.last_name) Manager
               FROM    employee e
               LEFT JOIN role r ON r.id = e.role_id
               LEFT JOIN department d on d.id = r.department_id
               LEFT JOIN employee m on m.id = e.manager_id;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

function viewAllActiveEmployees() {
   conn.query(`SELECT  e.id ID, e.first_name F_Name, e.last_name L_Name, r.title Title, d.name Department, 
                  ROUND(r.salary, 0) Salary, CONCAT(m.first_name, " ", m.last_name) Manager
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

function viewAllTerminatedEmployees() {
   conn.query(`SELECT  e.id ID, e.first_name F_Name, e.last_name L_Name, r.title Title, d.name Department, 
                  ROUND(r.salary, 0) Salary, CONCAT(m.first_name, " ", m.last_name) Manager
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

function viewAllActiveEmployeesByDepartment() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

function viewAllActiveEmployeesByManager() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

function addEmployee() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

function terminateEmployee() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

function activateTerminatedEmployee() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

function updateEmployeeRole() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

function updateEmployeeManager() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });   
}

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

function addRole() {


   conn.query(`SELECT * FROM employee;`, function(err, results) {
      if (err) throw err;
      console.table(results);
      start();
   });
}

