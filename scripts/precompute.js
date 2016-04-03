(function() {
"use strict";

const path = require('path');
const fs = require('fs');

const Alea = require('alea');
const FastSimplexNoise = require('fast-simplex-noise');
const Histogram = require('../src/histogram');
const makeHistogram = require('../src/make-histogram');
const mkdirp = require('mkdirp');

const constants = require('../src/constants');
const MIN_PRECOMPUTED_OCTAVES = constants.MIN_PRECOMPUTED_OCTAVES;
const MAX_PRECOMPUTED_OCTAVES = constants.MAX_PRECOMPUTED_OCTAVES;

const precomputedDirectory = path.join(__dirname, '..', 'precomputed');
mkdirp(precomputedDirectory, (err, cb) => {
  if (!err) {
    const result = {};
    for (let i = MIN_PRECOMPUTED_OCTAVES; i <= MAX_PRECOMPUTED_OCTAVES; i++) {
      console.log('octave ' + i);
      result[i] = makeHistogram(i);
    }
    const resultJson = JSON.stringify(result, null, 2);
    const histogramsJsonFile = path.join(precomputedDirectory, 'histograms.json');
    fs.writeFile(histogramsJsonFile, resultJson, 'utf8', err => {
      if (err) {
        console.warn(err);
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  } else {
    console.warn(err);
    process.exit(1);
  }
});

})();
