var Q = require('q'),
	Validate = require('./help/validate'),
	Process = require('./help/process');

/**
 * Запуск модуля с проверкой и обработкой входящих данных
 * @type {exports}
 */
var Module = module.exports = function(options) {
	this.options = options;
};

Module.prototype.run = function(moduleName) {
	Q.all([
		Validate.exist(this.options.inputFile),
		Validate.isFile(this.options.inputFile),
		Validate.overwrite(this.options.outputFile)
	]).then(function(){
		var app = require('./modules/' + moduleName);
		new app({
			options: this.options,
			content: Process.readInputFile(this.options.inputFile),
			output: Process.openOutputFile(this.options.outputFile)
		});
	}.bind(this), function() {
		console.log('fail');
		process.exit(1);
	});
};