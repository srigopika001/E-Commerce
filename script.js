
const products = [
    {
        id: 1,
        name: "Classic White Sneakers",
        category: "Fashion",
        price: 1499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 2,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 3,
        name: "Luxury Skincare Set",
        category: "Beauty",
        price: 999,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500"
    },
    {
        id: 4,
        name: "Modern Handbag",
        category: "Fashion",
        price: 1899,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
    },
    {
        id: 5,
        name: "Smart Watch",
        category: "Electronics",
        price: 3299,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
        id: 6,
        name: "Face Care Essentials",
        category: "Beauty",
        price: 799,
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500"
    },
    {
        id: 7,
        name: "Decorative Lamp",
        category: "Home",
        price: 1299,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
    },
    {
        id: 8,
        name: "Casual Backpack",
        category: "Fashion",
        price: 1199,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    }
];

let cart = [];
let wishlist = [];
let currentCategory = "All";

const productGrid = document.getElementById("productGrid");

function displayProducts() {
    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const filtered = products.filter(product => {
        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    document.getElementById("resultCount").textContent =
        `${filtered.length} products found`;

    productGrid.innerHTML = filtered.length
        ? filtered.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button
                        class="wish-btn ${wishlist.includes(product.id) ? "selected" : ""}"
                        onclick="toggleWishlist(${product.id})">
                        ${wishlist.includes(product.id) ? "♥" : "♡"}
                    </button>
                </div>

                <div class="product-info">
                    <small>${product.category}</small>
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
                    <button class="add-btn"
                        onclick="addToCart(${product.id})">
                        Add to Cart +
                    </button>
                </div>
            </div>
        `).join("")
        : "<p>No products found. Try another search.</p>";
}

// Search products
document.getElementById("searchBtn").addEventListener("click", displayProducts);

document.getElementById("searchInput").addEventListener("input", displayProducts);

// Category filter
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active")
            .classList.remove("active");

        button.classList.add("active");
        currentCategory = button.dataset.category;

        displayProducts();
    });
});

// Add to cart
function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    updateCart();
}

// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

// Remove item
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update cart
function updateCart() {
    const cartItems = document.getElementById("cartItems");

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    document.getElementById("cartCount").textContent = totalItems;

    document.getElementById("cartTotal").textContent =
        "₹" + totalPrice.toLocaleString("en-IN");

    cartItems.innerHTML = cart.length
        ? cart.map(item => {
            const product = products.find(p => p.id === item.id);

            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}">

                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <p>₹${product.price.toLocaleString("en-IN")}</p>

                        <div class="quantity">
                            <button onclick="changeQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>

                    <button class="remove-btn"
                        onclick="removeItem(${item.id})">
                        Remove
                    </button>
                </div>
            `;
        }).join("")
        : "<p>Your cart is empty!</p>";
}

// Wishlist
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    document.getElementById("wishCount").textContent =
        wishlist.length;

    displayProducts();
}

document.getElementById("wishlistBtn").addEventListener("click", () => {
    const names = wishlist.map(id =>
        products.find(p => p.id === id).name
    );

    alert(names.length
        ? "Your Wishlist:\n" + names.join("\n")
        : "Your wishlist is empty!");
});

// Open and close cart
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Demo checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Thank you for shopping! This is a demo checkout. No payment has been processed.");
});

// Newsletter demo
document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    document.getElementById("newsletterMessage").textContent =
        "Thank you for subscribing!";

    event.target.reset();
});

// Initial display
displayProducts();
updateCart();
