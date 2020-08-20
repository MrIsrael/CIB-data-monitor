// Real time CIB value in COP calculation = ( CIB * (USD/COP) ) / 4
// GET call: http://localhost:3500/api/data

let secondsSinceLastChange = 0, secondsSinceLastDataFetch = 0, lastValue = 0, showData = true
const interval = 1000                                             // value in milliseconds
const realTimeValue = document.getElementById('calculation')

// Time since last sucessful data fetch
let timer = setInterval(() => {
  document.getElementById('last-value-change').innerHTML = 'Último cambio de valor hace: ' + 
      (secondsSinceLastChange >= 60 ? (Math.floor(secondsSinceLastChange / 60) + ' minutos, ' + (secondsSinceLastChange % 60) + ' segundos')
      : secondsSinceLastChange + ' segundos')
  document.getElementById('last-data-fetch').innerHTML = 'Última consulta de datos hace: ' + secondsSinceLastDataFetch + ' segundos'
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

// Get data from external API
const scrapeData = async () => {
  await fetch('http://localhost:3500/api/data/')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          const exchangeRate = parseInt(data[0].usd_cop)
          const stockValue = parseFloat(data[1].nyse_cib)
          const cibRealTime = ((stockValue * exchangeRate) / 4)

          if (cibRealTime !== lastValue) { 
            realTimeValue.setAttribute('class', (cibRealTime > lastValue ? 'bigger' : 'lower')) 
            secondsSinceLastChange = 0
          } else {
            realTimeValue.setAttribute('class', 'same') 
          }

          realTimeValue.innerHTML = '$' + parseInt(cibRealTime / 1000) + '.' + parseInt(cibRealTime % 1000)
          secondsSinceLastDataFetch = 0
          document.getElementById('usd_cop').innerHTML = 'Último valor usd_cop consultado: COP$' + exchangeRate
          document.getElementById('nyse_cib').innerHTML = 'Último valor nyse_cib consultado: USD$' + stockValue

          console.log('CIB en pesos anterior: ' + lastValue.toFixed(2))
          lastValue = cibRealTime
        })
        .catch(err => console.log(err))
  setTimeout(scrapeData, 1000)                                  // keep running API fetch function over and over, calling itself when done
}

scrapeData()
