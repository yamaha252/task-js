#!/usr/bin/env node
'use strict';

var app = require('commander'),
	Module = require('./app');

app
	.command('analyze')
	.description('Analyze html file')
	.option('-i, --input-file <path>', 'Parse file path')
	.option('-o, --output-file [path]', 'Path for export dictionary file', './dictionary.json')
	.action(function(options){
		new Module(options).run('analyze');
	});

app
	.command('generate')
	.description('Generate new html file')
	.option('-d, --input-file [path]', 'Dictionary file path', './dictionary.json')
	.option('-o, --output-file [path]', 'Path for export result file', './result.html')
	.action(function(options){
		new Module(options).run('generate');
	});

app.parse(process.argv);