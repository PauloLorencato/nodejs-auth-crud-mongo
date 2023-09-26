require('dotenv').config()
  mongoose = require('mongoose'),
  express = require('express'),
  auth = require('./routes/auth'),
  crud = require('./routes/crud'),
  app = express()
  DB_USER = process.env.DB_USER
  DB_PASS = process.env.DB_PASS

// middleware
app.use(express.json())

app.get('/', async (req,res) => {
  res.status(200).json({msg: "Landing page"})
})

// rotas básicas
app.use('/auth', auth)

// conexão ao banco
mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.0o09qhf.mongodb.net/?retryWrites=true&w=majority`)
  .then(console.log("Conectado ao banco"))
  .catch((err) => console.log(err))

// escutando uma porta
app.listen(3000, () => console.log("Rodando na 3000"))