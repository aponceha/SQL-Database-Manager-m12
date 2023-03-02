import db from './server.js';
import cTable from 'console.table';



export function viewDepartments() {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(''); // empty line
        console.log(''); // empty line
        console.log(cTable.getTable(results));
        for (let i = 0; i < results.length+2; i++) {
            console.log("");
        }
    });
}

export function viewRoles() {
    db.query(`SELECT * FROM roles`, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(''); // empty line
        console.log(''); // empty line
        console.log(cTable.getTable(results));
        for (let i = 0; i < results.length; i++) {
            console.log("");
        }
});
}

export function viewEmployees() {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
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
        console.log(''); // empty line
        console.log(''); // empty line
        console.log(cTable.getTable(results));
        for (let i = 0; i < results.length; i++) {
            console.log("");
        }
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

export function addRole(role) {
    let allDepts = [];
    const p1 = new Promise((resolve,reject) =>  {

        db.query({sql: `SELECT dept_name, id FROM department`, rowsAsArray: true},(err, results) => {
        if (err) {
            throw err;
        }
        allDepts = results;
        console.log('\n 1');
        
        resolve("Promise 1 resolved!");
        });
        
    });
    p1.then((message) => {

        let deptsName = allDepts.map(role => role[0]);
        let deptsId = allDepts.map(role => role[1]);
        var dept = null;

            for (let i=0; i<deptsName.length; i++) {
                if (role.department_id == deptsName[i]) {
                    dept = deptsId[i];
                }
            }
            db.query(`INSERT INTO roles SET ?`,{
                title: role.title,
                salary: role.salary,
                department_id: dept
                }, 
                (err, results) => {
                if (err) {
                    throw err;
                }
                console.log(''); // empty line
                console.log(`Success! ${role.title} has been added to the database!`);
                viewRoles();
            });
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

export function updateEmployeeManager(employeeId, managerId) {
    db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`,
        [managerId, employeeId], (err, results) => {
            if (err) {
                throw err;
            }
            console.table(results);
    });
}

export function deleteDepartment(departmentId) {
    db.query(`DELETE FROM department WHERE id = ?`, departmentId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
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
    db.query(`SELECT * FROM employee WHERE manager_id = ?`, managerId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
});
}

export function viewEmployeesByDepartment(departmentId) {
    db.query(`SELECT * FROM employee WHERE department_id = ?`, departmentId, (err, results) => {
        if (err) {
            throw err;
        }
        console.table(results);
});
}

