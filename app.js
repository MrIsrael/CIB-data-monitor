// Real time CIB value in COP calculation = ( CIB * (USD/COP) ) / 4
// Endpoint (GET): http://localhost:3500/api/data

let secondsSinceLastChange = 0, secondsSinceLastDataFetch = 0, lastValue = 0, showData = true
const interval = 1000                                             // value in milliseconds
const realTimeValue = document.getElementById('calculation')

// Time measurement
let timer = setInterval(() => {
  document.getElementById('last-value-change').innerHTML = 'Último cambio de valor hace: ' + 
      (secondsSinceLastChange >= 60 ? (parseInt(secondsSinceLastChange / 60) + 
      (secondsSinceLastChange >= 120 ? ' minutos, ' : ' minuto, ') + (secondsSinceLastChange % 60) + 
      (secondsSinceLastChange % 60 === 1 ? ' segundo' : ' segundos'))
      : (secondsSinceLastChange + (secondsSinceLastChange === 1 ? ' segundo' : ' segundos')))
  document.getElementById('last-data-fetch').innerHTML = 'Última consulta de datos hace: ' + 
      secondsSinceLastDataFetch + (secondsSinceLastDataFetch === 1 ? ' segundo' : ' segundos')
  secondsSinceLastChange++
  secondsSinceLastDataFetch++
}, interval)

// Button click handler
function hideShowInfo() {
  showData = !showData
  let className = showData ? 'show' : 'hidden'
  let buttonText = showData ? 'Ocultar información extra' : 'Mostrar información extra'
  document.getElementById('last-value-change').setAttribute('class', className)
  document.getElementById('last-data-fetch').setAttribute('class', className)
  document.getElementById('usd_cop').setAttribute('class', className)
  document.getElementById('nyse_cib').setAttribute('class', className)
  document.getElementById('endpoint').setAttribute('class', className)
  document.getElementById('btn').innerHTML = buttonText
}

// Get data from external API, constantly
const scrapeData = async () => {
  await fetch('http://localhost:3500/api/data/')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          const exchangeRate = parseInt(data[0].usd_cop)
          const stockValue = parseFloat(data[1].nyse_cib)
          const cibRealTime = ((stockValue * exchangeRate) / 4)

          // Si los datos se reciben correctamente, isNaN(cibRealTime) = false
          if ( !isNaN(cibRealTime) ) {

            if (cibRealTime !== lastValue) { 
              realTimeValue.setAttribute('class', (cibRealTime > lastValue ? 'bigger' : 'lower')) 
              secondsSinceLastChange = 0
            } else {
              realTimeValue.setAttribute('class', 'same') 
            }
  
            realTimeValue.innerHTML = '$' + parseInt(cibRealTime / 1000) + '.' + parseInt(cibRealTime % 1000)
            console.log('CIB en pesos anterior: ' + lastValue.toFixed(2))
            lastValue = cibRealTime

          // isNaN(cibRealTime) = true --> La API no devolvió algún dato en el formato requerido, o retornó null
          } else {
            realTimeValue.innerHTML = 'Recepción de dato no válido...'
          }

          document.getElementById('usd_cop').innerHTML = 'Último valor usd_cop consultado: COP$' + exchangeRate
          document.getElementById('nyse_cib').innerHTML = 'Último valor nyse_cib consultado: USD$' + stockValue
          secondsSinceLastDataFetch = 0          
        })
        .catch(err => {
          realTimeValue.innerHTML = 'Sin respuesta desde API. Está encendido CIB-data-provider?'
          console.log(err)
        })
  setTimeout(scrapeData, 1000)                                    // keep running API fetch function over and over, calling itself when done
}

scrapeData()
