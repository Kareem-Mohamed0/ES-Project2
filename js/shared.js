export async function getProduct(id) {
  const url = `http://localhost:3000/products/${id}`;
  const product = await fetch(url);
  if (!product.ok) throw new Error("Product not found");
  else {
    return await product.json();
  }
}
