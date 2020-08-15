const mySql = require("mysql");

class SQLQueries {
    constructor(conn) {
      this.conn = conn;
      
    }

    viewAllEmployees() {
        this.conn.query(`SELECT  e.id ID, 
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
        });
    }



    // getItems(){
    //   this.connection.query(`SELECT * FROM ${this.table}`)
    // }
    // setItems(){
    //   this.connection.query(`INSERT INTO ${this.table}`)
    // }

}

module.exports = { SQLQueries };

// function viewAllEmployees() {
//     conn.query(`SELECT  e.id ID, 
//                    CASE
//                       WHEN e.active THEN "Yes"
//                       WHEN !e.active THEN "No"
//                    END Active,
//                    e.first_name F_Name, e.last_name L_Name, r.title Title, d.name Department, 
//                    ROUND(r.salary, 0) Salary, CONCAT(m.first_name, " ", m.last_name) Manager
//                 FROM    employee e
//                 LEFT JOIN role r ON r.id = e.role_id
//                 LEFT JOIN department d on d.id = r.department_id
//                 LEFT JOIN employee m on m.id = e.manager_id;`, function(err, results) {
//        if (err) throw err;
//        return results; //console.table(results);
//        //start();
//     });
//  }

// module.exports = { viewAllEmployees };
 
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
 
 