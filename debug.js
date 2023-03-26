import inquierer from 'inquirer';

const obj = [
    { id: 1, dept_name: 'Engineering' },
    { id: 2, dept_name: 'Finance' },
    { id: 3, dept_name: 'Legal' },
    { id: 4, dept_name: 'Sales' },
    { id: 5, dept_name: 'Human Resources' },
    { id: 6, dept_name: 'Marketing' },
];

const mainMenu = () => {
    inquierer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'View All Employees by Department', 
                'View All Employees by Manager', 
                'Add Employee', 'Remove Employee',
                'Update Employee Role', 'Update Employee Manager', 
                'View All Roles', 'Add Role', 
                'Remove Role', 
                'View All Departments', 
                'Add Department', 
                'Remove Department', 
                'Quit']
        }
    ])
    .then((answer) => {
        switch (answer.action) {
            case 'View All Employees':
                console.log('\n\n\n\nEmployees');
                mainMenu();
                break;
            case 'View All Employees by Department':
                console.table(obj);
                mainMenu();
                break;
            case 'Quit':
                quit();
                break;
        }
    }
    )
}

mainMenu();
