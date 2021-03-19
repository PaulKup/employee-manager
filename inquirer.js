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
                break;
            case 'Add department':
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