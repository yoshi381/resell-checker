import { useState, useCallback } from "react";

// ── グローバルスタイル ──────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=Noto+Sans+JP:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0a0a0f;
      --surface:  #12121a;
      --border:   #1e1e2e;
      --accent:   #ff3e3e;
      --gold:     #ffd166;
      --green:    #06d6a0;
      --text:     #e8e8f0;
      --muted:    #5a5a7a;
      --font-head: 'Bebas Neue', sans-serif;
      --font-mono: 'IBM Plex Mono', monospace;
      --font-body: 'Noto Sans JP', sans-serif;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* スキャンラインオーバーレイ */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.015) 2px,
        rgba(255,255,255,0.015) 4px
      );
      pointer-events: none;
      z-index: 9999;
    }

    .app-wrapper {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px 80px;
    }

    /* ── ヘッダー ── */
    .header {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 48px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
    }
    .header-logo {
      font-family: var(--font-head);
      font-size: clamp(42px, 8vw, 72px);
      line-height: 1;
      color: var(--accent);
      letter-spacing: 2px;
      text-shadow: 0 0 40px rgba(255,62,62,0.4);
    }
    .header-sub {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 3px;
      text-transform: uppercase;
      padding-bottom: 8px;
    }
    .header-badge {
      margin-left: auto;
      background: var(--accent);
      color: #fff;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 2px;
      padding: 4px 10px;
      border-radius: 2px;
      align-self: center;
      animation: blink 2s steps(1) infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* ── 検索エリア ── */
    .search-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 28px;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }
    .search-panel::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), transparent);
    }
    .search-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .search-row {
      display: flex;
      gap: 12px;
    }
    .search-input {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 3px;
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 15px;
      padding: 14px 18px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(255,62,62,0.1);
    }
    .search-input::placeholder { color: var(--muted); }
    .search-btn {
      background: var(--accent);
      border: none;
      border-radius: 3px;
      color: #fff;
      cursor: pointer;
      font-family: var(--font-head);
      font-size: 18px;
      letter-spacing: 2px;
      padding: 0 28px;
      transition: opacity 0.2s, transform 0.1s;
      white-space: nowrap;
    }
    .search-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
    .search-btn:active:not(:disabled) { transform: translateY(0); }
    .search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── ローディング ── */
    .loading-box {
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 40px;
      text-align: center;
    }
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--muted);
      letter-spacing: 3px;
    }
    .loading-dots::after {
      content: '';
      animation: dots 1.4s steps(4) infinite;
    }
    @keyframes dots {
      0%   { content: ''; }
      25%  { content: '.'; }
      50%  { content: '..'; }
      75%  { content: '...'; }
      100% { content: ''; }
    }

    /* ── エラー ── */
    .error-box {
      border: 1px solid var(--accent);
      border-radius: 4px;
      padding: 20px 24px;
      background: rgba(255,62,62,0.05);
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--accent);
    }

    /* ── 結果カード ── */
    .results-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .results-title {
      font-family: var(--font-head);
      font-size: 26px;
      letter-spacing: 2px;
      color: var(--text);
    }
    .results-count {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 2px;
    }

    .item-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      margin-bottom: 16px;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
      animation: slideIn 0.3s ease both;
    }
    .item-card:hover {
      border-color: #2e2e4e;
      transform: translateY(-2px);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      border-bottom: 1px solid var(--border);
    }
    .rank-badge {
      font-family: var(--font-head);
      font-size: 28px;
      color: var(--muted);
      min-width: 36px;
    }
    .rank-badge.top { color: var(--gold); }
    .item-name {
      flex: 1;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.4;
    }
    .profit-chip {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 2px;
      white-space: nowrap;
    }
    .profit-chip.positive {
      background: rgba(6,214,160,0.15);
      color: var(--green);
      border: 1px solid rgba(6,214,160,0.3);
    }
    .profit-chip.negative {
      background: rgba(255,62,62,0.1);
      color: var(--accent);
      border: 1px solid rgba(255,62,62,0.2);
    }

    .card-body {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0;
    }
    .price-cell {
      padding: 16px 20px;
      border-right: 1px solid var(--border);
    }
    .price-cell:last-child { border-right: none; }
    .price-cell-label {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--muted);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .price-cell-value {
      font-family: var(--font-mono);
      font-size: 18px;
      font-weight: 600;
    }
    .price-cell-value.mercari { color: #ff4f7b; }
    .price-cell-value.ebay    { color: var(--gold); }
    .price-cell-value.margin  { color: var(--green); }
    .price-cell-value.margin.neg { color: var(--accent); }
    .price-cell-sub {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--muted);
      margin-top: 3px;
    }

    /* マージン率バー */
    .margin-bar-wrap {
      padding: 0 20px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .margin-bar-track {
      flex: 1;
      height: 4px;
      background: var(--border);
      border-radius: 99px;
      overflow: hidden;
    }
    .margin-bar-fill {
      height: 100%;
      border-radius: 99px;
      transition: width 0.6s ease;
    }
    .margin-pct {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      min-width: 44px;
      text-align: right;
    }

    /* アドバイス */
    .card-advice {
      padding: 12px 20px;
      background: rgba(255,255,255,0.02);
      font-size: 12px;
      color: var(--muted);
      border-top: 1px solid var(--border);
      line-height: 1.6;
    }
    .card-advice .tag {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 1px;
      padding: 2px 6px;
      border-radius: 2px;
      margin-right: 8px;
    }
    .tag.buy  { background: rgba(6,214,160,0.2); color: var(--green); }
    .tag.skip { background: rgba(255,62,62,0.1); color: var(--accent); }
    .tag.watch{ background: rgba(255,209,102,0.15); color: var(--gold); }

    /* サマリー */
    .summary-panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 24px;
      margin-top: 32px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .summary-stat { text-align: center; }
    .summary-stat-value {
      font-family: var(--font-head);
      font-size: 32px;
      line-height: 1;
      margin-bottom: 6px;
    }
    .summary-stat-label {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--muted);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    /* ── フッター注意書き ── */
    .disclaimer {
      margin-top: 48px;
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--muted);
      line-height: 1.8;
      border-top: 1px solid var(--border);
      padding-top: 20px;
    }

    @media (max-width: 600px) {
      .card-body { grid-template-columns: 1fr; }
      .price-cell { border-right: none; border-bottom: 1px solid var(--border); }
      .summary-panel { grid-template-columns: 1fr; }
      .search-row { flex-direction: column; }
    }
  `}</style>
);

// ── ユーティリティ ──────────────────────────────────────────────────
const JPY_PER_USD = 149; // 固定レート（表示用）

function formatJPY(n) {
  return `¥${Math.round(n).toLocaleString()}`;
}
function formatUSD(n) {
  return `$${n.toFixed(2)}`;
}
function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

// ── Claude API 呼び出し ────────────────────────────────────────────
async function analyzeWithClaude(keyword) {
  const prompt = `あなたは日本の転売リサーチAIです。

ユーザーが「${keyword}」というキーワードで転売リサーチをしています。

以下のJSONフォーマットのみで回答してください（余計なテキスト・Markdownコードブロック不要）:

{
  "items": [
    {
      "name": "商品名（具体的に）",
      "mercari_jpy": 数値（メルカリ相場価格 JPY）,
      "ebay_usd": 数値（eBay相場価格 USD）,
      "condition": "状態（新品/中古良/中古可など）",
      "advice": "転売アドバイス（1〜2文）",
      "demand": "high|medium|low"
    }
  ],
  "exchange_rate": 149,
  "summary": "全体的な転売市場の所見（1〜2文）"
}

- itemsは3〜5件生成してください
- 価格は実際の相場に近い現実的な数値にしてください
- eBay価格は送料・手数料込みの落札想定価格にしてください
- 利益率が高いものから順に並べてください
- JSONのみ出力してください`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  // JSON抽出（コードブロックがあっても対応）
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── アイテムカード ────────────────────────────────────────────────
function ItemCard({ item, index, exchangeRate }) {
  const ebayJPY = item.ebay_usd * exchangeRate;
  // eBay手数料・送料を引いた実手取り（約73%が実収）
  const netJPY = ebayJPY * 0.73;
  const profitJPY = netJPY - item.mercari_jpy;
  const marginPct = (profitJPY / netJPY) * 100;
  const isPositive = profitJPY > 0;

  const barColor = isPositive
    ? marginPct > 30
      ? "var(--green)"
      : "var(--gold)"
    : "var(--accent)";
  const barWidth = isPositive
    ? `${clamp(marginPct, 0, 100)}%`
    : "0%";

  let tag = "watch";
  let tagLabel = "WATCH";
  if (isPositive && marginPct > 20) { tag = "buy"; tagLabel = "BUY"; }
  else if (!isPositive) { tag = "skip"; tagLabel = "SKIP"; }

  return (
    <div className="item-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="card-header">
        <div className={`rank-badge ${index === 0 ? "top" : ""}`}>
          {index === 0 ? "★" : `#${index + 1}`}
        </div>
        <div className="item-name">{item.name}</div>
        <div className={`profit-chip ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? "+" : ""}{formatJPY(profitJPY)}
        </div>
      </div>

      <div className="card-body">
        <div className="price-cell">
          <div className="price-cell-label">MERCARI 仕入れ</div>
          <div className="price-cell-value mercari">{formatJPY(item.mercari_jpy)}</div>
          <div className="price-cell-sub">{item.condition}</div>
        </div>
        <div className="price-cell">
          <div className="price-cell-label">eBay 売値</div>
          <div className="price-cell-value ebay">{formatUSD(item.ebay_usd)}</div>
          <div className="price-cell-sub">≈ {formatJPY(ebayJPY)}</div>
        </div>
        <div className="price-cell">
          <div className="price-cell-label">純利益（手数料後）</div>
          <div className={`price-cell-value margin ${!isPositive ? "neg" : ""}`}>
            {isPositive ? "+" : ""}{formatJPY(profitJPY)}
          </div>
          <div className="price-cell-sub">手取り {formatJPY(netJPY)}</div>
        </div>
      </div>

      <div className="margin-bar-wrap">
        <div className="margin-bar-track">
          <div
            className="margin-bar-fill"
            style={{ width: barWidth, background: barColor }}
          />
        </div>
        <div className="margin-pct">{marginPct.toFixed(1)}%</div>
      </div>

      <div className="card-advice">
        <span className={`tag ${tag}`}>{tagLabel}</span>
        {item.advice}
        {item.demand && (
          <span style={{ marginLeft: 8, opacity: 0.6, fontSize: 11 }}>
            需要: {item.demand === "high" ? "🔥高" : item.demand === "medium" ? "📦中" : "❄低"}
          </span>
        )}
      </div>
    </div>
  );
}

// ── メインApp ─────────────────────────────────────────────────────
export default function App() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeWithClaude(keyword.trim());
      setResult(data);
    } catch (e) {
      setError(e.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // サマリー計算
  const summary = result
    ? (() => {
        const rate = result.exchange_rate || JPY_PER_USD;
        const profits = result.items.map((item) => {
          const netJPY = item.ebay_usd * rate * 0.73;
          return netJPY - item.mercari_jpy;
        });
        const pos = profits.filter((p) => p > 0);
        const best = Math.max(...profits);
        return {
          total: result.items.length,
          profitable: pos.length,
          best: best,
        };
      })()
    : null;

  return (
    <>
      <GlobalStyle />
      <div className="app-wrapper">
        {/* ヘッダー */}
        <header className="header">
          <div>
            <div className="header-logo">転売スカウター</div>
            <div className="header-sub">Mercari → eBay 価格差チェッカー</div>
          </div>
          <div className="header-badge">AI POWERED</div>
        </header>

        {/* 検索パネル */}
        <div className="search-panel">
          <div className="search-label">// キーワード検索</div>
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="例: ポケモンカード、任天堂Switch、ナイキ スニーカー..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="search-btn"
              onClick={handleSearch}
              disabled={loading || !keyword.trim()}
            >
              {loading ? "解析中..." : "SCAN"}
            </button>
          </div>
        </div>

        {/* ローディング */}
        {loading && (
          <div className="loading-box">
            <div className="loading-spinner" />
            <div className="loading-text loading-dots">AI が相場を解析中</div>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="error-box">
            ⚠ エラー: {error}
          </div>
        )}

        {/* 結果 */}
        {result && !loading && (
          <>
            <div className="results-header">
              <div className="results-title">SCAN RESULTS</div>
              <div className="results-count">{result.items.length} ITEMS FOUND</div>
            </div>

            {result.items.map((item, i) => (
              <ItemCard
                key={i}
                item={item}
                index={i}
                exchangeRate={result.exchange_rate || JPY_PER_USD}
              />
            ))}

            {/* サマリー */}
            <div className="summary-panel">
              <div className="summary-stat">
                <div className="summary-stat-value" style={{ color: "var(--text)" }}>
                  {summary.total}
                </div>
                <div className="summary-stat-label">TOTAL ITEMS</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat-value" style={{ color: "var(--green)" }}>
                  {summary.profitable}
                </div>
                <div className="summary-stat-label">PROFITABLE</div>
              </div>
              <div className="summary-stat">
                <div
                  className="summary-stat-value"
                  style={{ color: summary.best > 0 ? "var(--gold)" : "var(--accent)" }}
                >
                  {summary.best > 0 ? "+" : ""}{formatJPY(summary.best)}
                </div>
                <div className="summary-stat-label">BEST PROFIT</div>
              </div>
            </div>

            {result.summary && (
              <div style={{
                marginTop: 16,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--muted)",
                padding: "12px 20px",
                border: "1px solid var(--border)",
                borderRadius: 4,
              }}>
                // AI所見: {result.summary}
              </div>
            )}
          </>
        )}

        {/* 免責 */}
        <div className="disclaimer">
          ⚠ 本ツールはAIが推定した参考価格です。実際の相場と異なる場合があります。<br />
          eBay手数料（最終落札額の約13%）・PayPal手数料・送料・梱包費を差し引いた実収益は表示利益より低くなります。<br />
          投資・転売判断はご自身の責任でお願いします。為替レート: 1 USD ≈ {result?.exchange_rate ?? JPY_PER_USD} JPY（参考値）
        </div>
      </div>
    </>
  );
}
