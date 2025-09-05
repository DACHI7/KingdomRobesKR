import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout session
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Example: Send order to Printify
    // You need product IDs and variant IDs to match Printify shop
    const orderData = {
      external_id: session.id,
      line_items: session.metadata.items ? JSON.parse(session.metadata.items) : [],
      send_shipping_notification: true
    };

    try {
      const printifyRes = await fetch(`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PRINTIFY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });
      const printifyResult = await printifyRes.json();
      console.log("Printify order created:", printifyResult);
    } catch (err) {
      console.error("Error creating Printify order:", err);
    }
  }

  res.status(200).json({ received: true });
}

// Required for raw body parsing for Stripe webhook
export const config = {
  api: {
    bodyParser: false,
  },
};
