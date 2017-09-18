'use strict';
const program = require('commander');
const path = require('path');
const inquirer = require('inquirer');

const pkg = require('../package.json');
const util = require('./util')

program
  .allowUnknownOption()
  .version(pkg.version)

program
  .command('init <type>')
  .description('init proj/page/mod to generator proj/page/mod')
  .action(function(type, command) {
    console.log('\nWelcome to react-reflux ' + type + ' generator!\n');
    let prompts = util.prompt(type);
    if(!prompts){
      console.log(`\n${type} is not known, please use proj/page/mod\n`);
      return
    }
    inquirer.prompt(prompts).then(function (answers) {
        var sourceDir = path.join(__dirname, 'templates', type);
        var targetDir = process.cwd();
        answers = util.answersFormat(answers)
        util.makeFiles(sourceDir, targetDir, answers, util.filter(type));
    });
  })

program
  .parse(process.argv);


