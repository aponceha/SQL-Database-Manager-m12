import express  from 'express';
import inquirer from 'inquirer';
import mysql from 'mysql2';
// import fs from 'fs';
import cTable from 'console.table';
import * as queries from './queries.js';


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mycompany_db'
  },
  console.log(`Connected to the mycompany_db database.`)
);

export default db;



var allDepts = [];

const findAllDepartments = () => {db.query({sql: `SELECT dept_name, id FROM department`,
 rowsAsArray: true},(err, results) => {
  if (err) {
      throw err;
  }
  allDepts = results
  console.log('Departments: ', allDepts);
});
}

const allRoles = [];

const findAllRoles = () => { db.query({sql: `SELECT title, id FROM roles`, rowsAsArray: true},
  (err, results) => {
  if (err) {
      throw err;
  }
  allRoles = results
  console.log('Roles: ', allRoles);
});
}

  

const allEmployees = [];
const findAllEmployees = () => {db.query({sql: `SELECT first_name, last_name, id FROM employee`,
  rowsAsArray: true}, (err, results) => {
  if (err) {
      throw err;
  }
  allEmployees = results
  console.log('Employees: ', allEmployees);
  })};

const allManagers = [];
const findAllManagers = () => {db.query({sql: `SELECT first_name, last_name, id FROM employee WHERE manager_id IS NOT NULL`,
 rowsAsArray: true}, (err, results) => {
  if (err) {
      throw err;
  }
  allManagers = results
  console.log('Managers: ', allManagers);
 })};


function mainMenu () {


  findAllDepartments(); 
  // findAllRoles();
  // findAllEmployees();
  // findAllManagers();

  

  console.log(''); // empty line
  inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            `Update an employee's role`,
            'Update an employee\'s manager',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'View employees by manager',
            'View employees by department',
            'Exit'
        ]
    }
  ])
  .then((answer) => {
    switch (answer.action) {
        case 'View all departments':
            queries.viewDepartments();
            mainMenu();
            break;
        case 'View all roles':
          queries.viewRoles();
          mainMenu();
            break;
        case 'View all employees':
          queries.viewAllData();
          mainMenu();
            break;
        case 'Add a department':
          addDepartmentPrompt();
            break;
        case 'Add a role':

          findAllDepartments();
          console.log('test');
          addRolePrompt();
            break;
        case 'Add an employee':
          findAllRoles();
          addEmployeePrompt();
            break;
        case `Update an employee's role`:
          updateEmployeeRolePrompt();
            break;
        case 'Update an employee\'s manager':
          updateEmployeeManagerPrompt();
            break;
        case 'Delete a department':
          deleteDepartmentPrompt();
            break;
        case 'Delete a role':
          deleteRolePrompt();
            break;
        case 'Delete an employee':
          deleteEmployeePrompt();
            break;
        case 'View employees by manager':
          viewEmployeesByManagerPrompt();
            break;
        case 'View employees by department':
          viewEmployeesByDepartmentPrompt();
            break;
        case 'Exit':
            db.end();
            break;
    }
  }) 
}     



function addDepartmentPrompt() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'dept_name',
      message: 'What is the name of the department you would like to add?'
    }
  ])
  .then((answer) => {
    queries.addDepartment(answer);
    mainMenu();
  })
}

function addRolePrompt() {
  console.log('deptsname: ' + allDepts);
  let deptsName = allDepts.map(role => role[0]);
  let deptsId = allDepts.map(role => role[1]);
  
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the role you would like to add?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role you would like to add?'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Which department would you like this role to belong to?',
      choices: deptsName
    }
  ])
  .then((answer) => {
    queries.addRole(answer);
    mainMenu();
  })
}

function addEmployeePrompt() {
  let rolesName = allRoles.map(role => role[0]);
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of the employee you would like to add?'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the employee you would like to add?'
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Which role would you like this employee to have?',
      choices: allRoles
    },
    {
      type: 'input',
      name: 'manager_id',
      message: 'What is the manager id of the employee you would like to add?'
    }
  ])
  .then((answer) => {
    queries.addEmployee(answer);
    mainMenu();
  })
}

function updateEmployeeRolePrompt() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employee_id',
      message: 'What is the id of the employee you would like to update?'
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'What is the new role id of the employee you would like to update?'
    }
  ])
  .then((answer) => {
    queries.updateEmployeeRole(answer);
    mainMenu();
  })
}

function updateEmployeeManagerPrompt() {
  inquirer.prompt([
    {
      type: 'input',
    }
  ])
}

function deleteDepartmentPrompt() {}

function deleteRolePrompt() {}

function deleteEmployeePrompt() {}

function viewEmployeesByManagerPrompt() {}

function viewEmployeesByDepartmentPrompt() {}



// Function to start application for employee manager
function init() {
  // run schema.sql and seeds.sql
 
// prompt user what would you like to do and display list of options
  mainMenu();


}

init();


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});