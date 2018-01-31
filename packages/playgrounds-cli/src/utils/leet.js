function leet(input) {
  return input
    .replace(/l|i/g, '1')
    .replace(/z/g, '2')
    .replace(/e/g, '3')
    .replace(/a/g, '4')
    .replace(/s/g, '5')
    .replace(/G/g, '6')
    .replace(/t/g, '7')
    .replace(/b/g, '8')
    .replace(/g/g, '9')
    .replace(/o/g, '0')
}

module.exports = leet
