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
 
 // start function that lists all of the options 
 // this function is called at the end of each selected option's function
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
                 "17- View all Departments' Budgets",
                 "18- I'm done!"
                 ]
     })
     // calls functions for each option - functions are all in the function.js file
     // pass the connection and start function
     // uncomment the console logs if you want to ensure the switch case is working correctly
     .then(function(answer) {
        switch (answer.todo.substring(0, 3)) {
         case " 1-":
            //console.log(" 1- View all Employees");
            f.viewAllEmployees(conn, start);
            break;
         case " 2-":
            //console.log(" 2- View all Active Employees");
            f.viewAllActiveEmployees(conn, start);
            break;
         case " 3-":  
            //console.log(" 3- View all Terminated Employees");
            f.viewAllTerminatedEmployees(conn, start);
            break;
         case " 4-":
            //console.log(" 4- View all Active Employees by Department");
            f.viewAllActiveEmployeesByDepartment(conn, start);
            break;
         case " 5-":
            //console.log(" 5- View all Active Employees by Manager");
            f.viewAllActiveEmployeesByManager(conn, start);
            break;
         case " 6-":
            //console.log(" 6- Add Employee");
            f.addEmployee(conn, start);
            break;
         case " 7-":
            //console.log(" 7- Terminate Employee");
            f.terminateEmployee(conn, start);
            break;
         case " 8-":
            //console.log(" 8- Activate Terminated Employee");
            f.activateTerminatedEmployee(conn, start);
            break;
         case " 9-":
            //console.log(" 9- Update Employee Role");
            f.updateEmployeeRole(conn, start);
            break;
         case "10-":
            //console.log("10- Update Employee Manager");
            f.updateEmployeeManager(conn, start);
            break;
         case "11-":
            //console.log("11- View all Roles");
            f.viewAllRoles(conn, start);
            break;
         case "12-":
            //console.log("12- Add Role");
            f.addRole(conn, start);
            break;
         case "13-":
            //console.log("13- Delete a Role");
            f.deleteRole(conn, start);
            break;
         case "14-":
            //console.log("14- View all Departments");
            f.viewAllDepartments(conn, start);
            break;
         case "15-":
            //console.log("15- Add Department");
            f.addDepartment(conn, start);
            break;
         case "16-":
            //console.log("16- Delete a Department");
            f.deleteDepartment(conn, start);
            break;
         case "17-":
            //console.log("17- View all Departments' Budgets");
            f.viewAllDepartmentsBudgets(conn, start);
            break;
         default:
            conn.end();
        }
    });
 }

