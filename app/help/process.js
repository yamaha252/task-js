var fs = require("fs"),
	util = require('util');

/**
 * Обработка файлов
 */
var Process = module.exports = {
	/**
	 * Читает входящий файл
	 * @returns {*}
	 */
	readInputFile: function(file) {
		try {
			return fs.readFileSync(file);
		} catch (err) {
			util.error(err.toString());
			process.exit(1);
		}
	},
	/**
	 * Создаёт и открывает исходящий файл
	 * @returns {*}
	 */
	openOutputFile: function(file) {
		try {
			return fs.openSync(file, 'w+');
		} catch (err) {
			util.error(err.toString());
			process.exit(1);
		}
	}
};