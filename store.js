/* ADIP store engine — catalog rendering, bag, checkout, orders.
   Everything runs in this store: no step hands the buyer to another site.
   The bag lives in the browser (localStorage "adipbag2"). Orders placed at
   checkout are recorded in the browser ("adiporders2") and confirmed on
   screen with an order number; the payment-capture step activates with the
   studio's own payment account (see SUMMARY.md). */
(function(){
"use strict";
var P = window.ADIP_PRODUCTS || [];
var byId = {}; P.forEach(function(p){ byId[p.id]=p; });
function money(n){ return "$" + n.toLocaleString("en-US"); }
function load(k, d){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }
function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
function bag(){ return load("adipbag2", []); }
function setBag(b){ save("adipbag2", b); paintCount(); }
function bagCount(){ return bag().reduce(function(s,i){ return s + i.qty; }, 0); }
function linePrice(it){ var p = byId[it.id]; if(!p) return 0;
  if (p.type==="print") return (p.ladder && p.ladder[it.variant]) || p.price;
  if (p.type==="deposit") return p.deposit;
  return p.price; }
function lineLabel(it){ var p = byId[it.id]; if(!p) return it.id;
  var v = it.variant ? " · " + it.variant : "";
  var d = p.type==="deposit" ? " · deposit (total " + money(p.price) + ")" : "";
  return p.name + v + d; }
function totals(){ var items = bag();
  var goods = items.reduce(function(s,i){ return s + linePrice(i)*i.qty; }, 0);
  var ship = items.length===0 ? 0 : (goods >= (window.ADIP_FREE_SHIP||200) ? 0 : (window.ADIP_SHIP_FLAT||12));
  return { goods:goods, ship:ship, total:goods+ship, count:bagCount() }; }
function paintCount(){ var n = bagCount();
  document.querySelectorAll(".baglink").forEach(function(a){ a.textContent = "Bag (" + n + ")"; }); }
function addToBag(id, variant, qty){
  var b = bag(); qty = qty || 1;
  var found = null;
  b.forEach(function(i){ if (i.id===id && i.variant===variant) found = i; });
  if (found) found.qty += qty; else b.push({ id:id, variant:variant||"", qty:qty });
  setBag(b); return b; }
function toast(msg){ var t = document.querySelector(".toast");
  if (!t){ t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove("on"); }, 2600); }

/* ---------- catalog tiles (shop + home rails) ---------- */
function tile(p){
  var price = p.type==="print" ? "from " + money(p.price)
            : p.type==="deposit" ? money(p.deposit) + " deposit · " + money(p.price) + " total"
            : money(p.price);
  var media = p.kitCard
    ? '<span class="kitcard"><span class="kcline">12 cards</span><span>6 finished drawings to study<br>6 blank tiles to answer<br>1 fine-liner · the studio guide</span></span>'
    : '<img src="' + p.img + '" alt="' + p.name + ' — hand-drawn by Farhad Rabbany" loading="lazy" width="1000" height="1000">';
  return '<article class="tile"><a class="tilelink" href="product.html?id=' + p.id + '">' + media +
    '<span class="tilemeta"><span class="tilename">' + p.name + '</span>' +
    '<span class="tileprice">' + price + '</span></span></a>' +
    '<button class="tileadd" data-add="' + p.id + '">' +
      (p.type==="sized" || p.type==="print" ? "Choose options" : "Add to bag — " + price.replace("from ","")) +
    '</button></article>';
}
function paintShop(){
  var grid = document.querySelector("[data-shopgrid]"); if (!grid) return;
  var f = grid.getAttribute("data-filter") || "all";
  var list = P.filter(function(p){ return f==="all" || p.cat===f || (f==="under100" && p.price<100); });
  grid.innerHTML = list.map(tile).join("");
  var c = document.querySelector("[data-shopcount]");
  if (c) c.textContent = list.length + (list.length===1 ? " piece" : " pieces");
}
function paintRail(){
  document.querySelectorAll("[data-rail]").forEach(function(r){
    var ids = (r.getAttribute("data-rail")||"").split(",").filter(Boolean);
    r.innerHTML = ids.map(function(id){ return byId[id] ? tile(byId[id]) : ""; }).join("");
  });
}

/* ---------- product page ---------- */
function paintProduct(){
  var host = document.querySelector("[data-product]"); if (!host) return;
  var id = new URLSearchParams(location.search).get("id") || "golden-heart-hoodie";
  var p = byId[id] || P[0];
  document.title = p.name + " — Another Day in Paradise";
  var variants = p.type==="sized" ? p.sizes : p.type==="print" ? Object.keys(p.ladder||{}) : [];
  var priceNow = p.type==="deposit" ? p.deposit : p.price;
  var chips = variants.map(function(v,i){
    return '<button class="vchip' + (i===0 ? " on" : "") + '" data-v="' + v + '">' + v + '</button>'; }).join("");
  var priceLine = p.type==="print" ? 'from <span data-price>' + money(p.price) + '</span>'
    : p.type==="deposit" ? '<span data-price>' + money(p.deposit) + '</span> deposit today · ' + money(p.price) + ' total'
    : '<span data-price>' + money(p.price) + '</span>';
  var facts = p.type==="print" ? window.ADIP_PRINT_NOTE
    : p.type==="deposit" ? "Photos at day 3 and day 6. The $200 balance is due when you approve the day-6 photo, before he signs it. Signed, numbered, photographed for the studio archive."
    : (p.note || "");
  host.innerHTML =
    '<div class="pdpmedia">' + (p.kitCard
      ? '<span class="kitcard big"><span class="kcline">12 cards</span><span>6 finished drawings to study<br>6 blank tiles to answer<br>1 fine-liner · the studio guide</span><span style="color:var(--mut)">The kit is new — it exists in this store first, so it is drawn here as a spec card, not a faked photograph.</span></span>'
      : '<img src="' + p.img + '" alt="' + p.name + ' — hand-drawn by Farhad Rabbany" width="1254" height="1254">') + '</div>' +
    '<div class="pdpinfo"><p class="kick">' + p.series + ' · ' + (p.cat==="hang" ? "For the wall" : p.cat==="draw" ? "For the hand" : "To wear") + '</p>' +
    '<h1 class="pdpname">' + p.name + '</h1>' +
    '<p class="pdpprice">' + priceLine + '</p>' +
    '<p class="pdpblurb">' + p.blurb + '</p>' +
    (variants.length ? '<p class="vlabel">' + (p.type==="print" ? "Canvas size" : "Size") + ' — <span data-vsel>' + variants[0] + '</span></p><div class="vchips">' + chips + '</div>' : '') +
    '<div class="qtyrow"><button class="qbtn" data-q="-1" aria-label="One fewer">−</button><span data-qty>1</span><button class="qbtn" data-q="1" aria-label="One more">+</button></div>' +
    '<button class="addbtn" data-addpdp="' + p.id + '">Add to bag — <span data-total>' + money(priceNow) + '</span></button>' +
    '<p class="pdpnote">' + facts + '</p>' +
    '<p class="pdpnote">Drawn in Beverly Hills 90210. Ships from Los Angeles. One returns rule, storewide: 14 days.</p></div>';
  var sel = variants[0] || "", qty = 1;
  function unit(){ return p.type==="print" ? (p.ladder[sel] || p.price) : priceNow; }
  function sync(){ var vs = host.querySelector("[data-vsel]"); if (vs) vs.textContent = sel;
    var pr = host.querySelector("[data-price]"); if (pr) pr.textContent = money(unit());
    var tt = host.querySelector("[data-total]"); if (tt) tt.textContent = money(unit()*qty);
    var q = host.querySelector("[data-qty]"); if (q) q.textContent = qty; }
  host.addEventListener("click", function(e){
    var c = e.target.closest(".vchip");
    if (c){ sel = c.getAttribute("data-v");
      host.querySelectorAll(".vchip").forEach(function(x){ x.classList.toggle("on", x===c); }); sync(); return; }
    var qb = e.target.closest("[data-q]");
    if (qb){ qty = Math.max(1, Math.min(9, qty + parseInt(qb.getAttribute("data-q"),10))); sync(); return; }
    var ab = e.target.closest("[data-addpdp]");
    if (ab){ addToBag(p.id, sel, qty); toast("Added — " + p.name + (sel ? " · " + sel : "")); }
  });
  sync();
}

/* ---------- bag page ---------- */
function paintBag(){
  var host = document.querySelector("[data-bag]"); if (!host) return;
  var items = bag(), t = totals();
  if (!items.length){ host.innerHTML = '<div class="emptybag"><h2 class="h2">Your bag is empty.</h2>' +
    '<p class="lede">Everything in the store was drawn by one hand, at one table, in Beverly Hills.</p>' +
    '<p style="margin-top:22px"><a class="btn chrome" href="shop.html">Shop the store</a></p></div>'; return; }
  var rows = items.map(function(it, ix){ var p = byId[it.id]; if (!p) return "";
    return '<div class="brow"><div class="bmedia">' + (p.noPhoto ? '<span class="tileph"><span>No photo</span></span>' : '<img src="' + p.img + '" alt="" width="300" height="300">') + '</div>' +
    '<div class="bmain"><p class="bname">' + lineLabel(it) + '</p>' +
    '<p class="bunit">' + money(linePrice(it)) + ' each</p>' +
    '<div class="qtyrow small"><button class="qbtn" data-bq="' + ix + '|-1" aria-label="One fewer">−</button><span>' + it.qty + '</span><button class="qbtn" data-bq="' + ix + '|1" aria-label="One more">+</button></div></div>' +
    '<div class="bright"><p class="bline">' + money(linePrice(it)*it.qty) + '</p>' +
    '<button class="bremove" data-brm="' + ix + '">Remove</button></div></div>'; }).join("");
  host.innerHTML = '<div class="bagrows">' + rows + '</div>' +
    '<aside class="bagsum panel"><p class="sumrow"><span>Goods</span><b>' + money(t.goods) + '</b></p>' +
    '<p class="sumrow"><span>US shipping</span><b>' + (t.ship===0 ? "Free" : money(t.ship)) + '</b></p>' +
    (t.ship>0 ? '<p class="sumnote">Free at ' + money(window.ADIP_FREE_SHIP) + ' of goods — ' + money(window.ADIP_FREE_SHIP - t.goods) + ' away.</p>' : '<p class="sumnote">Free US shipping unlocked.</p>') +
    '<p class="sumrow total"><span>Total due today</span><b>' + money(t.total) + '</b></p>' +
    '<p class="sumnote">A commission in the bag is charged at its $100 deposit today; the balance is invoiced when you approve the day-6 photo.</p>' +
    '<a class="btn chrome big" href="checkout.html">Check out</a>' +
    '<p class="sumnote">14-day returns on everything, unworn and unhung. Questions: info@anotherdayinparadise.la</p></aside>';
}
document.addEventListener("click", function(e){
  var q = e.target.closest("[data-bq]");
  if (q){ var parts = q.getAttribute("data-bq").split("|"); var b = bag();
    var ix = parseInt(parts[0],10);
    if (b[ix]){ b[ix].qty += parseInt(parts[1],10); if (b[ix].qty<1) b.splice(ix,1); setBag(b); paintBag(); } return; }
  var r = e.target.closest("[data-brm]");
  if (r){ var b2 = bag(); b2.splice(parseInt(r.getAttribute("data-brm"),10),1); setBag(b2); paintBag(); return; }
  var a = e.target.closest("[data-add]");
  if (a){ var p = byId[a.getAttribute("data-add")]; if (!p) return;
    if (p.type==="sized" || p.type==="print"){ location.href = "product.html?id=" + p.id; return; }
    addToBag(p.id, "", 1); toast("Added — " + p.name); }
});

/* ---------- checkout ---------- */
function paintCheckout(){
  var host = document.querySelector("[data-checkout]"); if (!host) return;
  var placed = new URLSearchParams(location.search).get("placed");
  if (placed){ var orders = load("adiporders2", []); var o = null;
    orders.forEach(function(x){ if (x.no===placed) o = x; });
    if (o){ host.innerHTML = '<div class="confirm panel"><p class="kick">Order confirmed</p>' +
      '<h1 class="h2">Thank you. Order ' + o.no + '</h1>' +
      '<p class="lede">' + o.lines.map(function(l){ return l.qty + " × " + l.label; }).join("<br>") + '</p>' +
      '<p class="sumrow total" style="margin-top:18px"><span>Charged today</span><b>' + money(o.total) + '</b></p>' +
      '<p class="pdpnote">A confirmation is on its way to ' + o.email + '. Wearables and the kit ship in 2–3 days; prints are made to order (5–7 days); a commission begins at the table this week — expect the day-3 photo at this address. One returns rule: 14 days.</p>' +
      '<p style="margin-top:20px"><a class="btn" href="shop.html">Keep looking</a></p></div>';
      return; } }
  var items = bag(), t = totals();
  if (!items.length){ host.innerHTML = '<div class="emptybag"><h2 class="h2">Nothing to check out yet.</h2>' +
    '<p style="margin-top:22px"><a class="btn chrome" href="shop.html">Shop the store</a></p></div>'; return; }
  var lines = items.map(function(it){ return '<p class="sumrow"><span>' + it.qty + " × " + lineLabel(it) + '</span><b>' + money(linePrice(it)*it.qty) + '</b></p>'; }).join("");
  host.innerHTML = '<form class="coform" data-coform novalidate>' +
    '<div class="cofields panel"><p class="kick">Where it goes</p>' +
    '<label>Full name<input required name="name" autocomplete="name"></label>' +
    '<label>Email<input required type="email" name="email" autocomplete="email"></label>' +
    '<label>Street address<input required name="street" autocomplete="street-address"></label>' +
    '<div class="co2"><label>City<input required name="city" autocomplete="address-level2"></label>' +
    '<label>ZIP<input required name="zip" autocomplete="postal-code" inputmode="numeric"></label></div>' +
    '<p class="kick" style="margin-top:26px">Payment</p>' +
    '<label>Card number<input required name="card" inputmode="numeric" autocomplete="cc-number" placeholder="•••• •••• •••• ••••"></label>' +
    '<div class="co2"><label>Expiry<input required name="exp" placeholder="MM / YY" autocomplete="cc-exp"></label>' +
    '<label>CVC<input required name="cvc" inputmode="numeric" autocomplete="cc-csc"></label></div>' +
    '<p class="pdpnote">Card capture switches on with the studio\'s own payment account — the one wire left for Farhad (SUMMARY.md). Until then this checkout records the order and the studio confirms payment by email before anything ships; no card is charged by this page.</p></div>' +
    '<aside class="bagsum panel"><p class="kick">Your order</p>' + lines +
    '<p class="sumrow"><span>US shipping</span><b>' + (t.ship===0 ? "Free" : money(t.ship)) + '</b></p>' +
    '<p class="sumrow total"><span>Total due today</span><b>' + money(t.total) + '</b></p>' +
    '<button class="btn chrome big" type="submit">Place order — ' + money(t.total) + '</button>' +
    '<p class="sumnote">By placing the order you agree to the store\'s one rule: 14-day returns, unworn and unhung.</p></aside></form>';
  var form = host.querySelector("[data-coform]");
  form.addEventListener("submit", function(ev){ ev.preventDefault();
    var bad = null;
    form.querySelectorAll("[required]").forEach(function(f){ if (!f.value.trim()){ f.classList.add("bad"); if(!bad) bad = f; } else f.classList.remove("bad"); });
    if (bad){ bad.focus(); toast("A few fields still need you."); return; }
    var fd = new FormData(form);
    var no = "ADIP-" + Math.floor(1000 + Math.random()*9000);
    var order = { no:no, email:String(fd.get("email")||""), name:String(fd.get("name")||""),
      lines: bag().map(function(it){ return { qty:it.qty, label:lineLabel(it) }; }), total: totals().total };
    var orders = load("adiporders2", []); orders.push(order); save("adiporders2", orders);
    setBag([]); location.href = "checkout.html?placed=" + no; });
}

/* ---------- commission configurator → bag ---------- */
function paintCommission(){
  var host = document.querySelector("[data-commission]"); if (!host) return;
  var state = { base:"WHITE", motif:"HEARTS", word:"", cert:false };
  function line(){ return "WHITE CAP".replace("WHITE", state.base) + " · " + state.motif +
    " · WORD: " + (state.word.toUpperCase() || "—") + " · CERTIFICATE: " + (state.cert ? "YES" : "—"); }
  function sync(){ var s = host.querySelector("[data-csum]"); if (s) s.textContent = "YOUR COMMISSION — " + line();
    var d = host.querySelector("[data-cdue]"); if (d) d.textContent = "DUE TODAY $100 · BALANCE $200 · TOTAL $300"; }
  host.addEventListener("click", function(e){ var c = e.target.closest("[data-cfg]");
    if (c){ var g = c.getAttribute("data-cfg"), v = c.getAttribute("data-val");
      if (g==="cert"){ state.cert = !state.cert; c.classList.toggle("on", state.cert); }
      else { state[g] = v; host.querySelectorAll('[data-cfg="' + g + '"]').forEach(function(x){ x.classList.toggle("on", x===c); }); }
      sync(); return; }
    var add = e.target.closest("[data-cadd]");
    if (add){ addToBag("the-commission", line(), 1); toast("Commission reserved — $100 deposit in your bag"); location.href = "cart.html"; } });
  host.addEventListener("input", function(e){ if (e.target.matches("[data-cword]")){ state.word = e.target.value.slice(0,12); sync(); } });
  sync();
}

window.ADIP_repaintShop = paintShop;
document.addEventListener("DOMContentLoaded", function(){
  paintCount(); paintShop(); paintRail(); paintProduct(); paintBag(); paintCheckout(); paintCommission();
});
})();
