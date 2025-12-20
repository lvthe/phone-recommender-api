function computeMinMax(vectors) {
  if (!vectors || vectors.length === 0) throw new Error("vectors is empty");
  const m = vectors[0].length;
  const minVal = Array(m).fill(Number.POSITIVE_INFINITY);
  const maxVal = Array(m).fill(Number.NEGATIVE_INFINITY);
  for (const v of vectors) {
    if (v.length !== m) throw new Error("vector length mismatch");
    for (let j = 0; j < m; j++) {
      if (v[j] < minVal[j]) minVal[j] = v[j];
      if (v[j] > maxVal[j]) maxVal[j] = v[j];
    }
  }
  return { minVal, maxVal };
}

function minMaxNormalize(vec, minVal, maxVal) {
  const out = new Array(vec.length);
  for (let j = 0; j < vec.length; j++) {
    const min = minVal[j];
    const max = maxVal[j];
    out[j] = (max === min) ? 0 : (vec[j] - min) / (max - min);
  }
  return out;
}

function euclidDistance(a, b) {
  if (a.length !== b.length) throw new Error("distance vector length mismatch");
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

module.exports = { computeMinMax, minMaxNormalize, euclidDistance };
