function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function randomArrayItem(array) {
  return array[randomInteger(0, array.length)]
}

module.exports = randomArrayItem
