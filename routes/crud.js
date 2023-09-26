require('dotenv').config()
const jwt = require('jsonwebtoken'),
  app = require('express')()
  User = require('../models/User')
  Product = require('../models/Product')


function checkToken (req, res, next) {
  const auth = req.headers['authorization'],
    token = auth && auth.split(' ')[1]
  // tem token?
  if (!token) {
    return res.status(401).json({msg: "Acesso negado!"})
  }
  
  try {
    const serverKey = process.env.SKEY
    jwt.verify(token, serverKey)
    next()
  } catch (error) {
    console.log(error)
    return res.status(400).json({msg: "Token inválido!"})
  }

}

// create
app.post('/', checkToken, async (req, res) => {
  const {productName, owner, caracs} = req.body
  if (!productName) {
    return res.status(500).json({msg: "Impossível registrar, sem dados!"})
  }

  const product = new Product({
    productName,
    owner,
    caracs
  })

  try {
    await Product.create(product)
    return res.status(201).json({msg: "Registrado com sucesso!"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg: "Erro interno, tente mais tarde!"})
  }
})

// retrieve
app.get('/:productName', checkToken, async (req, res) => {
  const productName = req.params['productName']

  try {
    product = await Product.findOne({productName: productName})
    return res.status(200).json({msg: product})
  } catch (error) {
    console.log(error)
    return res.status(404).json({msg: "Não encontrado!"})
  }
})

// update
app.patch('/', checkToken, async (req, res) => {
  const {productName, owner, caracs} = req.body

  const person = {
    productName, owner, caracs
  }
  try {
    updated = await Product.updateOne({productName: productName}, person)
    if (updated.matchedCount < 1) {
      return res.status(404).json({msg: "Não encontrado!"})
    }
    return res.status(200).json({msg: "Atualizado com sucesso!"})
  } catch (error) {
    console.log(error)
    return res.status(404).json({msg: "Não encontrado!"})
  }
})

// delete
app.delete('/', checkToken, async (req, res) => {
  const productName = req.body.productName
  try {
    const deleted = await Product.deleteOne({productName:productName})
    if (deleted.deletedCount < 1) {
      return res.status(404).json({msg: "Não encontrado!"})
    }
    return res.status(200).json({msg: "Deletado com sucesso!"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg: "Erro interno, tente mais tarde!"})
  }
})

module.exports = app