// prompt for page
exports.prompts = [
  {
    name: 'name',
    message: 'mod name',
    validate: function(name) {
        return /^\w[\w\-\.]*\w$/.test(name) ? true : 'name is not valid';
    }
  },
  {
    name: 'store',
    type: 'confirm',
    message: 'Generate reducer & action & saga?'
  }
];

// filter out files
exports.filter = function(source, data) {
  if (!data.store) {
    return !/(action|reducer|saga)\.js$/.test(source);
  }
};