import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import process from 'node:process';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    // If secret key is not set, allow simulated verification for development mode
    return res.status(200).json({ status: 'success', verified: true, isSimulated: true });
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification parameters' });
  }

  try {
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ status: 'success', verified: true });
    } else {
      return res.status(400).json({ status: 'failure', verified: false, error: 'Invalid payment signature' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Payment verification server error' });
  }
}
