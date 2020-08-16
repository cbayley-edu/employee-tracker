const inquirer = require("inquirer");

// -------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------------COMMON QUERIES------------------------------------------------ //
// -------------------------------------------------------------------------------------------------------------- //
// these are used in various functions below to alleviate repetative queries in the code
const qry_standardEmpList = `SELECT  e.id ID, 
                              CASE
                                 WHEN e.active THEN "Yes"
                                 WHEN !e.active THEN "No"
                              END Active,
                              e.first_name "First Name", e.last_name "Last Name", r.title Title, d.name Department, 
                              LPAD(CONCAT('$ ', FORMAT(r.salary, 0)), 12, ' ') Salary,  
                              CONCAT(m.first_name, " ", m.last_name) Manager
                              FROM    employee e
                                LEFT JOIN role r ON r.id = e.role_id
                                LEFT JOIN department d on d.id = r.department_id
                                LEFT JOIN employee m on m.id = e.manager_id`

const qry_getDepartments = `SELECT d.id, d.name FROM department d ORDER BY d.name;`;

const qry_getRoles = `SELECT r.id, r.title FROM role r ORDER BY r.title;`;

const qry_getCurrentEmployees = `SELECT e.id, CONCAT(e.first_name, " ", e.last_name) name FROM employee e WHERE e.active = true ORDER BY e.first_name;`;

const qry_getTermedEmployees = `SELECT e.id, CONCAT(e.first_name, " ", e.last_name) name FROM employee e WHERE e.active = false ORDER BY e.first_name;`;

const qry_getManagers = `SELECT DISTINCT e.manager_id id, CONCAT(m.first_name, " ", m.last_name) name
                         FROM	employee e
                              INNER JOIN	employee m ON e.manager_id = m.id
                         WHERE e.manager_id IS NOT NULL
                         ORDER BY name;`

// --------------------------------------------------------------------------------------------------------------- //
// ---------------------------------------------------FUNCTIONS--------------------------------------------------- //
// --------------------------------------------------------------------------------------------------------------- //
// function to validate inquirer prompts (questions) that can't be blank
const cannotBeBlank = async(input) => {
    if (input === "") {
       return "You must supply a value";
    }
    return true;
 };

 // function to validate inquirer prompts (questions) that must be numeric and not blank
const mustBeNumeric = async(input) => {
    if (parseInt(input) != input) {
       return "You must supply a numeric value";
    }
    return true;
 };
 
 // 1- View all Employees
 function viewAllEmployees(conn, start) {
    conn.query(`${qry_standardEmpList} 
                    ORDER BY e.first_name;`, (err, results) => {
       if (err) throw err;
       console.table(results);
       start();
    });
 }
 
 // 2- View all Active Employees
 function viewAllActiveEmployees(conn, start) {
    conn.query(`${qry_standardEmpList}
                WHERE   e.active = true
                ORDER BY e.first_name;`, (err, results) => {
       if (err) throw err;
       console.table(results);
       start();
    });
 }
 
 // 3- View all Terminated Employees
 function viewAllTerminatedEmployees(conn, start) {
    conn.query(`${qry_standardEmpList}
                WHERE   e.active = false
                ORDER BY e.first_name;`, (err, results) => {
       if (err) throw err;
       console.table(results);
       start();
    });
 }
 
 // 4- View all Active Employees by Department
 function viewAllActiveEmployeesByDepartment(conn, start) {
    conn.query(`${qry_getDepartments};`, function(err, results) {
       if (err) throw err;
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Select a Department",
        choices: function() {
          var deptArray = [];
          for (var i = 0; i < results.length; i++) {
             deptArray.push(results[i].name);
          }
          return deptArray;
        }
      })
      .then(function(answer) {
          var chosenDept;
          for (var i = 0; i < results.length; i++) {
             if (results[i].name === answer.department) {
                chosenDept = results[i];
             }
          }
          conn.query(`${qry_standardEmpList}
                      WHERE   e.active = true
                         AND d.id = ${chosenDept.id};`, function(err, results) {
                if (err) throw err;
                console.table(results);
                start();
          });
       });
    });
 }
 
 // 5- View all Active Employees by Manager
 function viewAllActiveEmployeesByManager(conn, start) {
    conn.query(`${qry_getManagers};`, function(err, results) {
       if (err) throw err;
    inquirer
      .prompt(
       {
        name: "manager",
        type: "list",
        message: "Select a Manager",
        choices: function() {
          var mgrArray = [];
          for (var i = 0; i < results.length; i++) {
             mgrArray.push(results[i].name);
          }
          return mgrArray;
        }
      })
      .then(function(answer) {
          var chosenMgr;
          for (var i = 0; i < results.length; i++) {
             if (results[i].name === answer.manager) {
                chosenMgr = results[i];
             }
          }
          conn.query(`${qry_standardEmpList}
                      WHERE   e.active = true
                               AND m.id = ${chosenMgr.id};`, function(err, results) {
                if (err) throw err;
                console.table(results);
                start();
          });
       });
    });
 }
 
 // 6- Add Employee
 function addEmployee(conn, start) {
    conn.query(`${qry_getRoles};`, function(err, roleRes) {
       if (err) throw err;
       conn.query(`${qry_getManagers};`, function(err, mgrRes) {
          if (err) throw err;
          inquirer
          .prompt([
          {
             name: "f_name",
             type: "input",
             message: "What is the employee's first name?"
          },
          {
             name: "l_name",
             type: "input",
             message: "What is the employee's last name?",
             validate: cannotBeBlank
          },
          {
             name: "role",
             type: "list",
             message: "Select their role.",
             choices: function() {
                var roleArray = [];
                for (var i = 0; i < roleRes.length; i++) {
                   roleArray.push(roleRes[i].title);
                }
                return roleArray;
            }
          },
          {
             name: "manager",
             type: "list",
             message: "Select their manager.",
             choices: function() {
                var mgrArray = [];
                for (var i = 0; i < mgrRes.length; i++) {
                   mgrArray.push(mgrRes[i].name);
                }
                mgrArray.push("No Manager");
                return mgrArray;
             }
          }])
          .then(function(answer) {
          // when finished prompting, insert a new employee into the db with the entered/selected info
             var chosenRole;
             for (var i = 0; i < roleRes.length; i++) {
                if (roleRes[i].title === answer.role) {
                   chosenRole = roleRes[i];
                }
             }
             var chosenMgr;
             for (var i = 0; i < mgrRes.length; i++) {
                if (mgrRes[i].name === answer.manager) {
                   chosenMgr = mgrRes[i];
                } 
             } 
             if (typeof chosenMgr === "undefined") {
                conn.query(
                    "INSERT INTO employee SET ?",
                    {
                       first_name: answer.f_name,
                       last_name: answer.l_name,
                       role_id: chosenRole.id
                    },
                    function(err) {
                       if (err) throw err;
                       console.log("Employee created successfully!");
                       start();
                    });
             } else {
                conn.query(
                "INSERT INTO employee SET ?",
                {
                   first_name: answer.f_name,
                   last_name: answer.l_name,
                   role_id: chosenRole.id,
                   manager_id: chosenMgr.id
                },
                function(err) {
                   if (err) throw err;
                   console.log("Employee created successfully!");
                   start();
                });
              }
          });
       });
    });
 }
 
 // 7- Terminate Employee
 function terminateEmployee(conn, start) {
    conn.query(`${qry_getCurrentEmployees};`, function(err, results) {
        if (err) throw err;
     inquirer
       .prompt({
         name: "employee",
         type: "list",
         message: "Select an Employee to Terminate",
         choices: function() {
           var empArray = [];
           for (var i = 0; i < results.length; i++) {
            empArray.push(results[i].name);
           }
           return empArray;
         }
       })
       .then(function(answer) {
           var chosenEmp;
           for (var i = 0; i < results.length; i++) {
              if (results[i].name === answer.employee) {
                chosenEmp = results[i];
              }
           }
           conn.query(`UPDATE employee e
                       SET   e.active = false
                       WHERE e.id = ${chosenEmp.id};`, function(err, results) {
                 if (err) throw err;
                 console.log("Employee is now terminated.");
                 start();
           });
        });
     });
  }
 
 // 8- Activate Terminated Employee
 function activateTerminatedEmployee(conn, start) {
    conn.query(`${qry_getTermedEmployees};`, function(err, results) {
        if (err) throw err;
     inquirer
       .prompt({
         name: "employee",
         type: "list",
         message: "Select an Employee to Activate",
         choices: function() {
           var empArray = [];
           for (var i = 0; i < results.length; i++) {
            empArray.push(results[i].name);
           }
           return empArray;
         }
       })
       .then(function(answer) {
           var chosenEmp;
           for (var i = 0; i < results.length; i++) {
              if (results[i].name === answer.employee) {
                chosenEmp = results[i];
              }
           }
           conn.query(`UPDATE employee e
                       SET   e.active = true
                       WHERE e.id = ${chosenEmp.id};`, function(err, results) {
                 if (err) throw err;
                 console.log("Employee is now active.");
                 start();
           });
        });
     });
  }
 
 // 9- Update Employee Role
 function updateEmployeeRole(conn, start) {
    conn.query(`${qry_getCurrentEmployees};`, function(err, empResults) {
        if (err) throw err;
        conn.query(`${qry_getRoles};`, function(err, roleResults) {
            if (err) throw err;
        inquirer
        .prompt([
            {
                name: "employee",
                type: "list",
                message: "Select an Active Employee to Update",
                choices: function() {
                var empArray = [];
                for (var i = 0; i < empResults.length; i++) {
                    empArray.push(empResults[i].name);
                }
                return empArray;
                }
            },
            {
                name: "role",
                type: "list",
                message: "Select the Employee's New Role",
                choices: function() {
                var roleArray = [];
                for (var i = 0; i < roleResults.length; i++) {
                    roleArray.push(roleResults[i].title);
                }
                return roleArray;
                }
            }
        ])
       .then(function(answer) {
           var chosenEmp;
           for (var i = 0; i < empResults.length; i++) {
              if (empResults[i].name === answer.employee) {
                chosenEmp = empResults[i];
              }
           }
           var chosenRole;
           for (var j = 0; j < roleResults.length; j++) {
              if (roleResults[j].title === answer.role) {
                chosenRole = roleResults[j];
              }
           }
           conn.query(`UPDATE employee e
                       SET   e.role_id = ${chosenRole.id}
                       WHERE e.id = ${chosenEmp.id};`, function(err, results) {
                 if (err) throw err;
                 console.log("Employee's role is updated.");
                 start();
             });
          });
       });
    });
  }
 
 // 10- Update Employee Manager
 function updateEmployeeManager(conn, start) {
    conn.query(`${qry_getCurrentEmployees};`, function(err, results) {
        if (err) throw err;
    inquirer
    .prompt([
        {
            name: "employee",
            type: "list",
            message: "Select an Active Employee to Update",
            choices: function() {
            var empArray = [];
            for (var i = 0; i < results.length; i++) {
                empArray.push(results[i].name);
            }
            return empArray;
            }
        },
        {
            name: "manager",
            type: "list",
            message: "Select the Employee's New Manager",
            choices: function() {
            var mgrArray = [];
            for (var i = 0; i < results.length; i++) {
                mgrArray.push(results[i].name);
            }
            return mgrArray;
            }
        }
    ])
    .then(function(answer) {
        var chosenEmp;
        for (var i = 0; i < results.length; i++) {
            if (results[i].name === answer.employee) {
            chosenEmp = results[i];
            }
        }
        var chosenMgr;
        for (var j = 0; j < results.length; j++) {
            if (results[j].name === answer.manager) {
                chosenMgr = results[j];
            }
        }
        conn.query(`UPDATE employee e
                    SET   e.manager_id = ${chosenMgr.id}
                    WHERE e.id = ${chosenEmp.id};`, function(err, results) {
                if (err) throw err;
                console.log("Employee's manager is updated.");
                start();
            });
        });
    });
  }
 
 // 11- View all Roles
 function viewAllRoles(conn, start) {
    conn.query(`SELECT	r.id ID, r.title Title, d.name Department, 
                    LPAD(CONCAT('$ ', FORMAT(r.salary, 0)), 12, ' ') Salary
                FROM	role r
                            LEFT JOIN department d on d.id = r.department_id
                ORDER BY r.title;`, function(err, results) {
       if (err) throw err;
       console.table(results);
       start();
    });
 }
 
 // 12- Add Role
 function addRole(conn, start) {
    conn.query(`${qry_getDepartments};`, function(err, results) {
        if (err) throw err;
        inquirer
        .prompt([
        {
            name: "title",
            type: "input",
            message: "What is the role/title?",
            validate: cannotBeBlank
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary?",
            validate: mustBeNumeric
        },
        {
            name: "department",
            type: "list",
            message: "Select the department.",
            choices: function() {
                var deptArray = [];
                for (var i = 0; i < results.length; i++) {
                    deptArray.push(results[i].name);
                }
                return deptArray;
            }
        }])
        .then(function(answer) {
        // when finished prompting, insert a new role into the db with the entered/selected info
            var chosenDept;
            for (var i = 0; i < results.length; i++) {
                if (results[i].name === answer.department) {
                    chosenDept = results[i];
                }
            }
            conn.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: chosenDept.id
                },
                function(err) {
                if (err) throw err;
                console.log("Role created successfully!");
                start();
            });
        });
    });
 }
 
 // 13- Delete a Role
 function deleteRole(conn, start) {
    conn.query(`${qry_getRoles};`, function(err, results) {
        if (err) throw err;
    inquirer
    .prompt(
        {
            name: "role",
            type: "list",
            message: "Select the Role to Delete (this will remove the role for existing employees as well).",
            choices: function() {
            var roleArray = [];
            for (var i = 0; i < results.length; i++) {
                roleArray.push(results[i].title);
            }
            return roleArray;
            }
        })
    .then(function(answer) {
        var chosenRole;
        for (var i = 0; i < results.length; i++) {
            if (results[i].title === answer.role) {
            chosenRole = results[i];
            }
        }
        conn.query(`DELETE FROM role r
                    WHERE r.id = ${chosenRole.id};`, function(err, results) {
                if (err) throw err;
            conn.query(`UPDATE employee e
                    SET e.role_id = NULL
                    WHERE e.role_id = ${chosenRole.id};`, function(err, results) {
                    if (err) throw err;
                    console.log("The selected Role has been deleted.");
                    start();
                });
            });
        });
    });
 }
 
 // 14- View all Departments
 function viewAllDepartments(conn, start) {
     conn.query(`SELECT * FROM department ORDER BY name;`, function(err, results) {
       if (err) throw err;
       console.table(results);
       start();
    });
 }
 
 // 15- Add Department
 function addDepartment(conn, start) {
    inquirer
    .prompt({
        name: "name",
        type: "input",
        message: "What is the new Department Name?",
        validate: cannotBeBlank
    })
    .then(function(answer) {
    // when finished prompting, insert a new department into the db with the entered info
        conn.query(
            "INSERT INTO department SET ?",
            {
                name: answer.name
            },
            function(err) {
                if (err) throw err;
                console.log("Department created successfully!");
                start();
        });
    });
 }
 
 // 16- Delete a Department
 function deleteDepartment(conn, start) {
    conn.query(`${qry_getDepartments};`, function(err, results) {
        if (err) throw err;
    inquirer
    .prompt(
        {
            name: "department",
            type: "list",
            message: "Select the Department to Delete (this will remove the department from existing roles as well).",
            choices: function() {
            var deptArray = [];
            for (var i = 0; i < results.length; i++) {
                deptArray.push(results[i].name);
            }
            return deptArray;
            }
        })
    .then(function(answer) {
        var chosenDept;
        for (var i = 0; i < results.length; i++) {
            if (results[i].name === answer.department) {
                chosenDept = results[i];
            }
        }
        conn.query(`DELETE FROM department d
                        WHERE d.id = ${chosenDept.id};`, function(err, results) {
                    if (err) throw err;
            conn.query(`UPDATE role r
                        SET r.department_id = NULL
                        WHERE r.department_id = ${chosenDept.id};`, function(err, results) {
                    if (err) throw err;
                    console.log("The selected Department has been deleted.");
                    start();
                });
            });
        });
    });
 }

// 17- View all Departments' Budgets
function viewAllDepartmentsBudgets(conn, start) {
    conn.query(`SELECT	d.name Department, 
                        LPAD(CONCAT('$ ', FORMAT(SUM(r.salary), 0)), 12, ' ') Salary,  
                        COUNT(e.id) "Emp Count"
                    FROM	employee e 
                            LEFT JOIN role r on r.id = e.role_id
                            LEFT JOIN department d on d.id = r.department_id
                    WHERE	e.active = true
                    GROUP BY d.name
                    ORDER BY Salary desc;`, function(err, results) {
       if (err) throw err;
       console.table(results);
       start();
    });
 }

 // export functions to call in employee-tracker.js
module.exports = { 
                viewAllEmployees: viewAllEmployees, 
                viewAllActiveEmployees: viewAllActiveEmployees,
                viewAllTerminatedEmployees: viewAllTerminatedEmployees,
                viewAllActiveEmployeesByDepartment: viewAllActiveEmployeesByDepartment,
                viewAllActiveEmployeesByManager: viewAllActiveEmployeesByManager,
                addEmployee: addEmployee,
                terminateEmployee: terminateEmployee,
                activateTerminatedEmployee: activateTerminatedEmployee,
                updateEmployeeRole: updateEmployeeRole,
                updateEmployeeManager: updateEmployeeManager,
                viewAllRoles: viewAllRoles,
                addRole: addRole,
                deleteRole: deleteRole,
                viewAllDepartments: viewAllDepartments,
                addDepartment: addDepartment,
                deleteDepartment: deleteDepartment,
                viewAllDepartmentsBudgets: viewAllDepartmentsBudgets
            };