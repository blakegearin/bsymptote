export default function SeedRand(seed) {
  Math.seed = function (s) {
    return function () {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

  return Math.seed(seed);
}
