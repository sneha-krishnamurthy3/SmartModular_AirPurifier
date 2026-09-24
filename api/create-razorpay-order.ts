import type { VercelRequest, VercelResponse } from '@vercel/node';
import process from 'node:process';
import { Buffer } from 'node:buffer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid order amount' });
  }

  const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    // Return mock server order for sandbox testing
    const mockOrderId = `order_sim_${Date.now()}`;
    return res.status(200).json({
      id: mockOrderId,
      amount: Math.round(amount * 100),
      currency,
      status: 'created',
      isSimulated: true,
    });
  }

  try {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.description || 'Razorpay order creation failed' });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error creating Razorpay order' });
  }
}
