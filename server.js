const express = require('express')

const app = express()
app.use(express.static('public'))

app.get('/getJson', (req,res) => {
  const data = require('./result.json')

  res.json(data)
})
app.listen(3000,() => {
  console.log('http://localhost:3000')
})