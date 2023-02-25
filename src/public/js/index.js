const socket = io()

const btnForm = document.getElementById('btn-form')
const form = document.getElementById('form-data')

const newProduct = e => {
  e.preventDefault()
  const data = new FormData(form)
  const prod = {
    title: data.get('title'),
    description: data.get('description'),
    category: data.get('category'),
    price: data.get('price'),
    stock: data.get('stock'),
    code: data.get('code')
  };
  socket.emit('addProd', prod)
  form.reset()
}

const delProd = async e => socket.emit('delProd', e.target.id)

socket.on('products', products => {
  const productContainer = document.getElementById('products-container')
  productContainer.innerHTML = ''
  for (const prod of products) {
    productContainer.innerHTML += `
      <div class="prod-container">
        <h2 class="prod-title">${prod.title}</h2>
        <p><b>Description:</b> ${prod.description}</p>
        <p><b>Category:</b> ${prod.category}</p>
        <p><b>Price: $</b> ${prod.price}</p>
        <p><b>Stock:</b> ${prod.stock}</p>
        <p><b>Code:</b> ${prod.code}</p>
        <button id=${prod.id} class='btn-del'>deleted</button>
      </div>
    `;
  }
})

document.addEventListener('click', e => e.target.matches('.btn-del') && delProd(e));
btnForm.addEventListener('click', newProduct)