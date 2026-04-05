// 1. GLOBAL STATE
import { getAllProducts } from "./shared.js";
let allProducts = [];
let filteredProducts = []; // Store products here so we don't fetch from API on every click
let selectedFilters = {
  category: null,
  price: 5000, // Default Max Price
  size: null,
  color: null,
};

const container = document.querySelector(".product-list");
const loader = document.querySelector(".loading-spinner");

// 2. INITIALIZE
async function init() {
  await loadProducts();
  renderProducts(1, allProducts);
  setupEventListeners();
  setUpPagination(allProducts);
}

async function loadProducts() {
  try {
    allProducts = await getAllProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
  }
}

// 3. RENDER FUNCTION
function renderProducts(
  PageNum = 1,
  products = allProducts,
  setpagination = false,
) {
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <p class="fs-4 text-secondary">No products match your filters.</p>
            </div>`;
    setUpPagination([]);
    return;
  }

  let pageSize = 6;
  let start = (PageNum - 1) * pageSize;
  let end = pageSize + start;

  let html = products
    .slice(start, end)
    .map(({ id, image, name, rating, price }) => {
      return `
            <div class="col-12 col-sm-6 col-md-4">
                <a href="/html/product-details.html?id=${id}" class="text-decoration-none text-black">
                    <div class="product-card rounded-5 p-4 border-0">
                        <div class="image">
                            <img class="img-fluid" src="${image}" alt="${name}">
                        </div>
                        <h5 class="text-black pt-4">${name}</h5>
                        <div class="rate">⭐ ${rating} / 5</div>
                        <span class="price fw-bold fs-4">$${price}</span>
                    </div>
                </a>
            </div>`;
    })
    .join("");
  container.innerHTML = html;
  if (setpagination) setUpPagination(products);
}

// 4. FILTER LOGIC
function applyAllFilters() {
  filteredProducts = allProducts.filter((p) => {
    const { category, price, size, color } = selectedFilters;
    const {
      category: Pcategory,
      price: Pprice,
      size: Psize,
      color: Pcolor,
    } = p;

    return (
      (!category || Pcategory === category) &&
      Pprice <= price &&
      (!size || Psize === size) &&
      (!color || Pcolor === color)
    );
  });
  renderProducts(1, filteredProducts, true);
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
      } 
      else {
        document
          .querySelectorAll(".cat-item")
          .forEach((i) => i.classList.remove("active-filter"));
        selectedFilters.category = val;
        item.classList.add("active-filter");
      }
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
      const colorClass = Array.from(pill.classList).find((c) =>
        c.startsWith("bg-"),
      );

      if (selectedFilters.color === colorClass) {
        selectedFilters.color = null;
        pill.style.outline = "none";
      } else {
        document
          .querySelectorAll("#collapseTwo .rounded-pill")
          .forEach((p) => (p.style.outline = "none"));
        selectedFilters.color = colorClass;
        pill.style.outline = "2px solid black";
        pill.style.outlineOffset = "2px";
      }
      
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
        document
          .querySelectorAll("#collapseThree .rounded-pill")
          .forEach((p) => p.classList.remove("bg-black", "text-white"));
        selectedFilters.size = size;
        pill.classList.add("bg-black", "text-white");
      }
      
    });
  });
}

// 6. HELPER: RESET
window.resetFilters = () => {
  selectedFilters = { category: null, price: 5000, size: null, color: null };
  document
    .querySelectorAll(".active-filter, .bg-black")
    .forEach((el) =>
      el.classList.remove("active-filter", "bg-black", "text-white"),
    );
  renderProducts(1, allProducts, true);
  filteredProducts = [];
};

// 7. LOADER LOGIC
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-link")) return;
  if (e.target.closest("a")) loader?.classList.remove("d-none");
});

window.addEventListener("load", () => {
  loader?.classList.add("d-none");
});

//-----------------------------Pagination Loginc -----------------------------
function setUpPagination(products = allProducts) {
  let paginationEl = document.querySelector(".pagination");
  paginationEl.innerHTML = "";
  let pagesCount = Math.ceil(products.length / 6);
  for (let i = 1; i <= pagesCount; i++) {
    paginationEl.innerHTML += `
            <li class="page-item"><a class="page-link text-secondary fw-bold border-0 px-4 ${i == 1 ? "active" : ""}" data-page=${i} href="#">${i}</a></li>
        `;
  }
  let pageLinks = paginationEl.querySelectorAll(".page-link");
  pageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      pageLinks.forEach((l) => {
        l.classList.remove("active");
      });
      let pageNum = Number(e.target.dataset.page);
      renderProducts(pageNum, products);
    });
  });
}

//-----------------------------search Logic -----------------------
const searchInputEl = document.querySelector(".search-input");
searchInputEl.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  filteredProducts = allProducts.filter((p) => {
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.color.toLowerCase().includes(query)
    );
  });
  renderProducts(1, filteredProducts, true);
});

const applyBtn = document.querySelector(".apply-filters");
const resetBtn = document.querySelector(".reset-filters");

applyBtn?.addEventListener("click", applyAllFilters);
resetBtn?.addEventListener("click", resetFilters);
// Run
init();
