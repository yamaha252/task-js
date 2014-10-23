var prompt = require("promptly"),
	fs = require("fs"),
	Q = require('q'),
	util = require('util');

/**
 * Валидация входящих данных
 */
var Validate = module.exports = {
	overwrite: function(path) {
		return Q.Promise(function(resolve, reject) {
			fs.exists(path, function(exist){
				if (exist) {
					prompt.confirm('File ' + path + ' is exist. Overwrite? (yes|no) [no]', function (err, value) {
						if (!value) reject();
						else resolve();
					});
				}
				else resolve();
			});
		});
	},
	exist: function(path) {
		return Q.Promise(function(resolve, reject) {
			fs.exists(path, function(exist){
				if (!exist) {
					reject();
					util.error('File: ' + path + ' is not exist');
				}
				else resolve();
			});
		});
	},
	isFile: function(path) {
		return Q.Promise(function(resolve, reject) {
			fs.stat(path, function(err, stats){
				if (!stats.isFile()) {
					reject();
					util.error('Path: ' + path + ' not a file');
				}
				else resolve();
			});
		});
	}
};