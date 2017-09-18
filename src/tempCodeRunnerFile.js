const inquirer = require('inquirer');

inquirer.prompt([{
  name: 'name',
  message: 'page name',
  validate: function(name) {
      return /^\w[\w\-\.]*\w$/.test(name) ? true : 'name is not valid';
  }
}, {
  name: 'store',
  type: 'confirm',
  message: 'Generate store & actions?'
}]).then(function(answers){
  console.log(answers)
})