// Background rotator
const backgrounds = [
  "images/background-port-1.jpg",
  "images/background-port-2.jpg",
  "images/background-port-3.jpg"
];
let current = 0;
const bgElement = document.getElementById("background-rotator");

function rotateBackground() {
  bgElement.style.backgroundImage = `url(${backgrounds[current]})`;
  current = (current + 1) % backgrounds.length;
}
rotateBackground();
setInterval(rotateBackground, 5000);

// Load products from JSON
async function loadProducts() {
  const res = await fetch("products.json");
  const products = await res.json();
  const grid = document.getElementById("product-grid");

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card bg-white shadow rounded p-4 text-center";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded mb-4">
      <h3 class="text-xl font-bold mb-2">${product.name}</h3>
      <p class="text-lg font-semibold">$${product.price}</p>
      <a href="${product.etsy}" target="_blank"
         class="inline-block mt-4 bg-[var(--primary,#1e40af)] text-white px-4 py-2 rounded hover:bg-[var(--primary-dark,#1e3a8a)] transition">
         Buy on Etsy
      </a>
    `;

    grid.appendChild(card);
  });
}
loadProducts();
