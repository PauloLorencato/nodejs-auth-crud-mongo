require('dotenv').config()
const mongoose = require('mongoose'),
  User = require('../models/User'),
  bcrypt = require('bcrypt')
  jwt = require('jsonwebtoken')
  app = require('express')()

  // cadastro de usuário
  app.post('/signup', async (req, res) => {

    // senha confere?
    const {name, email, password, confirmPassword} = req.body
    if (password !== confirmPassword) {
      return res.status(400).json({msg: "Confirmação de senha não confere!"})
    }
    
    // email já cadastrado?
    const userExists = await User.findOne({email: email})
    if (userExists) {
      return res.status(400).json({msg: "Email já cadastrado, por favor escolha outro!"})
    }
    
    // encriptando senha
    const salt = await bcrypt.genSalt(12),
      passwordHash = await bcrypt.hash(password, salt)
  
    // cadastrando usuário
    const user = new User({
      name,
      email,
      password: passwordHash
    })
  
    try {
      await user.save()
      res.status(200).json({msg: "Usuário cadastrado com sucesso!"})
    } catch (error) {
      console.log(error)
      return res.status(500).json({msg: "Erro interno, por favor tente mais tarde!"})
    }
  })
  
  // login de usuário
  app.post('/signin', async (req,res) => {
    const {email, password} = req.body,
      user = await User.findOne({email: email})
    
    // usuário existe?
    if (!user) {
      return res.status(400).json({msg: "Usuário não encontrado!"})
    }
  
    // senha confere?
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(400).json({msg: "Senha incorreta!"})
    }
  
    try {
      const serverKey = process.env.SKEY
      const token = jwt.sign({
          id: user._id,
          name: user.name
      }, serverKey)
      return res.status(200).json({msg: `Olá, ${user.name}, seja bem vindo!`, token})
    } catch (error) {
      console.log(error)
      return res.status(500).json({msg: "Erro interno, tente novamente!"})
    }
  })

module.exports = app