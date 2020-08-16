const mySql = require("mysql");
const inquirer = require("inquirer");
const f = require("./functions");

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
          f.viewAllEmployees(conn, start);
          break;
        case " 2-":
          console.log(" 2- View all Active Employees");
          f.viewAllActiveEmployees(conn, start);
          break;
        case " 3-":  
          console.log(" 3- View all Terminated Employees");
          f.viewAllTerminatedEmployees(conn, start);
          break;
        case " 4-":
          console.log(" 4- View all Active Employees by Department");
          f.viewAllActiveEmployeesByDepartment(conn, start);
          break;
        case " 5-":
          console.log(" 5- View all Active Employees by Manager");
          f.viewAllActiveEmployeesByManager(conn, start);
          break;
        case " 6-":
          console.log(" 6- Add Employee");
          f.addEmployee(conn, start);
          break;
        case " 7-":
          console.log(" 7- Terminate Employee");
          f.terminateEmployee(conn, start);
          break;
        case " 8-":
          console.log(" 8- Activate Terminated Employee");
          f.activateTerminatedEmployee(conn, start);
          break;
        case " 9-":
          console.log(" 9- Update Employee Role");
          f.updateEmployeeRole(conn, start);
          break;
        case "10-":
          console.log("10- Update Employee Manager");
          f.updateEmployeeManager(conn, start);
          break;
        case "11-":
          console.log("11- View all Roles");
          f.viewAllRoles(conn, start);
          break;
        case "12-":
          console.log("12- Add Role");
          f.addRole(conn, start);
          break;
        case "13-":
         console.log("13- Delete a Role");
         f.deleteRole(conn, start);
         break;
        case "14-":
         console.log("14- View all Departments");
         f.viewAllDepartments(conn, start);
         break;
        case "15-":
         console.log("15- Add Department");
         f.addDepartment(conn, start);
         break;
        case "16-":
         console.log("16- Delete a Department");
         f.deleteDepartment(conn, start);
         break;
        default:
          conn.end();
       }
     });
 }


// // -------------------------------------------------------------------------------------------------------------------- //
// // ---------------------------------------------------COMMON QUERIES--------------------------------------------------- //
// // -------------------------------------------------------------------------------------------------------------------- //
// const qry_standardEmpList = `SELECT  e.id ID, 
//                               CASE
//                                  WHEN e.active THEN "Yes"
//                                  WHEN !e.active THEN "No"
//                               END Active,
//                               e.first_name "First Name", e.last_name "Last Name", r.title Title, d.name Department, 
//                               CASE
//                                  WHEN r.salary < 100000 THEN 
//                                     REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
//                                  WHEN r.salary >= 100000 THEN 
//                                     REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
//                               END Salary,
//                               CONCAT(m.first_name, " ", m.last_name) Manager
//                               FROM    employee e
//                               LEFT JOIN role r ON r.id = e.role_id
//                               LEFT JOIN department d on d.id = r.department_id
//                               LEFT JOIN employee m on m.id = e.manager_id`;

// const qry_getDepartments = `SELECT id, name FROM department ORDER BY name`;

// const qry_getRoles = `SELECT id, title FROM role ORDER BY title`;

// const qry_getManagers = `SELECT DISTINCT e.manager_id id, CONCAT(m.first_name, " ", m.last_name) name
//                          FROM	employee e
//                               INNER JOIN	employee m ON e.manager_id = m.id
//                          WHERE e.manager_id IS NOT NULL
//                          ORDER BY name;`

// // --------------------------------------------------------------------------------------------------------------- //
// // ---------------------------------------------------FUNCTIONS--------------------------------------------------- //
// // --------------------------------------------------------------------------------------------------------------- //
// // function to validate questions that can't be blank
// const cannotBeBlank = async(input) => {
//    if (input === "") {
//       return "You must supply a value";
//    }
//    return true;
// };

// // 1- View all Employees
// function viewAllEmployees() {
//    conn.query(`${qry_standardEmpList};`, (err, results) => {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 2- View all Active Employees
// function viewAllActiveEmployees() {
//    conn.query(`${qry_standardEmpList}
//                WHERE   e.active = true;`, (err, results) => {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 3- View all Terminated Employees
// function viewAllTerminatedEmployees() {
//    conn.query(`${qry_standardEmpList}
//                WHERE   e.active = false;`, (err, results) => {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 4- View all Active Employees by Department
// function viewAllActiveEmployeesByDepartment() {
//    conn.query(`${qry_getDepartments};`, function(err, results) {
//       if (err) throw err;
//    inquirer
//      .prompt({
//        name: "department",
//        type: "list",
//        message: "Select a Department",
//        choices: function() {
//          var deptArray = [];
//          for (var i = 0; i < results.length; i++) {
//             deptArray.push(results[i].name);
//          }
//          return deptArray;
//        }
//      })
//      .then(function(answer) {
//          var chosenDept;
//          for (var i = 0; i < results.length; i++) {
//             if (results[i].name === answer.department) {
//                chosenDept = results[i];
//             }
//          }
//          conn.query(`${qry_standardEmpList}
//                      WHERE   e.active = true
//                         AND d.id = ${chosenDept.id};`, function(err, results) {
//                if (err) throw err;
//                console.table(results);
//                start();
//          });
//       });
//    });
// }

// // 5- View all Active Employees by Manager
// function viewAllActiveEmployeesByManager() {
//    conn.query(`${qry_getManagers};`, function(err, results) {
//       if (err) throw err;
//    inquirer
//      .prompt(
//       {
//        name: "manager",
//        type: "list",
//        message: "Select a Manager",
//        choices: function() {
//          var mgrArray = [];
//          for (var i = 0; i < results.length; i++) {
//             mgrArray.push(results[i].name);
//          }
//          return mgrArray;
//        }
//      })
//      .then(function(answer) {
//          var chosenMgr;
//          for (var i = 0; i < results.length; i++) {
//             if (results[i].name === answer.manager) {
//                chosenMgr = results[i];
//             }
//          }
//          conn.query(`${qry_standardEmpList}
//                      WHERE   e.active = true
//                               AND m.id = ${chosenMgr.id};`, function(err, results) {
//                if (err) throw err;
//                console.table(results);
//                start();
//          });
//       });
//    });
// }

// // 6- Add Employee
// function addEmployee() {
//    conn.query(`${qry_getRoles};`, function(err, roleRes) {
//       if (err) throw err;
//       conn.query(`${qry_getManagers};`, function(err, mgrRes) {
//          if (err) throw err;
//          inquirer
//          .prompt([
//          {
//             name: "f_name",
//             type: "input",
//             message: "What is the employee's first name?"
//          },
//          {
//             name: "l_name",
//             type: "input",
//             message: "What is the employee's last name?",
//             validate: cannotBeBlank
//          },
//          {
//             name: "role",
//             type: "list",
//             message: "Select their role.",
//             choices: function() {
//                var roleArray = [];
//                for (var i = 0; i < roleRes.length; i++) {
//                   roleArray.push(roleRes[i].title);
//                }
//                return roleArray;
//             }
//          },
//          {
//             name: "manager",
//             type: "list",
//             message: "Select their manager.",
//             choices: function() {
//                var mgrArray = [];
//                for (var i = 0; i < mgrRes.length; i++) {
//                   mgrArray.push(mgrRes[i].name);
//                }
//                return mgrArray;
//             }
//          }])
//          .then(function(answer) {
//          // when finished prompting, insert a new employee into the db with the entered/selected info
//             var chosenRole;
//             for (var i = 0; i < roleRes.length; i++) {
//                if (roleRes[i].title === answer.role) {
//                   chosenRole = roleRes[i];
//                   roleId = chosenRole.id;
//                }
//             }
//             var chosenMgr;
//             for (var i = 0; i < mgrRes.length; i++) {
//                if (mgrRes[i].name === answer.manager) {
//                   chosenMgr = mgrRes[i];
//                   mgrId = chosenMgr.id;
//                }
//             }
//             conn.query(
//                "INSERT INTO employee SET ?",
//                {
//                   first_name: answer.f_name,
//                   last_name: answer.l_name,
//                   role_id: chosenRole.id,
//                   manager_id: chosenMgr.id
//                },
//                function(err) {
//                   if (err) throw err;
//                   console.log("Employee created successfully!");
//                   start();
//             });
//          });
//       });
//    });
// }

// // 7- Terminate Employee
// function terminateEmployee() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 8- Activate Terminated Employee
// function activateTerminatedEmployee() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 9- Update Employee Role
// function updateEmployeeRole() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 10- Update Employee Manager
// function updateEmployeeManager() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });   
// }

// // 11- View all Roles
// function viewAllRoles() {
//    conn.query(`SELECT	r.id ID, r.title Title, d.name Department, 
//                            CASE
//                               WHEN r.salary < 100000 THEN 
//                                  REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), "  $")) 
//                               WHEN r.salary >= 100000 THEN 
//                                  REVERSE(CONCAT(SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 1, 3),",",SUBSTR(REVERSE(CAST(ROUND(r.salary, 0) as CHAR)), 4), " $")) 
//                            END Salary
//                FROM	role r
//                LEFT JOIN department d on d.id = r.department_id;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 12- Add Role
// function addRole() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 13- Delete a Role
// function deleteRole() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 14- View all Departments
// function viewAllDepartments() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 15- Add Department
// function addDepartment() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

// // 16- Delete a Department
// function deleteDepartment() {


//    conn.query(`SELECT * FROM employee;`, function(err, results) {
//       if (err) throw err;
//       console.table(results);
//       start();
//    });
// }

