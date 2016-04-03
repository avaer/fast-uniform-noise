(function() {
"use strict";

const Alea = require('alea');
const FastSimplexNoise = require('fast-simplex-noise');
const Histogram = require('./histogram');

const constants = require('./constants');
const SEED = constants.SEED;
const SAMPLE_SCALE = constants.SAMPLE_SCALE;
const SAMPLE_SIZE = constants.SAMPLE_SIZE;

function makeHistogram(octaves) {
  const rng = new Alea(SEED);
  const noise = new FastSimplexNoise({
    min: 0,
    max: 1,
    octaves: octaves,
    random: rng,
  });
  const sampler = () => rng() * SAMPLE_SCALE;
  const histogram = new Histogram();
  for (let i = 0; i < SAMPLE_SIZE; i++) {
    const x = sampler();
    const y = sampler();
    const v = noise.in2D(x, y);
    histogram.add(v);
  }
  histogram.normalize();
  const histogramJson = histogram.save();
  return histogramJson;
}

module.exports = makeHistogram;

})();
