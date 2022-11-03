const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localHost',
        user: 'root',
        password: 'gigem281',
        database: 'companyDB',
    }
);

db.connect((err) => {
    if (err) throw err;
    console.log('Welcome to `company_db');
    firstPrompt();
});

const firstPrompt = () => {
    inquirer
        .prompt([{
            type: 'list',
            message: 'Where would you like to start?',
            name: 'action',
            choices: [ `View all departments`, `View all roles`, `View all employees`, `Add a department`, `Add a role`, `Add an employee`, `Update employee role`],
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
    FROM role LEFT JOIN department ON department.id = role.deparment_id
    ORDER BY role.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.log(``);
        console.log(`View all roles`);
        console.table(res);
        firstPrompt();
    });
};