const axios = require('axios')
const express = require('express')
const app = express()

const PORT = 1337

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
