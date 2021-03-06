var assert = require('assert');

var localStorage = {};

var LSget = function(key) {
	var value = localStorage[key];
	if (value === null || value === undefined) {
		return undefined;
	}
	try { return JSON.parse(value); } catch (e) { return null; }
};

var handleChinese = function(given, correct) {
	var TONE_REGEX = /(\d)\b/g;
	var tones = function(str) {
		return str.match(TONE_REGEX);
	};

	var correctTones = tones(correct);
	if (correctTones) {
		if (LSget('forgive-typos-pinyin-disable') === true) {
			return true;
		}

		var givenTones = tones(given);
		if (givenTones.join() !== correctTones.join()) {
			// If tones don't match; skip typo check, i.e. typo check
			// should only apply for the pinyin
			return true;
		}
	}

	return false;
};

assert(handleChinese('zhu1', 'zhu2'));
assert(!handleChinese('zhu2', 'zhu2'));

localStorage['forgive-typos-pinyin-disable'] = true;

assert(handleChinese('zhu2', 'zhu2'));

var handleFrench = function(given, correct) {
	var ARTICLES = [ 'le', 'la', 'les', 'un', 'une', 'des' ];
	var regex    = new RegExp('\\b(' + ARTICLES.join('|') + ')\\b', 'gi');
	var article  = function(str) {
		var m = str.match(regex);
		return m && m[0];
	};

	var givenArticle   = article(given);
	var correctArticle = article(correct);
	if (correctArticle && correctArticle !== givenArticle) {
		return true;
	}

	return false;
};

assert(handleFrench('un oiseau', 'une oiseau'));

assert(!handleFrench('une oiseau', 'une oiseau'));
assert(!handleFrench('une oiseai', 'une oiseau'));
assert(!handleFrench('uneoiseau', 'uneoiseau'));
assert(!handleFrench('uneoiseau', 'uneoiseau'));
