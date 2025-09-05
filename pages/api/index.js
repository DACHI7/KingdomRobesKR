import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [products, setProducts] = useState([]);

  // Fetch products from Printify API
  useEffect(() => {
    fetch("/api/printify")
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Handle Buy Now via Stripe
  const handleBuy = async (product) => {
    const stripe = await stripePromise;

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });

    const data = await res.json();
    const result = await stripe.redirectToCheckout({ sessionId: data.id });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <div className="font-[Poppins] text-gray-800">
      {/* Header */}
      <header className="relative h-screen flex flex-col justify-center items-center text-center text-white">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div id="background-rotator" className="absolute inset-0 bg-cover bg-center"></div>
        <div className="relative z-10">
          <img src="/images/logo.png" alt="Kingdom Robes Logo" className="mx-auto h-48 mb-8" />
          <h1 className="text-5xl font-extrabold text-black">Kingdom Robes</h1>
          <p className="text-lg mt-5 font-bold text-black">Christian Based Attire • Richmond, VA</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-100 py-4 shadow sticky top-0 z-20">
        <div className="container mx-auto flex justify-center space-x-6">
          <a href="#products" className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition">Shop</a>
          <a href="#about" className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition">About</a>
          <a href="#contact" className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition">Contact</a>
        </div>
      </nav>

      {/* Products */}
      <main id="products" className="container mx-auto py-12">
        <h2 className="text-4xl font-bold text-center mb-8">Our Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length === 0 && <p className="text-center col-span-full">Loading products...</p>}
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <img
                src={product.images[0]?.src || "/images/placeholder.png"}
                alt={product.title}
                className="w-full h-60 object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-bold mb-2">{product.title}</h3>
              <p className="mb-4 font-semibold">${product.variants[0]?.price || "0.00"}</p>
              <button
                onClick={() => handleBuy({ title: product.title, price: product.variants[0]?.price || 0 })}
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* About */}
      <section id="about" className="bg-gray-50 py-12">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">About Kingdom Robes</h2>
          <p className="text-lg">
            <b>Kingdom Robes</b> is a Christian-based clothing brand providing
            <b> cotton and fitness apparel</b> with powerful verses and unique designs.
            Based in <b>Richmond, VA</b>, our mission is to inspire through faith and fashion.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 bg-white">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p>Email: <a href="mailto:robertturpin99@gmail.com" className="text-blue-500 hover:underline">robertturpin99@gmail.com</a></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6 text-center">
        <p>&copy; 2025 Kingdom Robes. All rights reserved.</p>
      </footer>
    </div>
  );
}
