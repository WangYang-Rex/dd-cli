var glob = require('glob')
var path = require('path');
var fs = require('fs');
var ejs = require('ejs')
var mkdirp = require('mkdirp');

var util = {
	typeErrorMessage: `\nplease use proj/page/mod \n`,
	// 复制文件
	makeFiles: function (sourceDir, targetDir, data, filter) {
		console.log('\nStart to copy files ...\n')
		glob.sync('**', {
			cwd: sourceDir,
			nodir: true,
			dot: true
		}).forEach(function (source) {
			//过滤
			if (filter && !filter(source, data)) {
				return
			}
			// console.log(source)

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
			}
		})
	},
	checkInitType: function(type){
		let types = []
		if(!type || types.indexOf(type)<0){
			console.log(`\n${type} is not known, please use ${types.join('/')}\n`);
			return false;
		}
	},
	//inquirer
	prompt: function (type) {
		if (type == 'mod') {
			return [
				{
					name: 'name',
					message: 'mod name',
					validate: function (name) {
						return /^\w[\w\-\.]*\w$/.test(name) ? true : 'name is not valid';
					}
				}
			]
		} else if (type == 'page') {
			return [
				{
					name: 'name',
					message: 'page name',
					validate: function (name) {
						return /^\w[\w\-\.]*\w$/.test(name) ? true : 'name is not valid';
					}
				}
			]
		} else if (type == 'template') {
			return [{
        type: 'list',
        name: 'template',
        message: 'What template do you need?',
        choices: [
					'react-redux-antd',
					'react-redux-antd-mobile',
					'react-reflux'
				],
        filter: function (val) {
          return val.toLowerCase();
        }
      }]
		} else if (type == 'proj') {
			return [
				{
					name: 'name',
					message: 'Project name',
					default: path.basename(process.cwd()),
					validate: function (name) {
						return /^\w[\w\-]*\w$/.test(name) ? true : 'name is not valid';
					}
				}, {
					name: 'description',
					message: 'Project description',
					default: 'An awesome project'
				}, {
					name: 'author',
					message: 'Author name',
					default: process.env['USER'] || process.env['USERNAME'] || ''
				}, {
					name: 'version',
					message: 'Project version',
					default: '1.0.0',
					validate: function (version) {
						return /^\d+\.\d+\.\d+([\.\-\w])*$/.test(version) ? true : 'version is not valid';
					}
				}, {
					name: 'repository',
					message: 'Project repository',
					default: ''
				}, {
					name: 'npm',
					message: 'Npm registry',
					default: 'https://registry.npm.taobao.org'
				}
			]
		}
	},
	//过滤器
	filter: function (type) {
		if (type == 'page') {
			return function (source, data) {
				if (!data.store) {
					return !/(actions|store)\.js$/.test(source);
				}
				return true
			};
		}
	},
	//对inquirer的结果进行转换
	answersFormat: function (answers) {
		answers.name = answers.name.toLowerCase();
		answers.Name = answers.name.replace(/[\W_]+(.)/g, function (p, p1) {
			return p1.toUpperCase();
		}).replace(/^./, function (p) {
			return p.toUpperCase();
		});
		return answers;
	}
}

// 写文件，把目标文件写入指定目录
function writeFile(source, target, data) {
	try {
		console.log('Generate file ' + path.relative(process.cwd(), target));
		var tpl = fs.readFileSync(source);
		var content;
		try {
			content = ejs.render(tpl.toString(), data);
		} catch (e) {
			content = tpl;
		}
		fs.writeFileSync(target, content);
	} catch (e) {
		console.error(e);
	}
}

module.exports = util;