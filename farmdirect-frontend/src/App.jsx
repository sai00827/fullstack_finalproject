import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { heroImage, categoryImage } from "./assets/produceImages";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const emptyProduct = { name: "", category: "vegetables", pricePerKg: "", quantityKg: "", location: "", farmerName: "", description: "" };
const emptyOrder = { buyerName: "", buyerPhone: "", quantityKg: "", deliveryNote: "" };
const categories = ["all", "vegetables", "fruits", "grains", "pulses", "oils", "dairy", "groceries"];
const categoryLabels = { all: "All", vegetables: "Vegetables", fruits: "Fruits", grains: "Grains", pulses: "Pulses", oils: "Oils", dairy: "Dairy", groceries: "Groceries" };

function quintal(rateKg) {
  return Math.round(Number(rateKg || 0) * 100);
}

function availability(qty) {
  const q = Number(qty || 0);
  if (q <= 0) return { code: "OUT", label: "OUT OF STOCK" };
  if (q <= 10) return { code: "LOW", label: `LOW STOCK / ${q} KG LEFT` };
  return { code: "OPEN", label: `IN STOCK / ${q} KG` };
}

function App() {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("farmdirect-cart") || "[]"); }
    catch { return []; }
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("default");
  const [slide, setSlide] = useState(0);
  const [listingOpen, setListingOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { localStorage.setItem("farmdirect-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { const timer = setInterval(() => setSlide((value) => (value + 1) % 3), 7000); return () => clearInterval(timer); }, []);
  useEffect(() => { loadProducts(); }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [message]);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to load products");
      setProducts(result.data.filter((p) => p.quantityKg > 0 && p.status !== "sold_out"));
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  }
  function changeProduct(e) { setProductForm({ ...productForm, [e.target.name]: e.target.value }); }
  function changeOrder(e) { setOrderForm({ ...orderForm, [e.target.name]: e.target.value }); }
  function goTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: "auto" }); }
  function addToCart(product) {
    setCart((items) => {
      const old = items.find((item) => item._id === product._id);
      if (old) return items.map((item) => item._id === product._id ? { ...item, cartQuantity: Math.min(item.cartQuantity + 1, product.quantityKg) } : item);
      return [...items, { ...product, cartQuantity: 1 }];
    });
    setMessage(`${product.name} entered on the order chit.`);
  }
  function orderFor(product) {
    setSelectedProduct(product);
    setOrderForm({ ...emptyOrder, quantityKg: 1 });
    setOrderOpen(true);
  }
  function callFarmer(product) {
    setMessage(`Ask for ${product.farmerName || "the grower"} at ${product.location || "the village"} re: ${product.name}. Phone is shared when the grower confirms.`);
  }
  function changeCartQuantity(id, amount) {
    setCart((items) => items.map((item) => item._id === id ? { ...item, cartQuantity: Math.max(0, Math.min(item.cartQuantity + amount, item.quantityKg)) } : item).filter((item) => item.cartQuantity > 0));
  }
  function removeFromCart(id) { setCart((items) => items.filter((item) => item._id !== id)); }
  async function addProduct(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...productForm, pricePerKg: Number(productForm.pricePerKg), quantityKg: Number(productForm.quantityKg) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add product");
      setMessage("Lot recorded in the manifest.");
      setProductForm(emptyProduct);
      setListingOpen(false);
      loadProducts();
    } catch (error) { setMessage(error.message); }
  }
  async function placeOrder(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product: selectedProduct._id, buyerName: orderForm.buyerName, buyerPhone: orderForm.buyerPhone, quantityKg: Number(orderForm.quantityKg), deliveryNote: orderForm.deliveryNote }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Order failed");
      setMessage(`Order sent. Total Rs.${result.data.totalAmount}. The grower confirms next.`);
      setOrderOpen(false);
      setSelectedProduct(null);
      setOrderForm(emptyOrder);
      removeFromCart(selectedProduct._id);
      loadProducts();
    } catch (error) { setMessage(error.message); }
  }

  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => (p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())) && (category === "all" || p.category === category) && p.pricePerKg <= maxPrice && (!organicOnly || (p.description || "").toLowerCase().includes("organic")));
    if (sort === "low") list = [...list].sort((a, b) => a.pricePerKg - b.pricePerKg);
    if (sort === "high") list = [...list].sort((a, b) => b.pricePerKg - a.pricePerKg);
    return list;
  }, [products, search, category, maxPrice, organicOnly, sort]);

  const board = useMemo(() => {
    if (visibleProducts.length === 0) return { low: 0, high: 0, avg: 0, kilos: 0 };
    const rates = visibleProducts.map((p) => Number(p.pricePerKg));
    return {
      low: Math.min(...rates),
      high: Math.max(...rates),
      avg: Math.round(rates.reduce((s, r) => s + r, 0) / rates.length),
      kilos: Math.round(visibleProducts.reduce((s, p) => s + Number(p.quantityKg || 0), 0)),
    };
  }, [visibleProducts]);

  const fairRows = useMemo(() => {
    return categories.slice(1).map((c) => {
      const lots = products.filter((p) => p.category === c);
      if (lots.length === 0) return { cat: c, lots: 0, low: null, high: null, avg: null, kilos: 0 };
      const rates = lots.map((p) => Number(p.pricePerKg));
      return {
        cat: c,
        lots: lots.length,
        low: Math.min(...rates),
        high: Math.max(...rates),
        avg: Math.round(rates.reduce((s, r) => s + r, 0) / rates.length),
        kilos: Math.round(lots.reduce((s, p) => s + Number(p.quantityKg || 0), 0)),
      };
    });
  }, [products]);

  const trendRows = useMemo(() => {
    const priced = fairRows.filter((r) => r.avg !== null);
    if (priced.length === 0) return [];
    const base = priced.reduce((s, r) => s + r.avg, 0) / priced.length;
    return priced.map((r) => ({ cat: r.cat, avg: r.avg, diff: Math.round(r.avg - base), kilos: r.kilos })).sort((a, b) => b.kilos - a.kilos).slice(0, 5);
  }, [fairRows]);

  const villages = useMemo(() => new Set(products.map((p) => (p.location || "").toLowerCase()).filter(Boolean)).size, [products]);
  const cartTotal = cart.reduce((sum, item) => sum + item.pricePerKg * item.cartQuantity, 0);
  const cartKilos = cart.reduce((sum, item) => sum + Number(item.cartQuantity || 0), 0);
  const today = useMemo(() => new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), []);

  const bulletins = [
    { no: "BULLETIN 01", title: "Morning intake is on the board.", text: "Each lot carries grower, village, rate per kilo and kilos left. The rate printed on the row is the rate paid." },
    { no: "BULLETIN 02", title: "Take kilos, not truckloads.", text: "Two kilos or two quintals. Collect at the farm gate or settle delivery with the grower directly." },
    { no: "BULLETIN 03", title: "Rows close at zero.", text: "Kilos fall as orders land. When a lot hits zero it leaves the board. Read again through the week." },
  ];
  const bulletin = bulletins[slide];

  return (
    <div className="fd">
      <div className="fd-manifest">
        <span>MANIFEST NO. 001</span>
        <span className="fd-manifest-mid">{today.toUpperCase()}</span>
        <span>LOTS LIVE: {String(products.length).padStart(2, "0")} / VILLAGES: {String(villages).padStart(2, "0")}</span>
      </div>

      <header className="fd-header">
        <div className="fd-masthead">
          <button className="fd-menu" onClick={() => goTo("board")} aria-label="Go to trading board"><Menu size={22} /></button>
          <button className="fd-brand" onClick={() => window.scrollTo({ top: 0 })}>
            <span className="fd-stamp">FD</span>
            <span className="fd-brand-text">
              <span className="fd-brand-name">FarmDirect</span>
              <span className="fd-brand-sub">MANDI LEDGER / GROWER TO BUYER</span>
            </span>
          </button>
          <div className="fd-search">
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Crop or village, e.g. tomato" aria-label="Search crop or village" />
            <button onClick={() => goTo("board")}>FIND</button>
          </div>
          <div className="fd-head-actions">
            <button className="fd-cart" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={18} /> CHIT [{cart.length}] / {cartKilos} KG
            </button>
            <button className="fd-sell" onClick={() => setListingOpen(true)}>SELL PRODUCE</button>
          </div>
        </div>
        <nav className="fd-nav" aria-label="Crop sections">
          {categories.map((item, i) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); goTo("board"); }}>
              <em>{String(i).padStart(2, "0")}</em> {categoryLabels[item].toUpperCase()}
            </button>
          ))}
          <button className="fd-nav-right" onClick={() => goTo("prices")}>FAIR PRICE TABLE</button>
        </nav>
      </header>

      <div className="fd-strip" role="status">
        <span>BASIS: RS. PER KG / PER QUINTAL</span>
        <span>BOARD: {loading ? "READING" : `${visibleProducts.length} LOTS OPEN / ${board.kilos} KG LISTED`}</span>
        <span className="fd-strip-right">NO MIDDLEMAN / RATES SET BY GROWERS</span>
      </div>

      <main className="fd-page">
        <section className="fd-bulletin">
          <div className="fd-bulletin-main">
            <p className="fd-kicker">MARKET BULLETIN / {bulletin.no}</p>
            <h1>Produce with a name and a village on it.</h1>
            <p className="fd-standfirst">A dense working board for wholesale and household buyers. Read rate, stock, grower and location. Then place the order or call the farm.</p>
            <table className="fd-table fd-compact">
              <tbody>
                <tr><th>BASIS</th><td>Rs. per KG and Rs. per quintal, fixed on each cargo row</td></tr>
                <tr><th>HANDOVER</th><td>Farm gate pickup, or delivery settled with the grower</td></tr>
                <tr><th>PAYMENT</th><td>Settled with the grower at handover, not on this page</td></tr>
              </tbody>
            </table>
            <div className="fd-actions">
              <button className="fd-btn-solid" onClick={() => goTo("board")}>OPEN TRADING BOARD <ArrowRight size={18} /></button>
              <button className="fd-btn-line" onClick={() => setListingOpen(true)}>RECORD A LOT</button>
            </div>
            <div className="fd-bul-switch">
              <button onClick={() => setSlide((slide + 2) % 3)} aria-label="Previous bulletin"><ChevronLeft size={18} /></button>
              <span>{bulletin.no} / 03</span>
              <button onClick={() => setSlide((slide + 1) % 3)} aria-label="Next bulletin"><ChevronRight size={18} /></button>
              <strong>{bulletin.title}</strong>
            </div>
            <p className="fd-bul-text">{bulletin.text}</p>
          </div>
          <figure className="fd-dispatch">
            <div className="fd-dispatch-frame">
              <img src={heroImage} alt="Stacked crates of harvested vegetables at a farm collection shed" />
              <span className="fd-dispatch-tag">DISPATCH PHOTO / SELLER FILED</span>
            </div>
            <figcaption>FIG. 01 / MORNING INTAKE, COLLECTION SHED. WEIGHED BEFORE LOADING.</figcaption>
            <p className="fd-handnote">weighed at dawn, before the sun is up — R.</p>
          </figure>
        </section>
        <div className="fd-fieldrows" aria-hidden="true" />

        <section className="fd-trade" id="board">
          <div className="fd-trade-head">
            <div>
              <p className="fd-kicker">TRADING BOARD</p>
              <h2>Cargo on the floor</h2>
            </div>
            <p className="fd-board-count">{loading ? "READING LEDGER" : `${String(visibleProducts.length).padStart(2, "0")} LOTS / ${board.kilos} KG`}</p>
          </div>

          <div className="fd-filterbar" role="search">
            <label>SEARCH<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Crop or village" aria-label="Search crop or village" /></label>
            <label>SECTION
              <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Crop section">
                {categories.map((item) => <option key={item} value={item}>{categoryLabels[item]}</option>)}
              </select>
            </label>
            <label>SORT
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort lots">
                <option value="default">Entry order</option>
                <option value="low">Rate: low to high</option>
                <option value="high">Rate: high to low</option>
              </select>
            </label>
            <label className="fd-ceil">CEILING RS.{maxPrice}/KG
              <input type="range" min="10" max="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Maximum rate per kilo" />
            </label>
            <button className={`fd-check ${organicOnly ? "on" : ""}`} onClick={() => setOrganicOnly(!organicOnly)} aria-pressed={organicOnly}>
              <span className="fd-box">{organicOnly ? "X" : ""}</span> ORGANIC ONLY
            </button>
          </div>

          <div className="fd-trade-grid">
            <div className="fd-cargo">
              {loading ? (
                <p className="fd-empty">READING THE LEDGER...</p>
              ) : visibleProducts.length === 0 ? (
                <p className="fd-empty">NO CARGO MATCHES THOSE LINES. LOOSEN ONE FILTER AND READ AGAIN.</p>
              ) : (
                visibleProducts.map((product, i) => {
                  const av = availability(product.quantityKg);
                  return (
                    <article className="fd-crate" key={product._id}>
                      <div className="fd-crate-photo">
                        <img src={categoryImage(product.category)} alt={`${product.name}, harvested lot`} loading="lazy" />
                        <span className={`fd-avail ${av.code}`}>{av.label}</span>
                        <span className="fd-lotno">LOT {String(i + 1).padStart(3, "0")}</span>
                      </div>
                      <div className="fd-crate-body">
                        <p className="fd-crate-cat">{(categoryLabels[product.category] || product.category).toUpperCase()}</p>
                        <h3>{product.name}</h3>
                        <p className="fd-crate-line"><MapPin size={15} /> {(product.location || "Village pending").toUpperCase()}</p>
                        <p className="fd-crate-line">GROWER: <strong>{(product.farmerName || "Not listed").toUpperCase()}</strong></p>
                        <div className="fd-ratebox">
                          <div><span>PER KG</span><strong>Rs.{product.pricePerKg}</strong></div>
                          <div><span>PER QUINTAL</span><strong>Rs.{quintal(product.pricePerKg)}</strong></div>
                          <div><span>STOCK</span><strong>{product.quantityKg} KG</strong></div>
                        </div>
                        <div className="fd-crate-actions">
                          <button className="fd-order" onClick={() => orderFor(product)}>PLACE ORDER</button>
                          <button className="fd-call" onClick={() => callFarmer(product)}><Phone size={16} /> CALL FARMER</button>
                        </div>
                        <button className="fd-chit-add" onClick={() => addToCart(product)}>+ ADD TO ORDER CHIT</button>
                      </div>
                    </article>
                  );
                })
              )}
              <p className="fd-fine">Rates and kilos are written by sellers. This board stores order requests only. No payment is taken on this page.</p>
            </div>

            <aside className="fd-rail">
              <div className="fd-panel">
                <p className="fd-panel-title">ORDER CHIT / LIVE</p>
                {cart.length === 0 ? (
                  <p className="fd-panel-empty">Chit is blank. Add cargo rows to start a transaction.</p>
                ) : (
                  <>
                    {cart.slice(0, 5).map((item) => (
                      <div className="fd-chit-row" key={item._id}>
                        <span>{item.name}<em> / {item.cartQuantity} KG</em></span>
                        <strong>Rs.{(item.pricePerKg * item.cartQuantity).toFixed(0)}</strong>
                      </div>
                    ))}
                    {cart.length > 5 && <p className="fd-panel-empty">+ {cart.length - 5} MORE LINES ON THE CHIT</p>}
                    <p className="fd-chit-total">TOTAL Rs.{cartTotal.toFixed(2)} / {cartKilos} KG</p>
                    <button className="fd-btn-solid full" onClick={() => setCartOpen(true)}>OPEN FULL CHIT</button>
                  </>
                )}
              </div>

              <div className="fd-panel" id="prices">
                <p className="fd-panel-title">FAIR PRICE TABLE / RS. PER KG</p>
                <table className="fd-table">
                  <thead>
                    <tr><th>CROP</th><th>LOTS</th><th>LOW-HIGH</th><th>AVG</th></tr>
                  </thead>
                  <tbody>
                    {fairRows.map((r) => (
                      <tr key={r.cat} className={category === r.cat ? "hit" : ""} onClick={() => { setCategory(r.cat); goTo("board"); }}>
                        <td className="fd-td-crop">{categoryLabels[r.cat].toUpperCase()}</td>
                        <td>{r.lots || "--"}</td>
                        <td>{r.low !== null ? `Rs.${r.low}-${r.high}` : "--"}</td>
                        <td><strong>{r.avg !== null ? `Rs.${r.avg}` : "--"}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="fd-panel">
                <p className="fd-panel-title">STOCK MOVEMENT / TOP 5 BY KILOS</p>
                <table className="fd-table">
                  <thead>
                    <tr><th>CROP</th><th>AVG</th><th>VS BOARD</th><th>KILOS</th></tr>
                  </thead>
                  <tbody>
                    {trendRows.length === 0 && <tr><td colSpan="4">No priced lots yet.</td></tr>}
                    {trendRows.map((r) => (
                      <tr key={r.cat}>
                        <td className="fd-td-crop">{categoryLabels[r.cat].toUpperCase()}</td>
                        <td>Rs.{r.avg}</td>
                        <td className={r.diff >= 0 ? "up" : "down"}>{r.diff >= 0 ? `+Rs.${r.diff}` : `-Rs.${Math.abs(r.diff)}`}</td>
                        <td>{r.kilos} KG</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="fd-panel-note">VS BOARD compares each crop average against the mean of all crop averages. Read it as position, not advice.</p>
              </div>
            </aside>
          </div>
        </section>

        <div className="fd-fieldrows" aria-hidden="true" />

        <section className="fd-how" id="how">
          <p className="fd-kicker">PROCEDURE / READ ONCE</p>
          <div className="fd-how-table">
            <div><b>STEP 1</b><div><strong>Read the cargo row.</strong><span>Rate per KG and per quintal, kilos left, village, grower. All four print before you commit.</span></div></div>
            <div><b>STEP 2</b><div><strong>Place order or call.</strong><span>Send an order request with kilos, or call the farm line noted on the chit.</span></div></div>
            <div><b>STEP 3</b><div><strong>Settle at handover.</strong><span>The grower confirms. Collect at the gate or fix delivery. Pay the grower.</span></div></div>
          </div>
        </section>

        <section className="fd-mail">
          <div>
            <p className="fd-kicker light">WEEKLY SLIP</p>
            <h2>What came in. What ran out.</h2>
            <p className="fd-mail-sub">One short slip most weeks. No codes, no offers.</p>
          </div>
          <form className="fd-mail-form" onSubmit={(e) => { e.preventDefault(); setMessage("Name taken down. This slip is a prototype."); }}>
            <input placeholder="you@example.com" type="email" aria-label="Email address" required />
            <button type="submit">POST IT</button>
          </form>
        </section>
      </main>

      <footer className="fd-footer">
        <div>
          <p className="fd-foot-brand"><span className="fd-stamp sm">FD</span> FarmDirect</p>
          <p className="fd-foot-small">A short road between farm and kitchen. Student prototype. Orders are written to a database. No money moves on this page.</p>
        </div>
        <div>
          <h4>BOARD</h4>
          <button onClick={() => { setCategory("all"); goTo("board"); }}>All lots</button>
          <button onClick={() => { setCategory("vegetables"); goTo("board"); }}>Vegetables</button>
          <button onClick={() => { setCategory("grains"); goTo("board"); }}>Grains</button>
        </div>
        <div>
          <h4>GROWERS</h4>
          <button onClick={() => setListingOpen(true)}>Record a lot</button>
          <button onClick={() => goTo("how")}>Procedure</button>
        </div>
        <div>
          <h4>RECORD</h4>
          <p className="fd-foot-small">Manifest vol. 01. Rates by sellers. Rows close at zero.</p>
        </div>
      </footer>

      {listingOpen && (
        <div className="fd-modal-bg" onClick={(e) => e.target === e.currentTarget && setListingOpen(false)}>
          <div className="fd-modal" role="dialog" aria-label="Record a lot">
            <div className="fd-modal-head"><h2>Record a lot</h2><button onClick={() => setListingOpen(false)} aria-label="Close"><X size={20} /></button></div>
            <p className="fd-modal-sub">WRITES TO THE MANIFEST THROUGH THE BACKEND. STARRED FIELDS ARE REQUIRED.</p>
            <form onSubmit={addProduct}>
              <div className="fd-field"><label>CROP NAME *</label><input name="name" value={productForm.name} onChange={changeProduct} required /></div>
              <div className="fd-field-row">
                <div className="fd-field"><label>CROP TYPE</label><select name="category" value={productForm.category} onChange={changeProduct}>{categories.slice(1).map((item) => <option key={item} value={item}>{categoryLabels[item]}</option>)}</select></div>
                <div className="fd-field"><label>RATE RS/KG *</label><input name="pricePerKg" type="number" min="0.01" step="0.01" value={productForm.pricePerKg} onChange={changeProduct} required /></div>
              </div>
              <div className="fd-field-row">
                <div className="fd-field"><label>KILOS *</label><input name="quantityKg" type="number" min="0.01" step="0.01" value={productForm.quantityKg} onChange={changeProduct} required /></div>
                <div className="fd-field"><label>VILLAGE *</label><input name="location" value={productForm.location} onChange={changeProduct} required /></div>
              </div>
              <div className="fd-field"><label>GROWER NAME *</label><input name="farmerName" value={productForm.farmerName} onChange={changeProduct} required /></div>
              <div className="fd-field"><label>FIELD NOTE</label><textarea name="description" value={productForm.description} onChange={changeProduct} placeholder="Harvest date, organic or not, pickup point" /></div>
              <button className="fd-btn-solid full" type="submit">WRITE TO MANIFEST</button>
            </form>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="fd-modal-bg" onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}>
          <div className="fd-modal" role="dialog" aria-label="Order chit">
            <div className="fd-modal-head"><h2>Order chit [{cart.length}]</h2><button onClick={() => setCartOpen(false)} aria-label="Close"><X size={20} /></button></div>
            {cart.length === 0 ? (
              <p className="fd-modal-sub">CHIT IS BLANK. ADD CARGO FROM THE BOARD.</p>
            ) : (
              <>
                <table className="fd-table">
                  <thead><tr><th>LOT</th><th>KG</th><th>RATE</th><th>AMOUNT</th><th></th></tr></thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id}>
                        <td className="fd-td-crop">{item.name.toUpperCase()}</td>
                        <td>
                          <button className="fd-qty" onClick={() => changeCartQuantity(item._id, -1)} aria-label="Reduce kilos">-</button>
                          <strong> {item.cartQuantity} </strong>
                          <button className="fd-qty" onClick={() => changeCartQuantity(item._id, 1)} aria-label="Add a kilo">+</button>
                        </td>
                        <td>Rs.{item.pricePerKg}</td>
                        <td><strong>Rs.{(item.pricePerKg * item.cartQuantity).toFixed(2)}</strong></td>
                        <td><button className="fd-drop" onClick={() => removeFromCart(item._id)}>DROP</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="fd-total">TOTAL Rs.{cartTotal.toFixed(2)} / {cartKilos} KG</p>
                <button className="fd-btn-solid full" onClick={() => { setCartOpen(false); if (cart[0]) { setSelectedProduct(cart[0]); setOrderForm({ ...emptyOrder, quantityKg: cart[0].cartQuantity }); setOrderOpen(true); } }}>ORDER FIRST LOT ON CHIT</button>
              </>
            )}
          </div>
        </div>
      )}

      {orderOpen && selectedProduct && (
        <div className="fd-modal-bg" onClick={(e) => e.target === e.currentTarget && setOrderOpen(false)}>
          <div className="fd-modal" role="dialog" aria-label="Place order">
            <div className="fd-modal-head"><h2>Place order</h2><button onClick={() => setOrderOpen(false)} aria-label="Close"><X size={20} /></button></div>
            <p className="fd-modal-sub">{selectedProduct.name.toUpperCase()} / RS.{selectedProduct.pricePerKg} PER KG / RS.{quintal(selectedProduct.pricePerKg)} PER QUINTAL / {selectedProduct.quantityKg} KG LEFT</p>
            <form onSubmit={placeOrder}>
              <div className="fd-field"><label>YOUR NAME *</label><input name="buyerName" value={orderForm.buyerName} onChange={changeOrder} required /></div>
              <div className="fd-field"><label>PHONE *</label><input name="buyerPhone" type="tel" value={orderForm.buyerPhone} onChange={changeOrder} required /></div>
              <div className="fd-field"><label>KILOS *</label><input name="quantityKg" type="number" min="0.01" max={selectedProduct.quantityKg} step="0.01" value={orderForm.quantityKg} onChange={changeOrder} required /></div>
              <div className="fd-field"><label>NOTE FOR GROWER</label><textarea name="deliveryNote" value={orderForm.deliveryNote} onChange={changeOrder} /></div>
              <button className="fd-btn-solid full" type="submit">SEND ORDER REQUEST</button>
            </form>
          </div>
        </div>
      )}

      {message && <div className="fd-toast" role="status">{message}</div>}
    </div>
  );
}

export default App;
