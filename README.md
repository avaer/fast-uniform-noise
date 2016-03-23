Simplex noise scaled to a uniform distribution.

Based on https://github.com/joshforisha/fast-simplex-noise-js. Scales that algorithm via a pre-sampled histogram to generate noise with the same properties, only scaled to return values from a roughly uniform distribution.

```
const fastUniformNoise = require('fast-uniform-noise');
const noiser = new fastUniformNoise({
  // takes the same options as fast-simplex-noise
  random: Math.random
});
noiser.in2D(100, 100); // the only function currently supported
```
