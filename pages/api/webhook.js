import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Call Printify API here to create order
    await fetch(`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        line_items: [
          {
            variant_id: YOUR_VARIANT_ID,
            quantity: 1
          }
        ],
        shipping_method: "standard",
        send_shipping_notification: true
      })
    });
  }

  res.json({ received: true });
}
