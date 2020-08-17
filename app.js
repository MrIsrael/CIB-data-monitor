// Cálculo CIB en pesos en tiempo real = ( CIB * (USD/COP) ) / 4
const interval = 1000                             // valor en milisegundos
let timeSinceLastChange = 0, lastValue = 0

let timer = setInterval(() => {
  let random_val = ((Math.random() * 3600) + 1)

  if (random_val !== lastValue && random_val > 2500) {
    document.getElementById('calculation').setAttribute('class', (random_val > lastValue ? 'bigger' : 'lower'))
    document.getElementById('calculation').innerHTML = '$' + random_val.toFixed(2)
    console.log('Nuevo: ' + random_val.toFixed(2) + ', Anterior: ' + lastValue.toFixed(2) + (random_val > lastValue ? ', NUEVO ES MAYOR, VERDE' : ', NUEVO ES MENOR, ROJO'))
    timeSinceLastChange = 0
    lastValue = random_val
  }

  console.log('Nuevo: ' + random_val.toFixed(2))
  document.getElementById('last-value-change').innerHTML = 'Último cambio de valor hace: ' + timeSinceLastChange + ' segundos'
  timeSinceLastChange++
}, interval)
