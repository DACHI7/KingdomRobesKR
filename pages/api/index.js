import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/printify")
      .then(res => res.json())
      .then(data => setProducts(data.data || []));
  }, []);

  const handleBuy = async (product) => {
    const stripe = await stripePromise;

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });

    const data = await res.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Printify Hoodie Store</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map(product => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <h2>{product.title}</h2>
            <img src={product.images[0]?.src} alt={product.title} style={{ width: "100%" }} />
            <p>${product.variants[0].price}</p>
            <button
              onClick={() => handleBuy({ title: product.title, price: product.variants[0].price })}
              style={{ marginTop: "10px", padding: "5px 10px", background: "#333", color: "white", border: "none", cursor: "pointer" }}
            >
              Buy Hoodie
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
