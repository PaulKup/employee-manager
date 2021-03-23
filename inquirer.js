const inquirer = require('inquirer');
const mysql = require('mysql2');

const Choice = require('inquirer/lib/objects/choice');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'zoWM8Amj63JW!',
    database: 'employee_db',
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
                            console.log('SUCCESS!');
                            mainPrompt();
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
                break;
            case 'Add role':
                inquirer.prompt([{
                            type: 'input',
                            name: 'roleName',
                            message: 'Enter new role name: ',
                            validate: roleName => {
                                if (roleName && (typeof (roleName) == 'string')) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'roleSalary',
                            message: 'Enter new role salary: ',
                            validate: roleSalary => {
                                if (roleSalary) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'roleDep',
                            message: 'Enter department id: ',
                            validate: roleDep => {
                                if (roleDep && (typeof (roleDep) == 'string')) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    ]).then(roleInfo => {
                        const sql = `INSERT INTO roles (title, salary, department_id) 
                                 VALUES (?,?,?)`;
                        const param = [roleInfo.roleName, roleInfo.roleSalary, roleInfo.roleDep];
                        connection.query(sql, param, function (err, res) {
                            if (err) {
                                throw err;
                            }
                            console.log('SUCCESS!');
                            mainPrompt();
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
                break;
            case 'Add employee':
                inquirer.prompt([{
                            type: 'input',
                            name: 'Fname',
                            message: "Enter employee's first name: ",
                            validate: Fname => {
                                if (Fname) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'Lname',
                            message: "Enter employee's last name: ",
                            validate: Lname => {
                                if (Lname) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'roleID',
                            message: "Enter role id: ",
                            validate: Lname => {
                                if (Lname) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'manager',
                            message: "Enter manager's first and last names: "
                        }
                    ]).then(employeeInfo => {
                        const managerParams = employeeInfo.manager.split(" ");
                        const manSql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`;
                        connection.query(manSql, managerParams, (err, res) => {
                            if (err) {
                                console.log(err);
                            }
                            const managerID = res[0].id;
                            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                 VALUES (?,?,?,?)`;
                            const params = [employeeInfo.Fname, employeeInfo.Lname, employeeInfo.roleID, managerID];
                            connection.query(sql, params, function (err, res) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(employeeInfo.Fname + ' ' + employeeInfo.Lname + "'s id: " + res.insertId);
                                    mainPrompt();
                                }
                            })
                        });

                    })
                    .catch(err => {
                        console.log(err);
                    });
                break;
            case 'Update employee role':
                connection.query(`SELECT employees.first_name, employees.last_name FROM employees`, (err, employees) => {
                    if (err) throw err;
                    console.log(employees);
                    const employeeArr = [];
                    for (let i = 0; i < employees.length; i++) {
                        employeeArr.push(employees[i].first_name + ' ' + employees[i].last_name);
                    }

                    inquirer.prompt([{
                                type: 'list',
                                name: 'employee',
                                message: "Which employee's role would you like to update?",
                                choices: employeeArr
                            },
                            {
                                type: 'input',
                                name: 'role',
                                message: "What is their new role?",
                                validate: role => {
                                    if (role) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        ])
                        .then(updateInfo => {
                            const sql = `SELECT roles.id FROM roles WHERE roles.title = ?`;
                            const param = [updateInfo.role];
                            const [Fname, Lname] = updateInfo.employee.split(" ");
                            connection.query(sql, param, (err, roleIDObj) => {
                                if (err) throw err;
                                connection.query(
                                    `UPDATE employees SET ? WHERE ? AND ?`,
                                    [
                                        {
                                            role_id: roleIDObj[0].id
                                        },
                                        {
                                            first_name: Fname
                                        },
                                        {
                                            last_name: Lname
                                        }
                                    ],
                                    (err, res) => {
                                        if (err) throw err;
                                        console.log('SUCCESS!');
                                        mainPrompt();
                                    }
                                )
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
                break;
            case 'Quit':
                console.log("Thank you!");
                connection.end();
                break;
        }
    })
};

mainPrompt();