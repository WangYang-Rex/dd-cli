'use strict';
const program = require('commander');
const path = require('path');
const inquirer = require('inquirer');

const pkg = require('../package.json');
const util = require('./util')

//读取 ddConfig
var ddConfig;
try {
  ddConfig = require(path.join(process.cwd(), 'dd.json'));
} catch (e) {
}

// 处理 Init
var handleInit = function (type, template) {
  //读取对应 template 配置
  var templateDir = path.join(__dirname, 'templates', template);
  var templateUtil = require(templateDir);

  let prompts = templateUtil.prompt(type);
  if (!prompts) {
    console.log(`\n${type} is not known\n`);
    console.log(templateUtil.typeErrorMessage);
    return
  }
  inquirer.prompt(prompts).then(function (answers) {
    var sourceDir = path.join(templateDir, type);
    console.log('sourceDir', sourceDir);
    var targetDir = process.cwd();
    answers = templateUtil.answersFormat(answers)
    templateUtil.makeFiles(sourceDir, targetDir, answers, util.filter(type));
  });
}

// 注册command命令
program
  .allowUnknownOption()
  .version(pkg.version)

program
  .command('init <type>')
  .description('init proj/page/mod to generator proj/page/mod')
  .action(function (type, command) {
    console.log('\nWelcome to react project generator!\n');
    if (type == 'proj') {
      //选择模板类型  从对应模板中读取配置文件
      var prompts = util.prompt('template');
      inquirer.prompt(prompts).then(function (answers) {
        handleInit(type, answers.template);
      });
    } else {
      //获取dd.json, 读取对应的template
      if(ddConfig && ddConfig.template){
        handleInit(type, ddConfig.template);
      } else {
        console.log('dd.json is not exist! Please use `dd init proj` to generator project');
      }
    }
  })

program
  .parse(process.argv);

