import db from './server.js';
import cTable from 'console.table';
import * as main from './server.js';


export function viewDepartments() {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) {
            throw err;
        }
        console.log('\n'); // empty lines
        console.table(results);
        main.mainMenu();
    });
}

export function viewRoles() {
    db.query(`SELECT * FROM roles`, (err, results) => {
        if (err) {
            throw err;
        }
        console.log('\n\n'); // empty lines
        console.table(results);
        main.mainMenu();
});
}

export function viewEmployees() {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
        main.mainMenu();
});
}

// view all employees and join role and department tables

export function viewAllData() {
    db.query(`SELECT employee.id, employee.first_name, 
    employee.last_name, roles.title, department.dept_name AS department, roles.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) 
    AS manager FROM employee LEFT JOIN roles ON employee.role_id = 
    roles.id LEFT JOIN department ON roles.department_id = 
    department.id LEFT JOIN employee manager ON manager.id = 
    employee.manager_id ORDER BY employee.id;`, (err, results) => {
        if (err) {
            throw err;
        }
        console.log('\n'); // empty line
        console.table(results);
        main.mainMenu();
});
}

export function addDepartment(department) {
    db.query(`INSERT INTO department (dept_name) VALUES (?)`, department.dept_name, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(''); // empty line
        console.log(`Success! ${department.dept_name} has been added to the database!`);
        viewDepartments();
    });
}

export function addEmployee(employee) {
    db.query(`INSERT INTO employee SET ?`, employee, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
});
}

export function updateEmployeeRole(employeeId, roleId) {
    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`,
     [roleId, employeeId], (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
});
}

export function findTeamByManagers(managerId) {
    db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name)AS person, roles.title, department.dept_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) 
    AS manager, employee.manager_id FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = 
    department.id LEFT JOIN employee manager ON manager.id = 
   employee.manager_id WHERE employee.manager_id IS NOT NULL;`, departmentId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
        main.mainMenu();
});
}

export function deleteRole(roleId) {
    db.query(`DELETE FROM roles WHERE id = ?`, roleId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
});
}

export function deleteEmployee(employeeId) {
    db.query(`DELETE FROM employee WHERE id = ?`, employeeId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
});
}

export function viewEmployeesByManager(managerId) {
    db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name)AS person, roles.title, department.dept_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) 
    AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = 
    department.id LEFT JOIN employee manager ON manager.id = 
   employee.manager_id WHERE employee.manager_id = ?`, managerId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
        main.mainMenu();
    });
}

export function viewEmployeesByDepartment(departmentId) {
    db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name)AS person, roles.title, department.dept_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) 
    AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = 
    department.id LEFT JOIN employee manager ON manager.id = 
   employee.manager_id WHERE department.id = ?`, departmentId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
        main.mainMenu();
});
}

