/* eslint-disable no-param-reassign, no-mixed-operators, no-bitwise, no-plusplus */
export function createWaveGenerator(nOctaves, amp, freq) {
  const octaves = [];
  const bias = amp * -0.5;
  for (let i = 0; i < nOctaves; i++) {
    octaves.push({
      p: Math.random(),
      f: Math.random() * freq,
      a: amp,
    });
    freq *= 2;
    amp /= 2;
  }
  return (i) => {
    let res = 0;
    octaves.forEach((o) => {
      res += Math.sin(i * o.f + o.p) * o.a;
    });
    return res + bias;
  };
}


export function v3lerp(v1, v2, a) {
  const b = 1 - a;
  v1.x = v1.x * b + v2.x * a;
  v1.y = v1.y * b + v2.y * a;
  v1.z = v1.z * b + v2.z * a;
}

export function v2lerp(v1, v2, a) {
  const b = 1 - a;
  v1.x = v1.x * b + v2.x * a;
  v1.y = v1.y * b + v2.y * a;
}

export function flerp(v1, v2, a) {
  return (v1 * (1 - a) + v2 * a);
}

export function rand(a, b) {
  return (a + Math.random() * (b - a));
}

export function randint(a, b) {
  return 0 | (a + Math.random() * (b - a + 1));
}

export function birandint(a, b) {
  return randint(a, b) * (Math.random() < 0.5 ? -1 : 1);
}
