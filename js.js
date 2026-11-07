const STORAGE_KEY = "infinityPOS_v1";

const groceryItem = [
  { product_id: 1, product_name: "Dried Mangoes (200g)", product_price: 180 },
  { product_id: 2, product_name: "Banana Chips (200g)", product_price: 120 },
  { product_id: 3, product_name: "Tablea Chocolate (250g)", product_price: 200 },
  { product_id: 4, product_name: "Coconut Oil (500ml)", product_price: 180 },
  { product_id: 5, product_name: "Mango Jam (250g)", product_price: 160 },
  { product_id: 6, product_name: "Peanut Brittle (200g)", product_price: 150 },
  { product_id: 7, product_name: "Cashew Nuts (250g)", product_price: 280 },
  { product_id: 8, product_name: "Philippine Coffee Beans (250g)", product_price: 320 },
  { product_id: 9, product_name: "Native Vinegar (500ml)", product_price: 120 },
  { product_id: 10, product_name: "Philippine Honey (250ml)", product_price: 250 },
  { product_id: 11, product_name: "Coconut Sugar (500g)", product_price: 180 },
  { product_id: 12, product_name: "Rice Crackers (200g)", product_price: 100 },
  { product_id: 13, product_name: "Salted Fish (Danggit, 250g)", product_price: 220 },
  { product_id: 14, product_name: "Longganisa (Frozen, 500g)", product_price: 280 },
  { product_id: 15, product_name: "Tocino (Frozen, 500g)", product_price: 300 },
  { product_id: 16, product_name: "Chicharon (100g)", product_price: 120 },
  { product_id: 17, product_name: "Pandesal Pack (12 pcs)", product_price: 80 },
  { product_id: 18, product_name: "Native Brown Rice (1kg)", product_price: 90 },
  { product_id: 19, product_name: "White Rice (1kg)", product_price: 70 },
  { product_id: 20, product_name: "Corn Coffee (250g)", product_price: 150 },
  { product_id: 21, product_name: "Coconut Water (1L)", product_price: 100 },
  { product_id: 22, product_name: "Calamansi Juice (1L)", product_price: 120 },
  { product_id: 23, product_name: "Guava Jelly (250g)", product_price: 160 },
  { product_id: 24, product_name: "Bagoong (250g)", product_price: 90 },
  { product_id: 25, product_name: "Fish Sauce (Patis, 500ml)", product_price: 110 },
  { product_id: 26, product_name: "Soy Sauce (500ml)", product_price: 95 },
  { product_id: 27, product_name: "Native Salt (250g)", product_price: 50 },
  { product_id: 28, product_name: "Coconut Milk Powder (200g)", product_price: 140 },
  { product_id: 29, product_name: "Instant Noodles (Pack of 6)", product_price: 75 },
  { product_id: 30, product_name: "Native Cheese (Kesong Puti, 250g)", product_price: 180 },
  { product_id: 31, product_name: "Eggs (Dozen)", product_price: 90 },
  { product_id: 32, product_name: "Fresh Tilapia (1kg)", product_price: 160 },
  { product_id: 33, product_name: "Fresh Bangus (Milkfish, 1kg)", product_price: 180 },
  { product_id: 34, product_name: "Fresh Chicken (1kg)", product_price: 200 },
  { product_id: 35, product_name: "Fresh Pork (1kg)", product_price: 280 },
  { product_id: 36, product_name: "Fresh Beef (1kg)", product_price: 350 },
  { product_id: 37, product_name: "Native Vegetables Basket", product_price: 250 },
  { product_id: 38, product_name: "Bananas (1kg)", product_price: 60 },
  { product_id: 39, product_name: "Mangoes (1kg)", product_price: 120 },
  { product_id: 40, product_name: "Papaya (1kg)", product_price: 70 },
  { product_id: 41, product_name: "Pineapple (Whole)", product_price: 90 },
  { product_id: 42, product_name: "Coconut (Whole)", product_price: 50 },
  { product_id: 43, product_name: "Native Peanuts (250g)", product_price: 100 },
  { product_id: 44, product_name: "Camote (Sweet Potato, 1kg)", product_price: 80 },
  { product_id: 45, product_name: "Ube Halaya (250g)", product_price: 180 },
  { product_id: 46, product_name: "Leche Flan (Whole)", product_price: 250 },
  { product_id: 47, product_name: "Bibingka (Whole)", product_price: 200 },
  { product_id: 48, product_name: "Puto (Dozen)", product_price: 120 },
  { product_id: 49, product_name: "Kakanin Sampler Pack", product_price: 300 },
  { product_id: 50, product_name: "Native Chocolate Drink (Sikwate, 250ml)", product_price: 90 }
].map(function (p) {
    p.product_stock = 10 + ((p.product_id * 7) % 25);
    return p;
});

let products = [];
let cart = [];      
let transactions = [];
let transactionCounter = 1;

//discount rule 10 percent if maabot og 1000
const DISCOUNT_THRESHOLD = 1000;
const DISCOUNT_RATE = 0.10;

function calcDiscount(subtotal) {
    return subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
}

function loadState() {
    let raw = null;
    try {
        raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        console.warn("Storage unavailable — running with in-memory data only:", e.message);
        raw = null;
    }

    if (!raw) {
        products = groceryItem;
        transactions = [];
        transactionCounter = 1;
        saveState();
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        products = parsed.products || groceryItem;
        transactions = parsed.transactions || [];
        transactionCounter = parsed.transactionCounter || 1;
    } catch (e) {
        products = groceryItem;
        transactions = [];
        transactionCounter = 1;
    }
}

function saveState() {
     try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            products: products,
            transactions: transactions,
            transactionCounter: transactionCounter
        }));
    } catch (e) {
        console.warn("Could not save to storage — changes will not persist after reload:", e.message);
    }
}

function peso(n) {
    return "₱" + Number(n).toFixed(2);
}

function findProduct(id) {
    return products.find(function (p) { return p.product_id === id; });
}

// ===========================
// NAVIGATION
// ===========================

function showSection(name) {
    document.querySelectorAll(".page").forEach(function (el) {
        el.classList.toggle("active", el.id === name);
    });
    document.querySelectorAll(".nav-btn").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.section === name);
    });

    if (name === "dashboard") renderDashboard();
    if (name === "pos") renderProductGrid();
    if (name === "transactions") renderTransactionsList();
}

function initNav() {
    document.querySelectorAll(".nav-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            showSection(btn.dataset.section);
        });
    });
}

function renderProductGrid() {
    const productList = document.getElementById("productList");
    const term = (document.getElementById("productSearch").value || "").toLowerCase().trim();

    const visible = products.filter(function (p) {
        return p.product_name.toLowerCase().includes(term);
    });

    if (visible.length === 0) {
        productList.innerHTML = '<p class="empty-note">No products match your search.</p>';
        return;
    }
    
    productList.innerHTML = visible.map(function (product) {
        const outOfStock = product.product_stock <= 0;
        return `
        <div class="product ${outOfStock ? "out-of-stock" : ""}">
            <h3>${product.product_name}</h3>
            <p>${peso(product.product_price)}</p>
            <div class="stock-tag">${outOfStock ? "Out of stock" : product.product_stock + " in stock"}</div>
            <button class="add-to-cart-btn" data-id="${product.product_id}" ${outOfStock ? "disabled" : ""}>
                ${outOfStock ? "Unavailable" : "Buy"}
            </button>
        </div>`;
    }).join("");

    productList.querySelectorAll("button.add-to-cart-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            addToCart(Number(btn.dataset.id));
        });
    });
}

function isMobileView() {
    return window.matchMedia("(max-width: 1000px)").matches;
}

function openCartPanel() {
    document.getElementById("cartPanel").classList.add("cart-open");
    document.getElementById("cartOverlay").classList.add("show");
}

function closeCartPanel() {
    document.getElementById("cartPanel").classList.remove("cart-open");
    document.getElementById("cartOverlay").classList.remove("show");
}

function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) return;

    const inCart = cart.find(function (c) { return c.product_id === productId; });
    const qtyAlready = inCart ? inCart.qty : 0;

    if (qtyAlready + 1 > product.product_stock) {
        alert("Not enough stock for " + product.product_name + ".");
        return;
    }

    if (inCart) {
        inCart.qty += 1;
    } else {
        cart.push({
            product_id: product.product_id,
            product_name: product.product_name,
            product_price: product.product_price,
            qty: 1
        });
    }

    renderCart();

    
    if (isMobileView()) openCartPanel();
}

function changeCartQty(productId, delta) {
    const item = cart.find(function (c) { return c.product_id === productId; });
    if (!item) return;

    const product = findProduct(productId);
    const newQty = item.qty + delta;

    if (newQty <= 0) {
        cart = cart.filter(function (c) { return c.product_id !== productId; });
    } else if (product && newQty > product.product_stock) {
        alert("Not enough stock for " + product.product_name + ".");
        return;
    } else {
        item.qty = newQty;
    }

    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(function (c) { return c.product_id !== productId; });
    renderCart();
}

function cartTotal() {
    return cart.reduce(function (sum, c) { return sum + c.product_price * c.qty; }, 0);
}

function cartFinalTotal() {
    const subtotal = cartTotal();
    return subtotal - calcDiscount(subtotal);
}

let priceEditCartId = null;

function renderCart() {
    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-note">Cart is empty. Add products to start a sale.</p>';
    } else {
        cartItems.innerHTML = cart.map(function (item) {
            const editing = priceEditCartId === item.product_id;

            const priceHTML = editing
                ? `<div class="cart-price-edit">
                       <input type="number" class="cart-price-input" data-id="${item.product_id}"
                              min="0" step="0.01" value="${item.product_price}">
                       <button class="cart-price-confirm" data-id="${item.product_id}">✓</button>
                       <button class="cart-price-cancel" data-id="${item.product_id}">✕</button>
                   </div>`
                : `<small>${peso(item.product_price)} each
                       <button class="cart-price-edit-btn" data-id="${item.product_id}" title="Edit price">✏️</button>
                   </small>`;

            return `
            <div class="cart-item">
                <div class="cart-item-name">${item.product_name}<br>${priceHTML}</div>
                <div class="cart-item-controls">
                    <button data-action="dec" data-id="${item.product_id}">−</button>
                    <span>${item.qty}</span>
                    <button data-action="inc" data-id="${item.product_id}">+</button>
                    <button class="cart-item-remove" data-action="remove" data-id="${item.product_id}">✕</button>
                </div>
            </div>`;
        }).join("");

        cartItems.querySelectorAll("button[data-action]").forEach(function (btn) {
            const id = Number(btn.dataset.id);
            const action = btn.dataset.action;
            btn.addEventListener("click", function () {
                if (action === "inc") changeCartQty(id, 1);
                if (action === "dec") changeCartQty(id, -1);
                if (action === "remove") removeFromCart(id);
            });
        });

        // Opens the inline price editor for a line
        cartItems.querySelectorAll(".cart-price-edit-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                priceEditCartId = Number(btn.dataset.id);
                renderCart();
                const input = cartItems.querySelector(".cart-price-input");
                if (input) { input.focus(); input.select(); }
            });
        });

        // Confirms the typed price for that line
        cartItems.querySelectorAll(".cart-price-confirm").forEach(function (btn) {
            btn.addEventListener("click", function () {
                confirmCartPriceEdit(Number(btn.dataset.id));
            });
        });

        // Cancels editing, restoring the plain price display
        cartItems.querySelectorAll(".cart-price-cancel").forEach(function (btn) {
            btn.addEventListener("click", function () {
                priceEditCartId = null;
                renderCart();
            });
        });

        // Pressing Enter in the price box confirms it
        cartItems.querySelectorAll(".cart-price-input").forEach(function (input) {
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    confirmCartPriceEdit(Number(input.dataset.id));
                }
            });
        });
    }

    //compute subtotal / discount / final total together
    const subtotal = cartTotal();
    const discount = calcDiscount(subtotal);
    const total = subtotal - discount;

    document.getElementById("cartSubtotal").textContent = peso(subtotal);

    //reveal the discount line only when a discount actually applies
    const discountRow = document.getElementById("discountRow");
    if (discount > 0) {
        discountRow.classList.remove("hidden");
        document.getElementById("cartDiscount").textContent = "-" + peso(discount);
    } else {
        discountRow.classList.add("hidden");
    }

    document.getElementById("cartTotal").textContent = peso(total);
    document.getElementById("checkoutBtn").disabled = cart.length === 0;

    //keep the floating "View Cart" button (mobile) in sync with cart contents
    const totalQty = cart.reduce(function (sum, c) { return sum + c.qty; }, 0);
    const viewCartBtn = document.getElementById("viewCartBtn");
    document.getElementById("viewCartCount").textContent = totalQty;
    viewCartBtn.classList.toggle("show", cart.length > 0);
    if (cart.length === 0) closeCartPanel();

    updateChange();
}

//reads the typed price for a cart line and applies it
function confirmCartPriceEdit(productId) {
    const input = document.querySelector(`.cart-price-input[data-id="${productId}"]`);
    const price = input ? Number(input.value) : NaN;

    if (!input || isNaN(price) || price < 0) {
        alert("Please enter a valid price.");
        return;
    }

    const item = cart.find(function (c) { return c.product_id === productId; });
    if (item) item.product_price = price;

    priceEditCartId = null;
    renderCart();
}


function updateChange() {
    const cash = Number(document.getElementById("cashReceived").value) || 0;
    const total = cartFinalTotal(); // ADDED: change is based on the discounted total, not the raw subtotal
    const change = cash - total;
    document.getElementById("changeDue").textContent = peso(change > 0 ? change : 0);
}

function clearCart() {
    cart = [];
    document.getElementById("cashReceived").value = "";
    renderCart();
}

function checkout() {
    if (cart.length === 0) return;

    //work out subtotal + automatic discount before finalizing the sale
    const subtotal = cartTotal();
    const discount = calcDiscount(subtotal);
    const total = subtotal - discount;
    const cash = Number(document.getElementById("cashReceived").value) || 0;

    if (cash < total) {
        alert("Cash received is less than the total due.");
        return;
    }

    // Deduct stock
    cart.forEach(function (item) {
        const product = findProduct(item.product_id);
        if (product) product.product_stock -= item.qty;
    });

    const transaction = {
        id: transactionCounter++,
        date: new Date().toISOString(),
        items: cart.map(function (c) {
            return { product_name: c.product_name, product_price: c.product_price, qty: c.qty };
        }),
        subtotal: subtotal,       // ADDED
        discount: discount,       // ADDED
        total: total,
        cash: cash,
        change: cash - total
    };

    transactions.unshift(transaction);
    saveState();

    clearCart();
    renderProductGrid();
    closeCartPanel();

    //pop up the receipt right after the sale completes
    showReceipt(transaction);
}

function renderTransactionsList() {
    const container = document.getElementById("transactionsList");

    if (transactions.length === 0) {
        container.innerHTML = '<p class="empty-note">No transactions yet.</p>';
        return;
    }

    container.innerHTML = transactions.map(function (t) {
        const subtotal = t.subtotal != null ? t.subtotal : t.total;
        const discount = t.discount || 0;

        const itemRows = t.items.map(function (i) {
            return `<div><span>${i.qty} × ${i.product_name}</span><span>${peso(i.product_price * i.qty)}</span></div>`;
        }).join("");

        return `
        <div class="transaction-card">
            <div class="transaction-header">
                <span>Sale #${t.id}</span>
                <span>${peso(t.total)}</span>
            </div>
            <div class="transaction-meta">
                ${new Date(t.date).toLocaleString()}
                ${discount > 0 ? " · 10% discount applied" : ""}
            </div>
            <div class="transaction-items">${itemRows}</div>
            <div class="transaction-items">
                <div><span>Subtotal</span><span>${peso(subtotal)}</span></div>
                ${discount > 0 ? `<div><span>Discount</span><span>-${peso(discount)}</span></div>` : ""}
                <div><span>Cash / Change</span><span>${peso(t.cash)} / ${peso(t.change)}</span></div>
            </div>
            <button class="view-receipt-btn" data-id="${t.id}">🧾 View Receipt</button>
        </div>`;
    }).join("");

    container.querySelectorAll(".view-receipt-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const t = transactions.find(function (tx) { return tx.id === Number(btn.dataset.id); });
            if (t) showReceipt(t);
        });
    });
}

function renderDashboard() {
    const todayStr = new Date().toDateString();
    const todaysTransactions = transactions.filter(function (t) {
        return new Date(t.date).toDateString() === todayStr;
    });
    const todaysSales = todaysTransactions.reduce(function (sum, t) { return sum + t.total; }, 0);
    const totalStock = products.reduce(function (sum, p) { return sum + p.product_stock; }, 0);

    document.getElementById("statCards").innerHTML = `
        <div class="stat-card"><h4>Today's Sales</h4><div class="stat-value">${peso(todaysSales)}</div></div>
        <div class="stat-card"><h4>Today's Transactions</h4><div class="stat-value">${todaysTransactions.length}</div></div>
        <div class="stat-card"><h4>Total Products</h4><div class="stat-value">${products.length}</div></div>
        <div class="stat-card"><h4>Total Stock on Hand</h4><div class="stat-value">${totalStock}</div></div>
    `;

    const lowStock = products.filter(function (p) { return p.product_stock <= 5; });
    const lowStockContainer = document.getElementById("lowStockList");
    lowStockContainer.innerHTML = lowStock.length === 0
        ? '<p class="empty-note">All products are well stocked.</p>'
        : lowStock.map(function (p) {
            return `<div class="list-row"><span>${p.product_name}</span><span class="stock-low">${p.product_stock} left</span></div>`;
        }).join("");
}

function buildReceiptHTML(t) {
    const dateStr = new Date(t.date).toLocaleString();
    const subtotal = t.subtotal != null ? t.subtotal : t.total; // fallback for older saved sales
    const discount = t.discount || 0;

    const itemRows = t.items.map(function (i) {
        return `
        <div class="receipt-line">
            <span>${i.qty} × ${i.product_name}</span>
            <span>${peso(i.product_price * i.qty)}</span>
        </div>`;
    }).join("");

    return `
        <h2>∞ Infinity Store</h2>
        <div class="receipt-sub">ALL ABOARD THE INFINITY LINE</div>
        <div class="receipt-line"><span>Sale #</span><span>${t.id}</span></div>
        <div class="receipt-line"><span>Date</span><span>${dateStr}</span></div>
        <hr>
        ${itemRows}
        <hr>
        <div class="receipt-line"><span>Subtotal</span><span>${peso(subtotal)}</span></div>
        ${discount > 0 ? `<div class="receipt-line"><span>Discount (10%)</span><span>-${peso(discount)}</span></div>` : ""}
        <div class="receipt-line receipt-total-line"><span>TOTAL</span><span>${peso(t.total)}</span></div>
        <div class="receipt-line"><span>Cash</span><span>${peso(t.cash)}</span></div>
        <div class="receipt-line"><span>Change</span><span>${peso(t.change)}</span></div>
        <hr>
        <div class="receipt-footer">∞ Thank you for riding with us — see you next stop! ∞</div>
    `;
}
function showReceipt(t) {
    document.getElementById("receiptContent").innerHTML = buildReceiptHTML(t);
    document.getElementById("receiptModal").classList.remove("hidden");
    document.getElementById("receiptModal").dataset.transactionId = t.id;
}

function closeReceipt() {
    document.getElementById("receiptModal").classList.add("hidden");
}

function init() {
    loadState();
    initNav();

    document.getElementById("productSearch").addEventListener("input", renderProductGrid);
    document.getElementById("cashReceived").addEventListener("input", updateChange);
    document.getElementById("checkoutBtn").addEventListener("click", checkout);
    document.getElementById("clearCartBtn").addEventListener("click", clearCart);

    //mobile slide-up cart panel controls
    document.getElementById("closeCartBtn").addEventListener("click", closeCartPanel);
    document.getElementById("cartOverlay").addEventListener("click", closeCartPanel);
    document.getElementById("viewCartBtn").addEventListener("click", openCartPanel);

    //receipt modal controls
    document.getElementById("closeReceiptBtn").addEventListener("click", closeReceipt);

    renderDashboard();
    renderProductGrid();
    renderCart();
}

document.addEventListener("DOMContentLoaded", init);
