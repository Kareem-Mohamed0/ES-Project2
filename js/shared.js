const ServerUrl = "http://localhost:3000";
export async function getProduct(id) {
  const url = `http://localhost:3000/products/${id}`;
  const product = await fetch(url);
  if (!product.ok) throw new Error("Product not found");
  else {
    return await product.json();
  }
}

export async function getAllProducts() {
  const res = await fetch(`${ServerUrl}/products`);
  if(!res.ok) throw new Error("Failed to load products");
  return await res.json();
}
