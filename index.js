(function() {
"use strict";

const Alea = require('alea');
const FastSimplexNoise = require('fast-simplex-noise');
const Histogram = require('./src/histogram');

const constants = require('./src/constants');
const MIN_PRECOMPUTED_OCTAVES = constants.MIN_PRECOMPUTED_OCTAVES;
const MAX_PRECOMPUTED_OCTAVES = constants.MAX_PRECOMPUTED_OCTAVES;

const PRECOMPUTED_HISTOGRAMS = require('./precomputed/histograms.json');

function _getScaler(octaves) {
  if (octaves >= MIN_PRECOMPUTED_OCTAVES && octaves <= MAX_PRECOMPUTED_OCTAVES) {
    const histogramJson = PRECOMPUTED_HISTOGRAMS[octaves];
    const histogram = Histogram.load(histogramJson);
    const scaler = histogram.makeScaler();
    return scaler;
  } else {
    throw new Error('octaves must be in (' + MIN_PRECOMPUTED_OCTAVES + ',' + MAX_PRECOMPUTED_OCTAVES + ')');
  }
}

function FastUniformNoise(opts) {
  opts = opts || {};
  opts.min = opts.min || 0;
  opts.max = opts.max || 1;
  opts.frequency = opts.frequency || 1;
  opts.octaves = opts.octaves || 1;
  opts.random = opts.random || new Alea('');

  // console.log('uniform noise', opts);

  this._min = opts.min;
  this._max = opts.max;
  this._noise = new FastSimplexNoise({
    min: 0,
    max: 1,
    frequency: opts.frequency,
    octaves: opts.octaves,
    random: opts.random,
  });
  this._scaler = _getScaler(opts.octaves);
}
FastUniformNoise.prototype = {
  in2D: function(x, y) {
    const v = this._noise.in2D(x, y);
    const scaledV = this._scaler(v);
    const offsetV = this._min + (scaledV * (this._max - this._min));
    return offsetV;
  }
};

module.exports = FastUniformNoise;

})();
