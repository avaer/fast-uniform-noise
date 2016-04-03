(function() {
"use strict";

const constants = require('./constants');
const BUCKETS = constants.BUCKETS;

function Histogram() {
  this._buckets = (() => {
    const buckets = Array(BUCKETS);
    for (let i = 0, l = buckets.length; i < l; i++) {
      buckets[i] = 0;
    }
    return buckets;
  })();
}
Histogram.prototype = {
  getBucket: function(v) {
    return v * this._buckets.length;
  },
  getBucketIndex: function(v) {
    return Math.floor(this.getBucket(v));
  },
  getBucketResidual: function(v) {
    return this.getBucket(v) % 1;
  },
  add: function(v) {
    const bucketIndex = this.getBucketIndex(v);
    this._buckets[bucketIndex]++;
  },
  total: function() {
    let result = 0;
    for (let i = 0, l = this._buckets.length; i < l; i++) {
      const bucketValue = this._buckets[i];
      result += bucketValue;
    }
    return result;
  },
  normalize: function() {
    const total = this.total();
    this._buckets = this._buckets.map(bucketValue => bucketValue / total);
  },
  makeScaler: function() {
    const cumulativeBuckets = (() => {
      let acc = 0;
      return this._buckets.map(bucketValue => {
        const result = acc;
        acc += bucketValue;
        return result;
      });
    })();
    const cdf = v => {
      const bucketIndex = this.getBucketIndex(v);
      const left = cumulativeBuckets[bucketIndex];
      const right = (bucketIndex < (cumulativeBuckets.length - 1)) ? cumulativeBuckets[bucketIndex + 1] : 1;
      const bucketResidual = this.getBucketResidual(v);
      return left + (bucketResidual * (right - left));
    };
    return cdf;
  },
  save: function() {
    return this._buckets;
  },
};
Histogram.load = histogramJson => {
  const histogram = new Histogram();
  histogram._buckets = histogramJson;
  return histogram;
};

module.exports = Histogram;

})();
