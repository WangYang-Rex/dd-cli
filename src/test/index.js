'use strict';
var glob = require('glob')
var path = require('path');
let sourceDir = path.join(__dirname, '../templates', 'page')
let arr = glob.sync('**', {
    cwd: sourceDir,
    nodir: true,
    dot: true
})
console.log(sourceDir, arr)
console.log(process.cwd())


const program = require('commander');

program
    .allowUnknownOption()
    .version('v1.1.1')
    .option('init <type>, init proj/page/mod', 'generator proj/page/mod')
    .parse(process.argv);

program
    .command('init <type>')
    .description('init proj/page/mod to generator proj/page/mod')
    .action(function(type, command) {
        console.log(type, command)
    })