'use strict';
const program = require('commander');
const path = require('path');
const inquirer = require('inquirer');
const templates = [
  'react-redux-antd',
  'react-redux-antd-mobile',
  'react-reflux'
]
var questions = [{
  type: 'list',
  name: 'template',
  message: 'What template do you need?',
  choices: templates,
  filter: function (val) {
    return val.toLowerCase();
  }
}]
inquirer.prompt(questions).then(function (answers) {
  console.log(answers)
});