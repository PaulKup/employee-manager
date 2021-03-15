const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');

inquirer.prompt({
    type: 'list',
    message: 'choose an action',
    name: 'mainAnswer',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add role', 'Add employee', 'Update employee role']
}).then(({
    mainAnswer
}) => {
    switch (mainAnswer) {
        case 'View all departments':
            break;
        case 'View all roles':
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
    }
});