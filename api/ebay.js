export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ error: 'keyword required' });

  const EBAY_APP_ID = process.env.EBAY_APP_ID;
  
  const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${EBAY_APP_ID}&RESPONSE-DATA-FORMAT=JSON&keywords=${encodeURIComponent(keyword)}&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value=true&paginationInput.entriesPerPage=5`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const items = data?.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item || [];
    const prices = items.map(i => parseFloat(i?.sellingStatus?.[0]?.currentPrice?.[0]?.["__value__"] || 0)).filter(p => p > 0);
    const avg = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
    res.json({ keyword, avgUsd: avg, count: prices.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
