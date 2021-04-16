//función que devuelve el palindromo de un texto
const palindrome = (string) => {
    if(typeof string === 'undefined') return undefined
    return string.split('').reverse().join('')
}

//función que calcula el promedio de un array de números
const average = (array) => {
    if(array.length === 0) return 0
    let sum = 0
    array.forEach(num => sum += num)
    return sum/array.length
}

module.exports = {
    palindrome,
    average
}