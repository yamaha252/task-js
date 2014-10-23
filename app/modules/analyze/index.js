var cheerio  = require('cheerio'),
	string  = require('string');

/**
 * Згруженный в cheerio контент
 */
var $;

/**
 * Анализ большого файла и составление словаря
 * @type {exports}
 */
var Analyze = module.exports = function(params) {
	var content = params.content,
		output = params.output;

	$ = cheerio.load(content);

	var CommentsAnalyze = new Comments;
	var ArticlesContent = new Content;
	var CommentsContent = new Content;

	$('article').each(function(n, article){
		article = $(article);
		var comments = article.find('.comments');
		CommentsAnalyze.process(comments);
		CommentsContent.process(comments);
		comments.remove();

		ArticlesContent.process(article);
	});

	var result = {
		comments: {
			counts: {
				count: CommentsAnalyze.mediumCount(),
				lines: CommentsContent.countLines(),
				sentences: CommentsContent.countSentences(),
				words: CommentsContent.countWords()
			},
			authors: CommentsAnalyze.authors,
			words: CommentsContent.words,
			map: {

			}
		},
		articles: {
			counts: {
				lines: ArticlesContent.countLines(),
				sentences: ArticlesContent.countSentences(),
				words: ArticlesContent.countWords()
			},
			words: ArticlesContent.words,
			map: {

			}
		}
	};

	console.log(result);
};

var Comments = function() {
	this.counts = [];
	this.authors = [];
};

Comments.prototype = {
	processCount: function (data) {
		this.counts.push(data.find('.comment').length);
		this.mediumCount();
	},

	processAuthor: function (data) {
		data.find('.username').each(function (n, author) {
			this.authors.push($(author).text());
		}.bind(this));
	},

	process: function (data) {
		this.processCount(data);
		this.processAuthor(data);
	},

	mediumCount: function () {
		return mediumCount(this.counts);
	}
};


var Content = function() {
	this.countsLines = [];
	this.countsSentences = [];
	this.countsWords = [];
	this.words = [];
};

Content.prototype = {
	process: function(data) {
		var process = new Text(data);
		this.countsLines.push(process.countLines);
		this.countsSentences = this.countsSentences.concat(process.countsSentences);
		this.countsWords = this.countsWords.concat(process.countsWords);
		this.words = this.words.concat(process.words);
	},

	countLines: function() {
		return mediumCount(this.countsLines);
	},

	countWords: function() {
		return mediumCount(this.countsWords);
	},

	countSentences: function() {
		return mediumCount(this.countsSentences);
	}
};


var Text = function(data) {
	this.countLines = 0;
	this.countsSentences = [];
	this.countsWords = [];
	this.words = [];
	this.content = this.prepare(data.text());
};

Text.prototype = {
	divideIntoLines: function(data) {
		data = string(data).stripTags().s;
		data = string(data).lines();
		return arrayClean(data);
	},

	divideIntoSentences: function(string) {
		var reg = /(.{2,}?(\.|\?|!|$))(\s|$)/g,
			matches = [],
			found;
		while (found = reg.exec(string)) {
			matches.push(found[1]);
		}
		return arrayClean(matches);
	},

	divideIntoWords: function(data) {
		data = data.replace(/(\(|\))/g, '');
		return arrayClean(data.split(/(\s|\.|\,|\:|\?|\!|$)/));
	},

	prepare: function(data) {

		data = this.divideIntoLines(data);
		this.countLines = data.length;

		//TODO: Странная конструкция, переделать
		data = data.map(function(line){
			var sentences = this.divideIntoSentences(line);
			this.countsSentences.push(sentences.length);

			sentences = sentences.map(function(line){
				var words = this.divideIntoWords(line);
				this.countsWords.push(words.length);

				words = words.map(function(word) {
					word = string(word.toLowerCase()).trim().s;
					this.words.push(word);
					return word;
				}.bind(this));

				return words;
			}.bind(this));

			return sentences;
		}.bind(this));

		return data;
	}
};


/**
 * Очистка массива от пустых строк и тримиинг
 * @param {array} data
 * @returns {array}
 */
function arrayClean(data) {
	data = data.filter(function(str) {
		return !string(str).isEmpty();
	});

	data = data.map(function(str) {
		return string(str).trim().s;
	});

	return data;
}

/**
 * Отдаёт среднее количество на основе всех чисел в массиве
 * @param {array} counts
 * @returns {number}
 */
function mediumCount(counts) {
	if (!counts.length)
		return 0;

	var summary = counts.reduce(function(result, count) {
		return Number(result) + Number(count);
	});

	return Math.round(summary / counts.length);
}