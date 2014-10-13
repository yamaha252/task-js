#!/usr/bin/env node
'use strict';

var app = require('commander');
var prompt = require("promptly");
var fs = require("fs");
var Q = require('q');

var validate = {
	overwrite: function(path) {
		return Q.Promise(function(resolve, reject) {
			fs.exists(path, function(exist){
				if (exist) {
					prompt.confirm('File ' + path + ' is exist. Overwrite?', function (err, value) {
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
					console.log('File: ' + path + ' is not exist');
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
					console.log('Path: ' + path + ' not a file');
				}
				else resolve();
			});
		});
	}
};

app
	.command('analyze')
	.description('Analyze html file')
	.option('-i, --input-file <path>', 'Parse file path')
	.option('-o, --output-file [path]', 'Path for export dictionary file', './dictionary.json')
	.action(function(options){
		Q.all([
			validate.exist(options.inputFile),
			validate.isFile(options.inputFile),
			validate.overwrite(options.outputFile)
		]).then(function(){
			var module = require('modules/analyze.js');
			new module({
				'inputFile': options.inputFile,
				'outputFile': options.outputFile
			});
		}, function() {
			process.exit(1);
		});
	});

app
	.command('generate')
	.description('Generate new html file')
	.option('-d, --dictionary [path]', 'Dictionary file path', './dictionary.json')
	.option('-o, --output-file [path]', 'Path for export result file', './result.html')
	.action(function(options){
		Q.all([
			validate.exist(options.dictionary),
			validate.isFile(options.dictionary),
			validate.overwrite(options.outputFile)
		]).then(function(){
			var module = require('modules/generate.js');
			new module({
				'dictionary': options.dictionary,
				'outputFile': options.outputFile
			});
		}, function() {
			process.exit(1);
		});
	});

app.parse(process.argv);