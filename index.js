const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');



const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'gigem281',
        database: 'companyDB',
    },
);

db.connect((err) => {
    if (err) throw err;
    console.log('Welcome to company_DB!');
    firstPrompt();
});

module.exports = db;

const firstPrompt = () => {
    inquirer
        .prompt([{
            type: 'list',
            message: 'Where would you like to start?',
            name: 'action',
            choices: [ `View all departments`, `View all roles`, `View all employees`, `Add a department`, `Add a role`, `Add an employee`, `Update employee role`, `Exit`],
        },])
        .then((userInput) => {
            switch (userInput.action) {
                case `View all departments`:
                    viewDepartments();
                    break;
                case `View all roles`:
                    viewRoles();
                    break;
                case `View all employees`:
                    viewEmployees();
                    break;
                case `Add a department`:
                    addDepartment();
                    break;
                case `Add a role`:
                    addRole();
                    break;
                case `Add an employee`:
                    addEmployee();
                    break;
                case `Update employee role`:
                    updateRole();
                    break;
                case `Exit`:
                    exitDB();
                    break;
            }
        });
};

const viewDepartments = () => {
    const query = `SELECT department.id, department.name AS Department FROM department ORDER BY department.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`View all departments`);
        console.table(res);
        firstPrompt();
    });
};

const viewRoles = () => {
    const query = `SELECT role.id, role.title AS Title, department.name AS Department, role.salary AS Salary
    FROM role LEFT JOIN department
    ON department.id = role.deparment_id
    ORDER BY role.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`View all roles`);
        console.table(res);
        firstPrompt();
    });
};

const viewEmployees = () => {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`View all employees`);
        console.table(res);
        firstPrompt();
    });
};

const addDepartment = () => {
    inquirer
        .prompt([{
            type: 'input',
            message: 'What would you like to name the department?',
            name: 'depName',
        },])
        .then((userInput) => {
            const query = `INSERT INTO department(name) VALUES (?)`;
            db.query(query, [userInput.depName], (err, res) => {
                if (err) throw err;
                console.log(``);
                console.log(`Added`);
                console.table(res);
                firstPrompt();
            });
        });
};

const addRole = () => {
    const querySelect = `SELECT * FROM department`;
    db.query(querySelect, (err, response) => {
        if (err) throw err;
        const depArray = response.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer
            .prompt([{
                type: 'input',
                message: 'What is the new role?',
                name: 'title',
            },
            {
                type: 'input',
                message: 'What is the salary?',
                name: 'salary',
            },
            {
                type: 'list',
                message: 'What is the department ID?',
                name: 'departmentID',
                choices: depArray,
            },])
            .then((userInput) => {
                const query = `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`;
                db.query(query, [userInput.title, userInput.salary, userInput.departmentID], (err, res) => {
                    if (err) throw err;
                    console.log(``);
                    console.log(`Added`),
                    console.table(res);
                    firstPrompt();
                })
            })
    })
};

const addEmployee = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        const roleArray = res.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        db.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;
            const manArray = res.map((manager) => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id,
            }));
            inquirer
            .prompt([{
                type: 'input',
                message: 'What is their first name?',
                name: 'firstName',
            },
            {
                type: 'input',
                message: 'What is their last name?',
                name: 'lastName',
            },
            {
                type: 'list',
                message: 'What is their role ID?',
                name: 'roleID',
                choices: roleArray,
            },
            {
                type: 'list',
                message: 'What is their manager ID?',
                name: 'managerID',
                choices: manArray,
            },
        ])
            .then((userInput) => {
                const query = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                db.query(query, [userInput.firstName, userInput.lastName, userInput.roleID, userInput.managerID],
                    (err, res) => {
                        if (err) throw err;
                        console.log(``);
                        console.log(`Added`);
                        console.table(res);
                        firstPrompt();
                    });
            });
        });
    });
};

const updateRole = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        const empArray = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        db.query(`SELECT * FROM role`, (err, res) => {
            if (err) throw err;
            const roleArray = res.map((role) => ({
                name: role.title,
                value: role.id,
            }));
            inquirer
                .prompt([{
                    type: 'list',
                    message: 'What is their ID?',
                    name: 'employeeID',
                    choices: empArray,
                },
                {
                    type: 'list',
                    message: 'What is the new role ID?',
                    name: 'roleID',
                    choices: roleArray,
                },
            ])
            .then((userInput) => {
                const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
                db.query(query, [userInput.roleID, userInput.employeeID], (err, res) => {
                    if (err) throw err;
                    console.log(``);
                    console.log(`Employee updated`);
                    console.table(res);
                    firstPrompt();
                });
            });
        });
    });
};

const exitDB = () => {
    console.log(``);
    console.log(`Exiting the Database`);
    process.exit();
};

module.exports = db;