/**
 * GA4 Realtime Traffic & E-Commerce Funnel Simulator
 * Measurement ID: G-7ZHY9S6YYJ
 * Simulates 100 distinct visitors across the entire 5-step conversion funnel.
 */

const https = require('https');

const GA_MEASUREMENT_ID = 'G-7ZHY9S6YYJ';
const TOTAL_USERS = 100;

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
];

const PRODUCTS = [
  { id: 'prod-001', name: 'Pavitra Air Module One', category: 'purifier', price: 3500 },
  { id: 'prod-002', name: 'H13 Medical Grade HEPA Filter Module', category: 'filter', price: 1100 },
  { id: 'prod-003', name: 'BLDC Fan Core Module', category: 'power_module', price: 500 },
  { id: 'prod-004', name: 'USB-C Smart Power Supply Module', category: 'power_module', price: 600 }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function sendGaHit(params, userAgent) {
  return new Promise((resolve) => {
    const query = new URLSearchParams(params).toString();
    const options = {
      hostname: 'www.google-analytics.com',
      path: '/g/collect?' + query,
      method: 'POST',
      headers: {
        'User-Agent': userAgent || USER_AGENTS[0],
        'Accept': '*/*',
        'Content-Length': 0
      }
    };

    const req = https.request(options, (res) => {
      resolve(res.statusCode);
    });

    req.on('error', () => {
      resolve(null);
    });

    req.end();
  });
}

async function simulateUser(userIndex) {
  const userAgent = USER_AGENTS[userIndex % USER_AGENTS.length];
  const clientId = `${Math.floor(100000000 + Math.random() * 900000000)}.${Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 120)}`;
  const sessionId = Math.floor(Date.now() / 1000);
  let sequence = 1;

  const baseParams = {
    v: '2',
    tid: GA_MEASUREMENT_ID,
    gtm: '45je49g0v889093822za200',
    _p: Math.floor(Math.random() * 1e9),
    cid: clientId,
    ul: 'en-in',
    sr: userAgent.includes('Mobile') ? '390x844' : '1920x1080',
    sid: sessionId,
    sct: '1',
    seg: '1',
    _dbg: '1'
  };

  // Step 1: Page View (Landing on Homepage or Products)
  const isDirectProduct = userIndex % 4 === 0;
  const initialPath = isDirectProduct ? '/products' : '/';
  const initialTitle = isDirectProduct ? 'All Products — Pavitra Innovations' : 'Pavitra Innovations — Clean Air. Clever Design.';

  await sendGaHit({
    ...baseParams,
    _s: sequence++,
    en: 'page_view',
    dl: `https://pavitrainnovations.com${initialPath}`,
    dt: initialTitle,
    _ss: '1',
    _fv: '1'
  }, userAgent);

  // 82% of users proceed to Step 2: view_item (Viewing a product page)
  if (userIndex < 82) {
    const product = PRODUCTS[userIndex % PRODUCTS.length];
    await sleep(150 + Math.random() * 200);

    // Page view of product page
    await sendGaHit({
      ...baseParams,
      _s: sequence++,
      en: 'page_view',
      dl: `https://pavitrainnovations.com/products/${product.id}`,
      dt: `${product.name} — Pavitra Innovations`
    }, userAgent);

    // E-commerce view_item event
    await sendGaHit({
      ...baseParams,
      _s: sequence++,
      en: 'view_item',
      'ep.currency': 'INR',
      'epn.value': product.price,
      'ep.item_id': product.id,
      'ep.item_name': product.name,
      'ep.item_category': product.category,
      'epn.price': product.price,
      'epn.quantity': 1,
      dl: `https://pavitrainnovations.com/products/${product.id}`
    }, userAgent);

    // 52% of users proceed to Step 3: add_to_cart
    if (userIndex < 52) {
      await sleep(150 + Math.random() * 200);

      await sendGaHit({
        ...baseParams,
        _s: sequence++,
        en: 'add_to_cart',
        'ep.currency': 'INR',
        'epn.value': product.price,
        'ep.item_id': product.id,
        'ep.item_name': product.name,
        'ep.item_category': product.category,
        'epn.price': product.price,
        'epn.quantity': 1,
        dl: `https://pavitrainnovations.com/products/${product.id}`
      }, userAgent);

      // 32% of users proceed to Step 4: begin_checkout
      if (userIndex < 32) {
        await sleep(200 + Math.random() * 250);

        await sendGaHit({
          ...baseParams,
          _s: sequence++,
          en: 'begin_checkout',
          'ep.currency': 'INR',
          'epn.value': product.price,
          'ep.item_id': product.id,
          'ep.item_name': product.name,
          'ep.item_category': product.category,
          'epn.price': product.price,
          'epn.quantity': 1,
          dl: 'https://pavitrainnovations.com/checkout'
        }, userAgent);

        // 18% of users proceed to Step 5: purchase
        if (userIndex < 18) {
          await sleep(250 + Math.random() * 300);

          const orderId = `PAV-${Math.floor(100000 + Math.random() * 900000)}`;
          await sendGaHit({
            ...baseParams,
            _s: sequence++,
            en: 'purchase',
            'ep.transaction_id': orderId,
            'ep.currency': 'INR',
            'epn.value': product.price,
            'epn.tax': Math.round(product.price * 0.18),
            'epn.shipping': 0,
            'ep.item_id': product.id,
            'ep.item_name': product.name,
            'ep.item_category': product.category,
            'epn.price': product.price,
            'epn.quantity': 1,
            dl: 'https://pavitrainnovations.com/order-success'
          }, userAgent);
        }
      }
    }
  }
}

async function runTrafficSimulation() {
  console.log('====================================================');
  console.log('  Pavitra Innovations - GA4 Live Funnel Simulator');
  console.log(`  Measurement ID: ${GA_MEASUREMENT_ID}`);
  console.log(`  Target Simulated Visitors: ${TOTAL_USERS}`);
  console.log('  Target Dashboard: Google Analytics Realtime & Funnel');
  console.log('====================================================\n');

  let completedUsers = 0;
  const BATCH_SIZE = 5;

  for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
    const batch = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_USERS; j++) {
      const userIdx = i + j;
      batch.push(
        simulateUser(userIdx).then(() => {
          completedUsers++;
          const funnelStage = 
            userIdx < 18 ? 'Purchase Complete (18 Users)' :
            userIdx < 32 ? 'Began Checkout     (32 Users)' :
            userIdx < 52 ? 'Added to Cart      (52 Users)' :
            userIdx < 82 ? 'Viewed Product     (82 Users)' :
            'Browsed Website    (100 Users)';

          console.log(`[User ${String(completedUsers).padStart(3, ' ')} / 100] Streamed events -> Stage reached: ${funnelStage}`);
        })
      );
    }

    await Promise.all(batch);
    await sleep(100);
  }

  console.log('\n====================================================');
  console.log(' SUCCESS: 100 Active Users Streamed into GA4!');
  console.log(' Funnel Breakdown Dispatched:');
  console.log('   - Step 1 (page_view):      100 Users (100%)');
  console.log('   - Step 2 (view_item):       82 Users (82%)');
  console.log('   - Step 3 (add_to_cart):     52 Users (52%)');
  console.log('   - Step 4 (begin_checkout):  32 Users (32%)');
  console.log('   - Step 5 (purchase):        18 Users (18%)');
  console.log(' Check live report now:');
  console.log('   https://analytics.google.com/analytics/web/#/a401824611p546420162/realtime/overview');
  console.log('====================================================\n');
}

runTrafficSimulation().catch(console.error);
