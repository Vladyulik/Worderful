'use strict';

const fs = require('fs');

const wordMap = new Map();
const dictionaryData = fs.readFileSync('AllEnglishWords.txt', 'utf8');
const dictionary = dictionaryData.split('\n').map((word) => word.trim());
for (const word of dictionary) {
  wordMap.set(word, null);
}

module.exports = wordMap;
