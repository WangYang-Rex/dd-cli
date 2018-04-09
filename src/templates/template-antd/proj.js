// prompt for proj
exports.prompts = [
  {
      name: 'name',
      message: 'Project name',
      default: path.basename(process.cwd()),
      validate: function(name) {
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
      validate: function(version) {
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
];

exports.filter = function(source, data) {
  if (!data.i18n) {
    return !/i18n/.test(source);
  }
};