const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const Choice = require('inquirer/lib/objects/choice');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'zoWM8Amj63JW!',
    database: 'employee_db'
});

const mainPrompt = () => {
    inquirer.prompt({
        type: 'list',
        message: 'choose an action',
        name: 'mainAnswer',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update employee role', 'Quit']
    }).then(({
        mainAnswer
    }) => {
        switch (mainAnswer) {
            case 'View all departments':
                connection.query('SELECT * FROM departments', (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(res);
                        mainPrompt();
                    }
                })
                break;
            case 'View all roles':
                connection.query(`SELECT roles.id, roles.title, roles.salary, departments.name AS department
                FROM roles 
                LEFT JOIN departments ON roles.department_id = departments.id`, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(res);
                        mainPrompt();
                    }
                })
                break;
            case 'View all employees':
                connection.query(`SELECT employees.id, employees.first_name, employees.last_name, 
                roles.title, roles.salary, departments.name AS department, CONCAT(e.first_name, ' ',  e.last_name) AS manager
                FROM employees 
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees AS e ON employees.manager_id = e.id;`, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.table(res);
                        mainPrompt();
                    }
                })
                break;
            case 'Add department':
                inquirer.prompt({
                    type: 'input',
                    name: 'depName',
                    message: 'Enter new department name: ',
                    validate: depName => {
                        if (depName) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(depName => {
                    department = depName.depName;
                    const sql = `INSERT INTO departments (name)
                                 VALUES (?)`;
                    const param = [department];
                    connection.query(sql, param, function (err, res) {
                        if (err) {
                            throw err;
                            }
                        mainPrompt();
                    })
                });
                break;
            case 'Add role':
                break;
            case 'Add employee':
                break;
            case 'Update employee role':
                break;
            case 'Quit':
                console.log("Thank you!");
                connection.end();
                break;
        }
    })
};

mainPrompt();