// Simple product list and 'Add to cart' functionality
const products = [
  { id: 1, title: "Smartphone X100", category: "mobiles", price: 12999, desc: "6.5\" display, 6GB RAM" },
  { id: 2, title: "Running Shoes", category: "fashion", price: 2499, desc: "Lightweight & comfy" },
  { id: 3, title: "Bluetooth Speaker", category: "home", price: 1999, desc: "10W, portable" },
  { id: 4, title: "Smartwatch S", category: "mobiles", price: 6999, desc: "Heart rate & steps" },
  { id: 5, title: "T-shirt - Men", category: "fashion", price: 599, desc: "Cotton, regular fit" }
];

const productGrid = document.getElementById('productGrid');
const cartCountEl = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// cart stored as map productId -> qty
let cart = JSON.parse(localStorage.getItem('minikart_cart') || '{}');

function saveCart(){
  localStorage.setItem('minikart_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  cartCountEl.textContent = count;
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  // small feedback
  const prod = products.find(p => p.id === id);
  showToast(`${prod.title} added to cart`);
}

function renderProducts(list){
  productGrid.innerHTML = '';
  if(list.length === 0){
    productGrid.innerHTML = '<p style="grid-column:1/-1;color:#666">No products found.</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="prod-img">Image</div>
      <div class="title">${p.title}</div>
      <div class="info">${p.desc}</div>
      <div class="price">₹ ${p.price.toLocaleString()}</div>
      <div class="actions">
        <button class="btn view">View</button>
        <button class="btn add" data-id="${p.id}">Add to cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });

  // attach add-to-cart listeners
  productGrid.querySelectorAll('.add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

// simple category filter + search
document.querySelectorAll('.cat-btn').forEach(b => {
  b.addEventListener('click', () => {
    const cat = b.dataset.cat;
    if(cat === 'all') renderProducts(products);
    else renderProducts(products.filter(p => p.category === cat));
  });
});

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') doSearch(); });

function doSearch(){
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ renderProducts(products); return; }
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
  );
  renderProducts(filtered);
}

// simple toast feedback
function showToast(msg){
  const id = 'mini-toast';
  let el = document.getElementById(id);
  if(!el){
    el = document.createElement('div');
    el.id = id;
    Object.assign(el.style, {
      position: 'fixed', right: '16px', bottom: '16px',
      background: '#111', color:'#fff', padding:'10px 14px',
      borderRadius: '8px', boxShadow: '0 6px 18px rgba(0,0,0,0.2)', zIndex:9999
    });
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  setTimeout(()=>{ el.style.transition = 'opacity 400ms'; el.style.opacity = '0'; }, 1400);
}

// initialize
renderProducts(products);
updateCartUI();