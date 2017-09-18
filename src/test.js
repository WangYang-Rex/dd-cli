var glob = require('glob')
var path = require('path');
var fs = require('fs');
var ejs = require('ejs')
var mkdirp = require('mkdirp');


var sourceDir = path.join(__dirname, "templates/mod")
var targetDir = "";
var data = {
    Name: 'Test',
    name: "test",
    store: true
};
var filter;
console.log('\nStart to copy files ...\n');
var prompts = [];
var callback;
glob.sync('**', {
    cwd: sourceDir,
    nodir: true,
    dot: true
}).forEach(function(source){
    //过滤
    if(source.indexOf('node_modules')>-1 || source.indexOf('git')>-1){
        return
    }
    if(filter && !filter(source, data)) {
        return
    }
    console.log(source)

    // 真实文件路径
    var src = source;
    var dist = targetDir || process.cwd();
    src = src.replace(/__Name__/g, data.Name).replace(/__name__/g, data.name);
    var target = path.join(dist, src);

    //保证路径存在
    mkdirp.sync(path.dirname(target));

    //源文件路径
    var source = path.join(sourceDir, source);
    //读取文件
    try {
        // file exists, push to confirm list
        fs.statSync(target);
        console.log(target + ' 已经存在')

    } catch (e) {
        // file not exist, just write
        writeFile(source, target, data);
        // console.log("copy :", source, target, data)
    }
})