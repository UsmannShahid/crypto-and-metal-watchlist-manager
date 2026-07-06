import express from 'express'
import fs from 'fs'

const app = express()

const PORT = 8000

app.use(express.static('public'))

app.get('/api/assets', (req, res) => {
  const rawData = fs.readFileSync('./data/watchlist.json', 'utf-8')
  const watchlist = JSON.parse(rawData)

  const { category } = req.query

  let filteredAssets = watchlist
  
  if (category) {
    filteredAssets = filteredAssets.filter(asset => asset.category.toLowerCase() === category.toLowerCase())
  }

  res.json(filteredAssets)
})

app.get('/api/assets/:id', (req, res) => {
  const rawData = fs.readFileSync('./data/watchlist.json', 'utf-8')
  const watchlist = JSON.parse(rawData)

  const assetId = Number(req.params.id)

  const findAsset = watchlist.find(asset => asset.id === assetId)

  if (!findAsset) {
    return res.status(404).json({ error: `Asset with ID ${req.params.id} not found.`})
  }

  res.json(findAsset)

})

app.use(express.json())

app.post('/api/assets', (req, res) => {

  const { name, symbol, category, price } = req.body

  if (!name || !symbol || !category || !price) {
    return res.status(400).json({error: "ll fields (name, symbol, category, price) are required."})
  }

  const rawData = fs.readFileSync('./data/watchlist.json', 'utf-8')
  const watchlist = JSON.parse(rawData)

  const newId = watchlist.length > 0 ? watchlist[watchlist.length - 1].id + 1 : 1

  const newAsset = {
    id: newId,
    name: name.trim(),
    symbol: symbol.trim().toUpperCase(),
    category: category.toLowerCase(),
    price: Number(price)
  }

  watchlist.push(newAsset)
  fs.writeFileSync('./data/watchlist.json', JSON.stringify(watchlist, null, 2), 'utf-8')

  res.status(201).json(newAsset)

})

app.listen(PORT, () => console.log(`Server running on ${PORT}`))