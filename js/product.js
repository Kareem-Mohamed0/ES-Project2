// 1. GLOBAL STATE
let allProducts = []; // Store products here so we don't fetch from API on every click
let selectedFilters = {
    category: null,
    price: 5000, // Default Max Price
    size: null,
    color: null,
};
const ServerUrl = "http://localhost:3000";

const container = document.querySelector(".product-list");
const loader = document.querySelector(".loading-spinner");

// 2. INITIALIZE
async function init() {
    await loadProducts();
    setupEventListeners();
}

async function loadProducts() {
    try {
        const res = await fetch(`${ServerUrl}/products`);
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error("Error loading products:", error);
        container.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
    }
}

// 3. RENDER FUNCTION
function renderProducts(productsToDisplay) {
    container.innerHTML = ""; 

    if (productsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <p class="fs-4 text-secondary">No products match your filters.</p>
                <button class="btn btn-dark rounded-pill" onclick="resetFilters()">Clear All Filters</button>
            </div>`;
        return;
    }

    productsToDisplay.forEach((p) => {
        container.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4">
                <a href="/html/product-details.html?id=${p.id}" class="text-decoration-none text-black">
                    <div class="product-card rounded-5 p-4 border-0">
                        <div class="image">
                            <img class="img-fluid" src="${p.image}" alt="${p.name}">
                        </div>
                        <h5 class="text-black pt-4">${p.name}</h5>
                        <div class="rate">⭐ ${p.rating} / 5</div>
                        <span class="price fw-bold fs-4">$${p.price}</span>
                    </div>
                </a>
            </div>`;
    });
}

// 4. FILTER LOGIC
function applyAllFilters() {
    const filtered = allProducts.filter((p) => {
        const matchCategory = !selectedFilters.category || p.category === selectedFilters.category;
        const matchPrice = p.price <= selectedFilters.price;
        const matchSize = !selectedFilters.size || p.size === selectedFilters.size;
        const matchColor = !selectedFilters.color || p.color === selectedFilters.color;

        return matchCategory && matchPrice && matchSize && matchColor;
    });

    renderProducts(filtered);
}

// 5. EVENT LISTENERS
function setupEventListeners() {
    // Category Filters
    document.querySelectorAll(".cat-item").forEach((item) => {
        item.addEventListener("click", () => {
            const val = item.innerText.trim();
            if (selectedFilters.category === val) {
                selectedFilters.category = null;
                item.classList.remove("active-filter");
            } else {
                document.querySelectorAll(".cat-item").forEach(i => i.classList.remove("active-filter"));
                selectedFilters.category = val;
                item.classList.add("active-filter");
            }
            applyAllFilters();
        });
    });

    // Price Filter (Max Price Slider)
    const priceSlider = document.getElementById("maxPrice");
    if (priceSlider) {
        priceSlider.addEventListener("input", (e) => {
            selectedFilters.price = parseInt(e.target.value);
            // Update the display span next to slider
            const display = e.target.nextElementSibling;
            if (display) display.innerText = `$${e.target.value}`;
            applyAllFilters();
        });
    }

    // Color Filters (Assuming they are spans with bg- classes)
    document.querySelectorAll("#collapseTwo .rounded-pill").forEach((pill) => {
        pill.addEventListener("click", () => {
            // Extract the color name from class (e.g., bg-success -> success)
            const colorClass = Array.from(pill.classList).find(c => c.startsWith("bg-"));
            
            if (selectedFilters.color === colorClass) {
                selectedFilters.color = null;
                pill.style.outline = "none";
            } else {
                document.querySelectorAll("#collapseTwo .rounded-pill").forEach(p => p.style.outline = "none");
                selectedFilters.color = colorClass;
                pill.style.outline = "2px solid black";
                pill.style.outlineOffset = "2px";
            }
            applyAllFilters();
        });
    });

    // Size Filters
    document.querySelectorAll("#collapseThree .rounded-pill").forEach((pill) => {
        pill.addEventListener("click", () => {
            const size = pill.innerText.trim();
            if (selectedFilters.size === size) {
                selectedFilters.size = null;
                pill.classList.remove("bg-black", "text-white");
            } else {
                document.querySelectorAll("#collapseThree .rounded-pill").forEach(p => p.classList.remove("bg-black", "text-white"));
                selectedFilters.size = size;
                pill.classList.add("bg-black", "text-white");
            }
            applyAllFilters();
        });
    });
}

// 6. HELPER: RESET
window.resetFilters = () => {
    selectedFilters = { category: null, price: 5000, size: null, color: null };
    document.querySelectorAll(".active-filter, .bg-black").forEach(el => el.classList.remove("active-filter", "bg-black", "text-white"));
    renderProducts(allProducts);
};

// 7. LOADER LOGIC
document.addEventListener("click", (e) => {
    if (e.target.closest("a")) loader?.classList.remove("d-none");
});

window.addEventListener("load", () => {
    loader?.classList.add("d-none");
});

// Run
init();