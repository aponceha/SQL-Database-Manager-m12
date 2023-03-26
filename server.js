import express, { query } from 'express';
import inquirer from 'inquirer';
import mysql from 'mysql2';
import * as queries from './queries.js';
import figlet from 'figlet';
import * as dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the mycompany_db database.`)
);

export default db;

const testObj = [
  { id: 1, dept_name: 'Engineering' },
  { id: 2, dept_name: 'Finance' },
  { id: 3, dept_name: 'Legal' },
  { id: 4, dept_name: 'Sales' },
  { id: 5, dept_name: 'Human Resources' },
  { id: 6, dept_name: 'Marketing' },
];

// HELPER FUNCTIONS FOR GETTING  promise of ARRAY OF ALREADY SEEDED DATA

function findAllDepartments() {
  return db.promise().query({
    sql: `SELECT dept_name, id FROM department`,
    rowsAsArray: true
  });
}

function findAllRoles() {
  return db.promise().query(
    { sql: `SELECT title, id FROM roles`, 
    rowsAsArray: true });
}


function findAllEmployees() {
  return db.promise().query({
    sql: `SELECT first_name, last_name, id FROM employee`,
    rowsAsArray: true
  });
}

function findAllManagers() {
  return db.promise().query({
    sql: `SELECT DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) 
    AS manager, employee.manager_id FROM employee LEFT JOIN employee manager ON manager.id = 
   employee.manager_id WHERE employee.manager_id IS NOT NULL;`,
    rowsAsArray: true
  });
}
//  --------------------------------------------------------------------------------------

// START OF APP / INQUIERER

export async function mainMenu() {
  
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
          //  calls viewDepartment query from queries.js and then recalls the main menu
          queries.viewDepartments();
          break;
        case 'View all roles':
          //  calls viewRoles query from queries.js and then recalls the main menu
          queries.viewRoles();
          break;
        case 'View all employees':
          //  calls viewAllData query from queries.js and then recalls the main menu
          queries.viewAllData();
          break;
        case 'Add a department':
          addDepartmentPrompt();
          break;
        case 'Add a role':
          addRolePrompt();
          break;
        case 'Add an employee':
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

// INQUIERER PROMPT FUNCTIONS FOR VARIOUS ACTIONS FORM MAIN MENU
// EG. ADD/UPDATE/DELETE DEPARTMENT, ROLE, EMPLOYEE, ETC.

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
    })
}

async function addRolePrompt() {
  try {
    const [departments] = await findAllDepartments();
    let deptsName = departments.map(depts => {
      return { name: depts[0], value: depts[1] }
    });
    const answer = await inquirer.prompt([
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
    ]);
    db.query(`INSERT INTO roles SET ?`,{
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department_id
      });
    console.log(`Success! ${answer.title} has been added to the database!`);
    queries.viewRoles();
  } catch (error) {
    console.log(error);
  }
}

async function addEmployeePrompt() {
  try {
    const [departments] = await findAllDepartments();
    let deptsName = departments.map(depts => {
      return { name: depts[0], value: depts[1] }
    });

    const [fullName] = await findAllManagers();
    let fname = fullName.map(employee => {
      return { name: `${employee[0]}`, value: employee[1] }
    });

    const [rolesList] = await findAllRoles();
    let roles = rolesList.map(role => {
      return { name: role[0], value: role[1] }
    });

    const answer = await inquirer.prompt([
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
        choices: roles
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Which manager will oversee this employee?',
        choices: fname
      }
    ])
    db.query(`INSERT INTO employee SET ?`,{
      first_name: answer.first_name,
      last_name: answer.last_name,
      role_id: answer.role_id,
      manager_id: answer.manager_id,
      });
    console.log(`Success! ${answer.first_name} ${answer.last_name} has been added 
    to the database!`);
    queries.viewAllData();
  } catch (error) {
    console.error(error);
  }
}

async function updateEmployeeRolePrompt() {
  try {
    const [fullName] = await findAllEmployees();
    let fname = fullName.map(employee => {
      return { name: `${employee[0]} ${employee[1]}`, value: employee[2] }
    });

    const [rolesList] = await findAllRoles();
    let roles = rolesList.map(role => {
      return { name: role[0], value: role[1] }
    });

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Which employee would you like to update?',
        choices: fname
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'What role would you like to assign to this employee?',
        choices: roles
      }
    ])
    db.query(`UPDATE employee SET role_id = ${answer.role_id} WHERE id = ${answer.employee_id}`);
    console.log(`Success! ${fname.name}'s role has been updated!`);
    queries.viewAllData();
  } catch (error) {
    console.log(error)
  } 
}

async function updateEmployeeManagerPrompt() {
  try {
    const [fullName] = await findAllEmployees();
    let fname = fullName.map(employee => {
      return { name: `${employee[0]} ${employee[1]}`, value: employee[2] }
    });

    const [managerName] = await findAllManagers();
    let mname = managerName.map(manager => {
      return { name: `${manager[0]}`, value: manager[1] }
    });

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: "Which employee would you like to update?",
        choices: fname
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Which manager would you like to assign to this employee?',
        choices: mname
      }
    ])
    db.query(`UPDATE employee SET manager_id = ${answer.manager_id} 
    WHERE id = ${answer.employee_id}`);
    console.log(`Success! ${fname.name}'s manager has been updated!`);
    queries.viewAllData();
  } catch (error) {
    console.log(error);
  }
}

async function deleteDepartmentPrompt() {
  try {
    const [departments] = await findAllDepartments();
    let deptsName = departments.map(depts => {
      return { name: depts[0], value: depts[1] }
    });

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Which department would you like to delete?',
        choices: deptsName
      }
    ]);
    db.query(`DELETE FROM department WHERE id = ${answer.department_id}`);
    console.log(`Success! ${answer.department_id} has been deleted from the database!`);
    queries.viewDepartments();
  } catch (error) {
    console.log(error);
  }
 }

async function deleteRolePrompt() { 
  try {
    const [rolesList] = await findAllRoles();
    let roles = rolesList.map(role => {
      return { name: role[0], value: role[1] }
    });
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'role_id',
        message: 'Which role would you like to delete?',
        choices: roles
      }
    ]);
    db.query(`DELETE FROM roles WHERE id = ${answer.role_id}`);
    console.log(`Success! ${answer.role_id} has been deleted from the database!`);
    queries.viewRoles();
  } catch (error) {
    console.log(error);
  }
}

async function deleteEmployeePrompt() { 
  try {
    const [fullName] = await findAllEmployees();
    let fname = fullName.map(employee => {
      return { name: `${employee[0]} ${employee[1]}`, value: employee[2] }
    });
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Which employee would you like to delete?',
        choices: fname
      }
    ]);
    db.query(`DELETE FROM employee WHERE id = ${answer.employee_id}`);
    console.log(`Success! ${answer.employee_id} has been deleted from the database!`);
    queries.viewAllData();
  } catch (error) {
    console.log(error);
  }
    
  }

async function viewEmployeesByManagerPrompt() { 
  try {
    const [managerIds] = await findAllManagers();
    let mname = managerIds.map(manager => {
      return {  name: `${manager[0]}`, value: manager[1] }
    });

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'manager_id',
        message: "Which manager's team would you like to view?",
        choices: mname
      }
    ]);
    // join employee and roles tables to get first_name, last_name, title, salary
    queries.viewEmployeesByManager(answer.manager_id);
  } catch (error) {
    console.log(error);
  }
}

async function viewEmployeesByDepartmentPrompt() { 
  try {
    const [departments] = await findAllDepartments();
    let deptsName = departments.map(depts => {
      return { name: depts[0], value: depts[1] }
    });
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: "Which department's team would you like to view?",
        choices: deptsName
      }
    ]);
    queries.viewEmployeesByDepartment(answer.department_id);
  } catch (error) {
    console.log(error);
  }
}

async function ascii() {
  return new Promise((resolve, reject) => {
    figlet('Employee Manager', (err, data) => {
      if (err) {
        reject(err);
      }
      console.log(`\n${data}\n`);
      resolve(data);
    });
  });
}

try {
  const print = await ascii();
} catch (err){
  console.log(err);
}
// CALL START OF APP

mainMenu();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});