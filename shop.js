/* ADIP recreation engine — catalogue, galleries, bag, checkout, orders, account.
   Everything runs inside this site: no step hands the buyer to another site.
   Bag: localStorage "adipbag3". Orders: localStorage "adiporders3". */
(function(){
"use strict";
var P = (window.ADIP_PRODUCTS || []).concat(window.ADIP_COLLAB || []);
var byId = {}; P.forEach(function(p){ byId[p.id]=p; });
var SIZE_ORDER = ["S","M","L","XL"];
function money(n){ return "$" + n.toLocaleString("en-US"); }
function load(k, d){ try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } }
function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
function bag(){ return load("adipbag3", []); }
function setBag(b){ save("adipbag3", b); paintCount(); }
function bagCount(){ return bag().reduce(function(s,i){ return s + i.qty; }, 0); }
function linePrice(it){ var p = byId[it.id]; if(!p) return 0;
  if (p.type==="print" || p.type==="request") return (p.ladder && p.ladder[it.variant]) || p.price;
  if (p.type==="commission") return p.deposit;
  return p.price; }
function lineLabel(it){ var p = byId[it.id]; if(!p) return it.id;
  var v = it.variant ? " · " + it.variant : "";
  var d = p.type==="commission" ? " · deposit (total " + money(p.price) + ")" : "";
  return p.name + v + d; }
function totals(){ var items = bag();
  var goods = items.reduce(function(s,i){ return s + linePrice(i)*i.qty; }, 0);
  var ship = items.length===0 ? 0 : (goods >= (window.ADIP_FREE_SHIP||200) ? 0 : (window.ADIP_SHIP_FLAT||12));
  return { goods:goods, ship:ship, total:goods+ship, count:bagCount() }; }
function paintCount(){ var n = bagCount();
  document.querySelectorAll(".baglink").forEach(function(a){ a.textContent = "Bag (" + n + ")"; }); }
function addToBag(id, variant, qty){
  var b = bag(); qty = qty || 1; var found = null;
  b.forEach(function(i){ if (i.id===id && i.variant===variant) found = i; });
  if (found) found.qty += qty; else b.push({ id:id, variant:variant||"", qty:qty });
  setBag(b); return b; }
function toast(msg){ var t = document.querySelector(".toast");
  if (!t){ t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove("on"); }, 2600); }
function priceText(p){
  if (p.type==="print") return "from " + money(p.price);
  if (p.type==="request") return "Price on request";
  if (p.type==="commission") return money(p.deposit) + " deposit · " + money(p.price);
  return money(p.price); }

/* ---------- tiles ---------- */
function tile(p){
  return '<article class="tile"><a href="product.html?id=' + p.id + '" style="text-decoration:none">' +
    '<span class="mat" style="display:block"><img src="' + p.images[0] + '" alt="' + p.name + ' — by Farhad Rabbany" loading="lazy" width="900" height="900"></span>' +
    '<span class="tilemeta"><span class="tilename">' + p.name + '</span><span class="tileprice">' + priceText(p) + '</span></span>' +
    (p.collab ? '<span class="tilebadge">Limited Edition · Skyline × ADIP</span>' : '') + '</a>' +
    (p.type==="request"
      ? '<a class="tileadd" href="product.html?id=' + p.id + '">Ask the studio</a>'
      : '<button class="tileadd" data-add="' + p.id + '">' + (p.type==="sized" || p.type==="print" ? "Choose options" : "Add to bag — " + priceText(p)) + '</button>') +
    '</article>';
}
function paintShop(){
  var grid = document.querySelector("[data-shopgrid]"); if (!grid) return;
  var f = grid.getAttribute("data-filter") || "all";
  var list = P.filter(function(p){ return f==="all" || p.cat===f || (f==="collab" && !!p.collab) || (f==="under100" && p.price>0 && p.price<100); });
  grid.innerHTML = list.map(tile).join("");
  var c = document.querySelector("[data-shopcount]");
  if (c) c.textContent = list.length + (list.length===1 ? " piece" : " pieces");
}
window.ADIP_repaintShop = paintShop;
function paintRail(){
  document.querySelectorAll("[data-rail]").forEach(function(r){
    var ids = (r.getAttribute("data-rail")||"").split(",").filter(Boolean);
    r.innerHTML = ids.map(function(id){ return byId[id] ? tile(byId[id]) : ""; }).join("");
  });
}

/* ---------- lightbox ---------- */
var LB = { list:[], ix:0 };
function lbShow(){ var lb = document.getElementById("lightbox"); if(!lb) return;
  var it = LB.list[LB.ix]; if(!it) return;
  lb.querySelector("img").src = it.src; lb.querySelector("img").alt = it.cap || "";
  lb.querySelector(".lbcap").textContent = (it.cap || "") + "  ·  " + (LB.ix+1) + " / " + LB.list.length;
  lb.classList.add("on"); document.body.style.overflow = "hidden"; }
function lbHide(){ var lb = document.getElementById("lightbox"); if(!lb) return;
  lb.classList.remove("on"); document.body.style.overflow = ""; }
function openLB(list, ix){ LB.list = list; LB.ix = ix || 0; lbShow(); }
document.addEventListener("click", function(e){
  if (e.target.closest("#lbclose")) lbHide();
  if (e.target.closest("#lbprev")){ LB.ix = (LB.ix - 1 + LB.list.length) % LB.list.length; lbShow(); }
  if (e.target.closest("#lbnext")){ LB.ix = (LB.ix + 1) % LB.list.length; lbShow(); }
  if (e.target.id === "lightbox") lbHide();
});
document.addEventListener("keydown", function(e){ if (e.key === "Escape") lbHide(); });

/* ---------- gallery page ---------- */
function paintGallery(){
  var host = document.querySelector("[data-gallery]"); if (!host) return;
  var items = [];
  P.filter(function(p){ return p.cat==="prints"; }).forEach(function(p){
    var seenStem = {};
    p.images.forEach(function(src){ var stem = src.split("/").pop().replace(/-1(\.[a-z]+)$/i, "$1");
      if (seenStem[stem]) return; seenStem[stem] = 1;
      items.push({ src:src, cap:p.name, price: p.type==="request" ? "Price on request" : "from " + money(p.price), id:p.id }); });
  });
  (window.ADIP_ART || []).forEach(function(a){ items.push({ src:a.src, cap:a.cap, price:"The drawing", id:"" }); });
  host.innerHTML = items.map(function(it, ix){
    return '<button class="galitem" data-lb="' + ix + '"><span class="mat" style="display:block"><img src="' + it.src + '" alt="' + it.cap + ' — hand-drawn by Farhad Rabbany" loading="lazy" width="900" height="900"></span>' +
    '<span class="galcap"><b>' + it.cap + '</b><span>' + it.price + '</span></span></button>'; }).join("");
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-lb]");
    if (b) openLB(items.map(function(it){ return { src:it.src, cap:it.cap }; }), parseInt(b.getAttribute("data-lb"),10)); });
}

/* ---------- product page ---------- */
function paintProduct(){
  var host = document.querySelector("[data-product]"); if (!host) return;
  var id = new URLSearchParams(location.search).get("id") || "adip-golden-heart-ivory-cotton-hoodie";
  var p = byId[id] || P[3];
  document.title = p.name + " — Another Day in Paradise";
  var variants = p.type==="sized" ? p.sizes.slice().sort(function(a,b){ return SIZE_ORDER.indexOf(a)-SIZE_ORDER.indexOf(b); })
               : (p.type==="print" || p.type==="request") ? Object.keys(p.ladder||{}) : [];
  var thumbs = p.images.map(function(src, ix){
    return '<button data-th="' + ix + '"' + (ix===0 ? ' class="on"' : '') + ' aria-label="Photo ' + (ix+1) + '"><img src="' + src + '" alt=""></button>'; }).join("");
  var isReq = p.type==="request", isCom = p.type==="commission";
  var priceLine = isReq ? "Price on request"
    : p.type==="print" ? '<span data-price>from ' + money(p.price) + '</span>'
    : isCom ? '<span data-price>' + money(p.deposit) + '</span> deposit today · ' + money(p.price) + ' total'
    : '<span data-price>' + money(p.price) + '</span>';
  var commBlock = isCom ?
    '<p class="vlabel">Your word (woven into the drawing, up to 12 letters)</p>' +
    '<input data-cword maxlength="12" placeholder="e.g. HOPE" style="width:100%;padding:14px 16px;border:1px solid var(--line);background:#0F0D0A;color:var(--ink);font-size:16px;font-family:\'Space Mono\',monospace;letter-spacing:.14em;text-transform:uppercase;border-radius:2px">' +
    '<p class="vlabel">Motif</p><div class="vchips"><button class="vchip on" data-motif="HEARTS">Hearts</button><button class="vchip" data-motif="WAVES">Waves</button><button class="vchip" data-motif="SPIRAL">Spiral</button></div>' +
    '<p class="pdpnote" data-csum>YOUR CAP — WHITE · HEARTS · WORD: —</p>' : '';
  var buyBlock = isReq
    ? '<a class="btn red big" href="contact.html" style="margin-top:18px">Ask the studio about this piece</a>' +
      '<p class="pdpnote">This print is listed at $0 in the studio\'s catalogue — a price was never set for it. Rather than invent one, this page takes enquiries: write to the studio and Farhad will price it for you.</p>'
    : '<div class="qtyrow"><button class="qbtn" data-q="-1" aria-label="One fewer">−</button><span data-qty>1</span><button class="qbtn" data-q="1" aria-label="One more">+</button></div>' +
      '<button class="addbtn" data-addpdp="' + p.id + '">' + (isCom ? "Reserve — " : "Add to bag — ") + '<span data-total>' + money(isCom ? p.deposit : p.price) + '</span></button>';
  host.innerHTML =
    '<div class="galwrap"><div class="mat galmain"><img data-main src="' + p.images[0] + '" alt="' + p.name + ' — by Farhad Rabbany" width="1100" height="1100"></div>' +
    '<div class="galthumbs">' + thumbs + '</div>' +
    '<p class="mono" style="color:var(--mut);font-size:12px;letter-spacing:.14em;margin-top:12px">TAP THE LARGE PHOTO FOR THE LIGHTBOX · ' + p.images.length + (p.images.length===1 ? " PHOTO" : " PHOTOS") + '</p></div>' +
    '<div class="pdpinfo"><p class="kick">' + (p.collab ? "Skyline × ADIP · Limited Edition Collaboration" : p.cat==="prints" ? "Canvas print · Hand Drawing" : p.cat==="hoodies" ? "Hoodie · Wearable art" : p.cat==="caps" ? "Cap · Wearable art" : "T-Shirt · Wearable art") + '</p>' +
    '<h1 class="pdpname"><span class="seal"></span>' + p.name + '</h1>' +
    '<p class="pdpprice">' + priceLine + '</p>' +
    '<p class="pdpdesc">' + p.desc + '</p>' + commBlock +
    (variants.length ? '<p class="vlabel">' + (p.type==="print" || isReq ? "Canvas size" : "Size") + ' — <span data-vsel>' + variants[0] + '</span></p><div class="vchips">' +
      variants.map(function(v,i){ return '<button class="vchip' + (i===0 ? " on" : "") + '" data-v="' + v + '">' + v + (p.ladder ? " · " + money(p.ladder[v]) : "") + '</button>'; }).join("") + '</div>' : '') +
    buyBlock +
    '<p class="pdpnote">Drawn by hand in Beverly Hills 90210. Printed &amp; embroidered in Los Angeles. US shipping $12 flat, free at $200 of goods. One returns rule, storewide: 14 days.</p></div>';
  var bar = document.querySelector("[data-stickybar]");
  if (bar && !isReq){ bar.innerHTML = '<span class="sbname">' + p.name + '</span><span class="sbprice">' + priceText(p) + '</span><button data-sbadd> ' + (isCom ? "Reserve" : "Add to bag") + '</button>'; }
  var sel = variants[0] || "", qty = 1, motif = "HEARTS", word = "";
  function unit(){ return (p.type==="print") ? (p.ladder[sel] || p.price) : isCom ? p.deposit : p.price; }
  function sync(){ var vs = host.querySelector("[data-vsel]"); if (vs) vs.textContent = sel;
    var pr = host.querySelector("[data-price]"); if (pr && p.type==="print") pr.textContent = (sel === variants[0] ? "from " : "") + money(unit());
    var tt = host.querySelector("[data-total]"); if (tt) tt.textContent = money(unit()*qty);
    var q = host.querySelector("[data-qty]"); if (q) q.textContent = qty;
    var cs = host.querySelector("[data-csum]");
    if (cs) cs.textContent = "YOUR CAP — WHITE · " + motif + " · WORD: " + (word.toUpperCase() || "—"); }
  host.addEventListener("click", function(e){
    var th = e.target.closest("[data-th]");
    if (th){ var ix = parseInt(th.getAttribute("data-th"),10);
      host.querySelector("[data-main]").src = p.images[ix];
      host.querySelectorAll("[data-th]").forEach(function(x){ x.classList.toggle("on", x===th); }); return; }
    if (e.target.closest("[data-main]")){ openLB(p.images.map(function(src){ return { src:src, cap:p.name }; }),
      p.images.indexOf(host.querySelector("[data-main]").src) < 0 ? 0 : p.images.findIndex(function(s){ return host.querySelector("[data-main]").src.endsWith(s.split("/").pop()); })); return; }
    var c = e.target.closest(".vchip[data-v]");
    if (c){ sel = c.getAttribute("data-v");
      host.querySelectorAll(".vchip[data-v]").forEach(function(x){ x.classList.toggle("on", x===c); }); sync(); return; }
    var m = e.target.closest("[data-motif]");
    if (m){ motif = m.getAttribute("data-motif");
      host.querySelectorAll("[data-motif]").forEach(function(x){ x.classList.toggle("on", x===m); }); sync(); return; }
    var qb = e.target.closest("[data-q]");
    if (qb){ qty = Math.max(1, Math.min(9, qty + parseInt(qb.getAttribute("data-q"),10))); sync(); return; }
    var ab = e.target.closest("[data-addpdp]");
    if (ab){ var variant = isCom ? ("WHITE · " + motif + " · WORD: " + (word.toUpperCase() || "—")) : sel;
      addToBag(p.id, variant, qty); toast("Added — " + p.name + (variant ? " · " + variant : "")); }
  });
  host.addEventListener("input", function(e){ if (e.target.matches("[data-cword]")){ word = e.target.value.slice(0,12); sync(); } });
  if (bar){ bar.addEventListener("click", function(e){ if (e.target.closest("[data-sbadd]")){
    var variant = isCom ? ("WHITE · " + motif + " · WORD: " + (word.toUpperCase() || "—")) : sel;
    addToBag(p.id, variant, 1); toast("Added — " + p.name); } }); }
  sync();
}

/* ---------- bag page ---------- */
function paintBag(){
  var host = document.querySelector("[data-bag]"); if (!host) return;
  var items = bag(), t = totals();
  if (!items.length){ host.innerHTML = '<div><h2 class="h2">Your bag is empty.</h2>' +
    '<p class="lede" style="margin-top:14px">The studio suggests starting where the old site\'s empty cart did:</p>' +
    '<div class="rail">' + ["adip-signature-mark-white-cotton-cap","adip-zentangle-spirit-white-t-shirt","adip-rhythm-heart-black-cotton-hoodie","adip-golden-heart-ivory-cotton-hoodie"].map(function(id){ return tile(byId[id]); }).join("") + '</div></div>'; return; }
  var rows = items.map(function(it, ix){ var p = byId[it.id]; if (!p) return "";
    return '<div class="brow"><div class="bmedia"><img src="' + p.images[0] + '" alt=""></div>' +
    '<div><p class="bname">' + lineLabel(it) + '</p><p class="bunit">' + money(linePrice(it)) + ' each</p>' +
    '<div class="qtyrow small"><button class="qbtn" data-bq="' + ix + '|-1" aria-label="One fewer">−</button><span>' + it.qty + '</span><button class="qbtn" data-bq="' + ix + '|1" aria-label="One more">+</button></div></div>' +
    '<div class="bright"><p class="bline">' + money(linePrice(it)*it.qty) + '</p><button class="bremove" data-brm="' + ix + '">Remove</button></div></div>'; }).join("");
  host.innerHTML = '<div class="bagrows">' + rows + '</div>' +
    '<aside class="bagsum panel"><p class="sumrow"><span>Goods</span><b>' + money(t.goods) + '</b></p>' +
    '<p class="sumrow"><span>US shipping</span><b>' + (t.ship===0 ? "Free" : money(t.ship)) + '</b></p>' +
    (t.ship>0 ? '<p class="sumnote">Free at ' + money(window.ADIP_FREE_SHIP) + ' of goods — ' + money(window.ADIP_FREE_SHIP - t.goods) + ' away.</p>' : '<p class="sumnote">Free US shipping unlocked.</p>') +
    '<p class="sumrow total"><span>Total due today</span><b>' + money(t.total) + '</b></p>' +
    '<p class="sumnote">The hand-drawn cap is charged at its $100 deposit today; the $200 balance is invoiced when you approve the day-6 photo.</p>' +
    '<a class="btn red big" href="checkout.html">Check out</a>' +
    '<p class="sumnote">14-day returns on everything, unworn and unhung. Questions: info@anotherdayinparadise.la</p></aside>';
}
document.addEventListener("click", function(e){
  var q = e.target.closest("[data-bq]");
  if (q){ var parts = q.getAttribute("data-bq").split("|"); var b = bag(); var ix = parseInt(parts[0],10);
    if (b[ix]){ b[ix].qty += parseInt(parts[1],10); if (b[ix].qty<1) b.splice(ix,1); setBag(b); paintBag(); } return; }
  var r = e.target.closest("[data-brm]");
  if (r){ var b2 = bag(); b2.splice(parseInt(r.getAttribute("data-brm"),10),1); setBag(b2); paintBag(); return; }
  var a = e.target.closest("[data-add]");
  if (a){ var p = byId[a.getAttribute("data-add")]; if (!p) return;
    if (p.type==="sized" || p.type==="print"){ location.href = "product.html?id=" + p.id; return; }
    addToBag(p.id, p.type==="commission" ? "WHITE · HEARTS · WORD: —" : "", 1); toast("Added — " + p.name); }
});

/* ---------- checkout ---------- */
function paintCheckout(){
  var host = document.querySelector("[data-checkout]"); if (!host) return;
  var placed = new URLSearchParams(location.search).get("placed");
  if (placed){ var orders = load("adiporders3", []); var o = null;
    orders.forEach(function(x){ if (x.no===placed) o = x; });
    if (o){ host.innerHTML = '<div class="confirm panel"><p class="kick">Order confirmed</p>' +
      '<h1 class="h2" style="margin-top:10px">Thank you. Order ' + o.no + '</h1>' +
      '<p class="lede" style="margin-top:14px">' + o.lines.map(function(l){ return l.qty + " × " + l.label; }).join("<br>") + '</p>' +
      '<p class="sumrow total" style="margin-top:18px;max-width:340px"><span>Charged today</span><b>' + money(o.total) + '</b></p>' +
      '<p class="pdpnote">A confirmation is on its way to ' + o.email + '. Wearables ship in 2–3 days; prints are made to order (5–7 days); the hand-drawn cap begins at the table this week — expect the day-3 photo at this address. Your orders also live under Account. One returns rule: 14 days.</p>' +
      '<p style="margin-top:20px"><a class="btn" href="shop.html">Keep looking</a></p></div>';
      return; } }
  var items = bag(), t = totals();
  if (!items.length){ host.innerHTML = '<div><h2 class="h2">Nothing to check out yet.</h2>' +
    '<p style="margin-top:22px"><a class="btn red" href="shop.html">Shop the store</a></p></div>'; return; }
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
    '<p class="pdpnote">The studio\'s live store takes PayPal and cards through WooPayments. In this recreation the card step activates with the studio\'s own payment account — until then, placing the order records it here and the studio confirms payment by email before anything ships. No card is charged by this page.</p></div>' +
    '<aside class="bagsum panel"><p class="kick">Your order</p>' + lines +
    '<p class="sumrow"><span>US shipping</span><b>' + (t.ship===0 ? "Free" : money(t.ship)) + '</b></p>' +
    '<p class="sumrow total"><span>Total due today</span><b>' + money(t.total) + '</b></p>' +
    '<button class="btn red big" type="submit">Place order — ' + money(t.total) + '</button>' +
    '<p class="sumnote">One rule: 14-day returns, unworn and unhung.</p></aside></form>';
  var form = host.querySelector("[data-coform]");
  form.addEventListener("submit", function(ev){ ev.preventDefault();
    var bad = null;
    form.querySelectorAll("[required]").forEach(function(f){ if (!f.value.trim()){ f.classList.add("bad"); if(!bad) bad = f; } else f.classList.remove("bad"); });
    if (bad){ bad.focus(); toast("A few fields still need you."); return; }
    var fd = new FormData(form);
    var no = "ADIP-" + Math.floor(1000 + Math.random()*9000);
    var order = { no:no, email:String(fd.get("email")||""), name:String(fd.get("name")||""),
      lines: bag().map(function(it){ return { qty:it.qty, label:lineLabel(it) }; }), total: totals().total, when: new Date().toISOString().slice(0,10) };
    var orders = load("adiporders3", []); orders.push(order); save("adiporders3", orders);
    setBag([]); location.href = "checkout.html?placed=" + no; });
}

/* ---------- account ---------- */
function paintAccount(){
  var host = document.querySelector("[data-account]"); if (!host) return;
  var orders = load("adiporders3", []);
  host.innerHTML = orders.length
    ? orders.slice().reverse().map(function(o){
        return '<div class="panel" style="padding:24px 26px;margin-top:16px"><p class="kick">Order ' + o.no + (o.when ? " · " + o.when : "") + '</p>' +
        '<p style="margin-top:10px;line-height:1.8">' + o.lines.map(function(l){ return l.qty + " × " + l.label; }).join("<br>") + '</p>' +
        '<p class="sumrow total" style="max-width:320px"><span>Total</span><b>' + money(o.total) + '</b></p></div>'; }).join("")
    : '<div class="panel" style="padding:26px;margin-top:16px"><p class="lede">No orders yet in this browser. When you check out, your orders appear here — the recreation keeps them on this device; accounts sync when the store deploys on the studio\'s hosting.</p>' +
      '<p style="margin-top:18px"><a class="btn red" href="shop.html">Shop the store</a></p></div>';
}

/* ---------- contact ---------- */
function paintContact(){
  var form = document.querySelector("[data-cform]"); if (!form) return;
  form.addEventListener("submit", function(ev){ ev.preventDefault();
    var bad = null;
    form.querySelectorAll("[required]").forEach(function(f){ if (!f.value.trim()){ f.classList.add("bad"); if(!bad) bad = f; } else f.classList.remove("bad"); });
    if (bad){ bad.focus(); toast("A few fields still need you."); return; }
    var fd = new FormData(form);
    var done = document.querySelector("[data-cdone]");
    if (done){ done.style.display = "block"; done.scrollIntoView({ behavior:"smooth", block:"center" }); }
    var ml = document.querySelector("[data-cmail]");
    if (ml){ ml.href = "mailto:info@anotherdayinparadise.la?subject=" + encodeURIComponent("Studio enquiry — " + (fd.get("topic") || "General")) +
      "&body=" + encodeURIComponent((fd.get("message") || "") + "\n\n— " + (fd.get("name") || "") + " (" + (fd.get("email") || "") + ")"); }
    form.reset(); });
}

/* ---------- chrome ---------- */
function paintChrome(){
  var bar = document.getElementById("scrollprog");
  if (bar){ var upd = function(){ var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight; bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%"; };
    window.addEventListener("scroll", upd, { passive:true }); upd(); }
  var els = document.querySelectorAll("[data-rv]");
  if ("IntersectionObserver" in window && els.length){
    var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if (x.isIntersecting){ x.target.classList.add("on"); io.unobserve(x.target); } }); }, { threshold:.08 });
    els.forEach(function(e){ io.observe(e); });
  } else { els.forEach(function(e){ e.classList.add("on"); }); }
}

document.addEventListener("DOMContentLoaded", function(){
  paintCount(); paintShop(); paintRail(); paintGallery(); paintProduct(); paintBag(); paintCheckout(); paintAccount(); paintContact(); paintChrome();
});
})();
