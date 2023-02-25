const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')

const routerProducts = require('./routes/products.router')
const routerCarts = require('./routes/carts.router')
const routerViews = require('./routes/views.router')

const { Server } = require('socket.io')

const app = express()
const PORT = process.env.PORT || 8080
const API_PREFIX = 'api'

const server = app.listen(PORT, () => console.log(`Server listen on PORT ${PORT}`))
const io = new Server(server)

const ProductManager = require('./productManager')
const dataPath = path.join(`${__dirname}/db/products.json`)
const productManager = new ProductManager(dataPath)


app.engine('handlebars', handlebars.engine())
app.set('views', path.join(`${__dirname}/views`))
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`))

app.use(`/${API_PREFIX}/products`, routerProducts)
app.use(`/${API_PREFIX}/carts`, routerCarts)
app.use('/realtimeproducts', routerViews)

io.on('connection', async socket => {
  console.log('New customer connected on PORT:', PORT)

  const products = await productManager.getAllProd()
  socket.emit('products', products)
  socket.on('addProd', async prod => await productManager.addProd(prod))
  socket.on('delProd', async id => await productManager.delProdById(id))
})