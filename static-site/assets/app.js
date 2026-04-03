(function () {
  "use strict";

  var STORAGE = {
    cart: "derkerk.cart.v3",
    authCodes: "derkerk.authCodes.v1",
    session: "derkerk.session",
    users: "derkerk.users",
    orders: "derkerk.orders",
    wishlist: "derkerk.wishlist",
    products: "derkerk.products.v1",
    banner: "derkerk.banner.v1",
    prefs: "derkerk.prefs.v1",
  };

  var SESSION_CHECKOUT_GUEST = "derkerk.checkoutAsGuest";
  var AUTH_CODE_TTL_MS = 10 * 60 * 1000;
  var SESSION_AUTH_EMAIL = "derkerk.pendingAuthEmail";

  var PRODUCTS = [
    {
      id: "mono-tee",
      name: "MONO TEE",
      price: 29000,
      category: "apparel",
      tag: "new",
      description:
        "블랙 베이스에 화이트 스티치. 데일리 실루엣, 두께감 있는 코튼.",
      colors: ["블랙", "화이트", "차콜"],
      sizes: ["S", "M", "L", "XL"],
      detailHtml:
        "<p>18수 싱글 코튼 원단으로 제작되어 착용감이 부드럽고 탄탄합니다. 넥라인과 소매에 화이트 스티치로 톤 대비를 주었습니다.</p><p>세미 루즈 핏이며 단독 착용과 아우터 이너 모두 활용하기 좋습니다. 찬물 단독 세탁을 권장합니다.</p>",
      reviews: [
        { author: "김서연", rating: 5, body: "핏이 딱 좋아요. 스티치 포인트가 고급져 보여요.", date: "2025-11-18" },
        { author: "이도윤", rating: 4, body: "두께감 있어서 겨울에도 레이어드하기 좋습니다.", date: "2025-12-02" },
      ],
    },
    {
      id: "white-tee",
      name: "WHITE CORE TEE",
      price: 27000,
      category: "apparel",
      tag: null,
      description: "순백 티셔츠. 레이어드용으로도 단독으로도 깔끔한 핏.",
      colors: ["화이트", "오프화이트"],
      sizes: ["S", "M", "L", "XL"],
      detailHtml:
        "<p>비침을 줄인 밀도 높은 화이트 코튼입니다. 미니멀 룩의 기본 아이템으로 셔츠·재킷 안에 매치하기 좋습니다.</p><p>목 늘어남을 막기 위해 넥 본딩을 이중 처리했습니다.</p>",
      reviews: [
        { author: "박지민", rating: 5, body: "화이트 티 중에서 핏이 제일 예뻐요.", date: "2025-10-30" },
      ],
    },
    {
      id: "contrast-cap",
      name: "CONTRAST CAP",
      price: 22000,
      category: "accessories",
      tag: "sale",
      description: "블랙 캡 + 화이트 자수. 로우 프로파일, 조절 스트랩.",
      colors: ["블랙", "네이비"],
      sizes: ["FREE"],
      detailHtml:
        "<p>로우 크라운 실루엣의 6패널 캡입니다. 뒤 스트랩으로 사이즈를 조절할 수 있습니다.</p><p>앞 패널에 화이트 톤 미니멀 자수로 브랜드 무드를 맞췄습니다.</p>",
      reviews: [
        { author: "최유진", rating: 4, body: "착용감 가볍고 스트랩 여유 있어요.", date: "2025-11-05" },
        { author: "정한결", rating: 5, body: "세일 때 샀는데 만족합니다.", date: "2025-11-22" },
      ],
    },
    {
      id: "canvas-tote",
      name: "WHITE CANVAS TOTE",
      price: 24000,
      category: "bags",
      tag: "new",
      description: "헤비 캔버스 토트. 내부 포켓, 미니멀 실루엣.",
      colors: ["내추럴", "블랙"],
      sizes: ["M", "L"],
      detailHtml:
        "<p>12온스 캔버스에 코팅 처리로 생활 방수에 강합니다. 내부 슬립 포켓 1개가 있습니다.</p><p>어깨에 걸쳐도 무리 없는 스트랩 길이입니다.</p>",
      reviews: [
        { author: "한소희", rating: 5, body: "데일리로 들기 좋고 포켓 유용해요.", date: "2025-12-08" },
      ],
    },
    {
      id: "leather-tote",
      name: "STRUCTURED TOTE",
      price: 189000,
      category: "bags",
      tag: null,
      description: "블랙 그레인 레더 느낌의 PU. 직장·출퇴근용 구조감.",
      colors: ["블랙", "다크브라운"],
      sizes: ["ONE"],
      detailHtml:
        "<p>PU 소재에 그레인 텍스처를 입혀 자연스러운 광택을 살렸습니다. 바닥이 넓어 노트북·파일 수납에 적합합니다.</p><p>내부 지퍼 포켓과 오픈 포켋이 있습니다.</p>",
      reviews: [
        { author: "오지훈", rating: 5, body: "출근용으로 샀는데 무게 대비 수납이 좋아요.", date: "2025-09-14" },
        { author: "강민아", rating: 4, body: "가죽 느낌 나고 스크래치도 잘 안 나요.", date: "2025-10-01" },
      ],
    },
    {
      id: "silver-chain",
      name: "SILVER CHAIN NECKLACE",
      price: 78000,
      category: "jewelry",
      tag: "new",
      description: "실버톤 체인. 투톤 룩에 맞춘 굵기와 길이.",
      colors: ["실버", "건실버"],
      sizes: ["40cm", "45cm", "50cm"],
      detailHtml:
        "<p>니켈 프리 도금으로 알러지 부담을 줄였습니다. 링크 두께는 약 3mm로 티셔츠 위에도 무난합니다.</p><p>별도 박스 포장으로 선물용으로도 적합합니다.</p>",
      reviews: [
        { author: "윤채원", rating: 5, body: "45cm 샀는요 목선에 딱 예쁩니다.", date: "2025-11-28" },
      ],
    },
    {
      id: "mono-hoodie",
      name: "MONO HOODIE",
      price: 89000,
      category: "apparel",
      tag: null,
      description: "오버핏 후디. 블랙 바디, 화이트 드로스트링 디테일.",
      colors: ["블랙", "차콜", "화이트"],
      sizes: ["S", "M", "L", "XL"],
      detailHtml:
        "<p>400g 내외의 기모 없는 스웨트 원단으로 계절 중간에 쓰기 좋습니다. 후드 이중 구조로 볼륨이 살아 있습니다.</p><p>드로스트링 팁에 화이트 캡을 씌워 투톤 포인트를 주었습니다.</p>",
      reviews: [
        { author: "서준호", rating: 5, body: "오버핏인데 어깨 안 내려가요. 좋아요.", date: "2025-11-10" },
        { author: "문하은", rating: 4, body: "화이트도 샀는데 살짝 비침 있어요.", date: "2025-12-01" },
      ],
    },
    {
      id: "wool-scarf",
      name: "MERINO SCARF",
      price: 118000,
      category: "accessories",
      tag: "sale",
      description: "차콜 그레이 울 믹스. 긴 랩 실루엣.",
      colors: ["차콜", "미드그레이"],
      sizes: ["FREE"],
      detailHtml:
        "<p>메리노 울과 아크릴을 블렌드해 부드럽고 덜 거칩니다. 길이 180cm 전후로 한 바퀴 이상 감기 좋습니다.</p><p>초기 세탁 시 드라이 클리닝을 권장합니다.</p>",
      reviews: [
        { author: "배수연", rating: 5, body: "부드럽고 색이 사진이랑 비슷해요.", date: "2025-10-18" },
      ],
    },
    {
      id: "ceramic-mug",
      name: "MATTE MUG SET",
      price: 42000,
      category: "living",
      tag: null,
      description: "매트 블랙 2P 세트. 식기세척기 가능.",
      colors: ["매트블랙", "매트화이트"],
      sizes: ["350ml", "450ml"],
      detailHtml:
        "<p>2개 1세트 구성입니다. 매트 글레이즈로 지문이 덜 남습니다. 전자레인지·식기세척기 사용 가능합니다.</p><p>미니멀 주방이나 사무실 책상에 어울리는 실루엣입니다.</p>",
      reviews: [
        { author: "노은재", rating: 4, body: "무광이라 고급져 보여요. 세트 가성비 좋아요.", date: "2025-11-15" },
      ],
    },
    {
      id: "desk-lamp",
      name: "ARC DESK LAMP",
      price: 156000,
      category: "living",
      tag: "new",
      description: "화이트 메탈 아크. 딤머 터치, 미니멀 베이스.",
      colors: ["화이트", "블랙"],
      sizes: ["ONE"],
      detailHtml:
        "<p>터치 딤머 3단계로 밝기를 조절할 수 있습니다. LED 모듈 교체형으로 수명이 깁니다.</p><p>베이스는 미끄럼 방지 패드가 부착되어 있습니다.</p>",
      reviews: [
        { author: "장태영", rating: 5, body: "책상 분위기 확 살아요. 딤머 편해요.", date: "2025-12-05" },
        { author: "임나래", rating: 5, body: "조립 쉽고 무게감 있어서 안 넘어가요.", date: "2025-12-09" },
      ],
    },
  ];

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function formatKRW(n) {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  // Persisted demo data (admin can edit).
  // Loaded here so the rest of the logic always uses the latest PRODUCTS/BANNER values.
  function normalizeProduct(p) {
    var stock =
      typeof p.stock === "number" && isFinite(p.stock) ? Math.max(0, Math.floor(p.stock)) : 20;
    var o = Object.assign({}, p, { stock: stock });
    o.colors =
      Array.isArray(o.colors) && o.colors.length ? o.colors.slice() : ["기본"];
    o.sizes =
      Array.isArray(o.sizes) && o.sizes.length ? o.sizes.slice() : ["ONE"];
    o.detailHtml =
      typeof o.detailHtml === "string" ? o.detailHtml : "";
    o.reviews = Array.isArray(o.reviews) ? o.reviews : [];
    return o;
  }

  function cartLineId(id, color, size) {
    return (
      id +
      "::" +
      String(color || "기본") +
      "::" +
      String(size || "ONE")
    );
  }

  function ensureCartLine(i) {
    if (!i || typeof i !== "object" || !i.id) return null;
    var color =
      i.color != null && String(i.color) !== ""
        ? String(i.color)
        : "기본";
    var size =
      i.size != null && String(i.size) !== "" ? String(i.size) : "ONE";
    var lineId = i.lineId || cartLineId(i.id, color, size);
    return Object.assign({}, i, {
      lineId: lineId,
      color: color,
      size: size,
      qty: Math.max(0, Math.floor(Number(i.qty) || 0)),
    });
  }

  function defaultVariant(p) {
    if (!p) return { color: "기본", size: "ONE" };
    return {
      color: (p.colors && p.colors[0]) || "기본",
      size: (p.sizes && p.sizes[0]) || "ONE",
    };
  }

  function avgReviewRating(reviews) {
    if (!reviews || !reviews.length) return 0;
    var s = 0;
    for (var i = 0; i < reviews.length; i++)
      s += Math.min(5, Math.max(0, Number(reviews[i].rating) || 0));
    return Math.round((s / reviews.length) * 10) / 10;
  }

  function starsHtml(rating) {
    var n = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
    var parts = "";
    for (var i = 1; i <= 5; i++) {
      parts +=
        '<span class="star' +
        (i <= n ? " is-on" : "") +
        '" aria-hidden="true">★</span>';
    }
    return (
      '<span class="review-stars" role="img" aria-label="' +
      n +
      '점">' +
      parts +
      "</span>"
    );
  }

  function readAuthCodes() {
    var m = readJSON(STORAGE.authCodes, {});
    return m && typeof m === "object" ? m : {};
  }

  function writeAuthCodes(m) {
    writeJSON(STORAGE.authCodes, m);
  }

  function pruneAuthCodes(m) {
    var now = Date.now();
    Object.keys(m).forEach(function (k) {
      var e = m[k];
      if (!e || typeof e !== "object" || !e.exp || e.exp < now) delete m[k];
    });
  }

  /** 데모: 코드는 로컬에만 저장. 실서비스에서는 서버에서 메일 발송. */
  function issueAuthCode(email) {
    email = String(email || "").trim().toLowerCase();
    if (!email) return { ok: false, msg: "이메일을 입력해 주세요." };
    var code = String(Math.floor(100000 + Math.random() * 900000));
    var m = readAuthCodes();
    pruneAuthCodes(m);
    m[email] = { code: code, exp: Date.now() + AUTH_CODE_TTL_MS };
    writeAuthCodes(m);
    try {
      sessionStorage.setItem(SESSION_AUTH_EMAIL, email);
    } catch (e) {}
    return { ok: true, email: email, code: code };
  }

  function verifyAuthCode(email, code) {
    email = String(email || "").trim().toLowerCase();
    code = String(code || "").trim().replace(/\s/g, "");
    var m = readAuthCodes();
    pruneAuthCodes(m);
    var e = m[email];
    if (!e || e.exp < Date.now()) return false;
    return String(e.code) === code;
  }

  function consumeAuthCode(email) {
    email = String(email || "").trim().toLowerCase();
    var m = readAuthCodes();
    delete m[email];
    writeAuthCodes(m);
  }

  function openAuthCodeMailto(email, code) {
    var sub = encodeURIComponent("[DERKERK] 이메일 인증코드");
    var body = encodeURIComponent(
      "인증코드: " +
        code +
        "\n\n※ 데모 페이지: 메일 앱이 열리면 위 코드를 복사해 입력란에 붙여 넣으세요. 실서비스에서는 서버가 자동으로 메일을 보냅니다."
    );
    try {
      window.location.href =
        "mailto:" + encodeURIComponent(email) + "?subject=" + sub + "&body=" + body;
    } catch (err) {}
  }

  (function hydratePersistedState() {
    try {
      var persisted = readJSON(STORAGE.products, null);
      if (Array.isArray(persisted) && persisted.length > 0) {
        PRODUCTS = persisted.map(normalizeProduct);
      } else {
        PRODUCTS = PRODUCTS.map(normalizeProduct);
      }
    } catch (e) {
      PRODUCTS = PRODUCTS.map(normalizeProduct);
    }
  })();

  function getBanner() {
    var b = readJSON(STORAGE.banner, null);
    if (!b) {
      return {
        marqueeText: "무료 배송 · 7만원 이상 결제 시 · 블랙 & 화이트 컬렉션",
        heroKicker: "Seoul · Monochrome",
        heroTitle: "톤을 맞춘 옷과 물건들.<br />과하지 않게, 완성 있게.",
        heroLead:
          "검정과 흰색만으로 만든 컬렉션. 장바구니·찜·검색·로그인은 브라우저에 저장되는 데모이며, 배포 후 Supabase·토스로 연결하면 실서비스와 동일한 흐름으로 확장할 수 있습니다.",
      };
    }
    return b;
  }

  function persistBanner(banner) {
    writeJSON(STORAGE.banner, banner);
    window.dispatchEvent(new CustomEvent("derkerk:banner"));
  }

  function getCart() {
    var c = readJSON(STORAGE.cart, []);
    if (!Array.isArray(c) || c.length === 0) {
      var old = readJSON("derkerk.cart.v2", []);
      if (Array.isArray(old) && old.length > 0) {
        c = old;
        writeJSON(STORAGE.cart, c);
        try {
          localStorage.removeItem("derkerk.cart.v2");
        } catch (e0) {}
      }
    }
    if (!Array.isArray(c)) return [];
    return c.map(ensureCartLine).filter(Boolean);
  }

  function setCart(items) {
    writeJSON(STORAGE.cart, items);
    window.dispatchEvent(new CustomEvent("derkerk:cart"));
  }

  function cartCount(items) {
    return items.reduce(function (s, i) {
      return s + (i.qty || 0);
    }, 0);
  }

  function cartSubtotal(items) {
    return items.reduce(function (s, i) {
      return s + i.price * i.qty;
    }, 0);
  }

  function addToCart(productId, qty, color, size) {
    qty = Math.max(1, Math.floor(Number(qty) || 1));
    var p = PRODUCTS.find(function (x) {
      return x.id === productId;
    });
    if (!p) return;

    var stock = typeof p.stock === "number" ? p.stock : 0;
    stock = Math.max(0, Math.floor(stock));
    if (stock <= 0) {
      alert("품절입니다.");
      return;
    }

    var colors = p.colors && p.colors.length ? p.colors : ["기본"];
    var sizes = p.sizes && p.sizes.length ? p.sizes : ["ONE"];
    color = colors.indexOf(color) >= 0 ? color : colors[0];
    size = sizes.indexOf(size) >= 0 ? size : sizes[0];

    var lineId = cartLineId(p.id, color, size);
    var items = getCart();
    var idx = items.findIndex(function (i) {
      return i.lineId === lineId;
    });

    var currentQty = idx >= 0 ? items[idx].qty : 0;
    var nextQty = currentQty + qty;
    nextQty = Math.min(stock, Math.max(0, Math.floor(nextQty)));

    var line = {
      lineId: lineId,
      id: p.id,
      name: p.name,
      price: p.price,
      qty: nextQty,
      color: color,
      size: size,
    };

    if (idx >= 0) items[idx] = line;
    else if (nextQty > 0) items.push(line);
    setCart(items);
  }

  function setLineQty(lineId, qty) {
    var items = getCart();
    var line = items.find(function (i) {
      return i.lineId === lineId;
    });
    if (!line) return;
    var p = PRODUCTS.find(function (x) {
      return x.id === line.id;
    });
    var stock = p && typeof p.stock === "number" ? p.stock : 0;
    stock = Math.max(0, Math.floor(stock));

    qty = Math.floor(qty || 0);
    qty = Math.max(0, qty);
    qty = Math.min(stock, qty);

    if (qty <= 0) {
      setCart(
        items.filter(function (i) {
          return i.lineId !== lineId;
        })
      );
      return;
    }

    setCart(
      items.map(function (i) {
        if (i.lineId !== lineId) return i;
        return Object.assign({}, i, { qty: qty });
      })
    );
  }

  function removeLine(lineId) {
    setCart(
      getCart().filter(function (i) {
        return i.lineId !== lineId;
      })
    );
  }

  function getSession() {
    var s = readJSON(STORAGE.session, null);
    if (s && typeof s === "object") {
      if (typeof s.isAdmin !== "boolean") {
        s.isAdmin = s.email === "undermask1028@gmail.com";
      }
    }
    return s;
  }

  function setSession(user) {
    if (!user) localStorage.removeItem(STORAGE.session);
    else writeJSON(STORAGE.session, user);
    window.dispatchEvent(new CustomEvent("derkerk:session"));
  }

  function getUsers() {
    var u = readJSON(STORAGE.users, []);
    return Array.isArray(u) ? u : [];
  }

  function saveUsers(users) {
    writeJSON(STORAGE.users, users);
  }

  function getWishlist() {
    var w = readJSON(STORAGE.wishlist, []);
    return Array.isArray(w) ? w : [];
  }

  function setWishlist(ids) {
    writeJSON(STORAGE.wishlist, ids);
    window.dispatchEvent(new CustomEvent("derkerk:wishlist"));
  }

  function toggleWishlist(productId) {
    var w = getWishlist();
    var i = w.indexOf(productId);
    if (i >= 0) w.splice(i, 1);
    else w.push(productId);
    setWishlist(w);
    return w.indexOf(productId) >= 0;
  }

  function isWishlisted(productId) {
    return getWishlist().indexOf(productId) >= 0;
  }

  function getOrders() {
    var o = readJSON(STORAGE.orders, []);
    return Array.isArray(o) ? o : [];
  }

  function addOrder(order) {
    var list = getOrders();
    list.unshift(order);
    writeJSON(STORAGE.orders, list);
  }

  function pageHref(name) {
    return "./" + name;
  }

  function getPrefs() {
    var raw = readJSON(STORAGE.prefs, {});
    var st = raw.scrollTone;
    return {
      scrollTone: typeof st === "boolean" ? st : true,
    };
  }

  function savePrefs(partial) {
    var next = Object.assign({}, getPrefs(), partial || {});
    writeJSON(STORAGE.prefs, next);
    try {
      window.dispatchEvent(new CustomEvent("derkerk:prefs"));
    } catch (e) {}
  }

  /** 로그인 후 이동 (화이트리스트). */
  function getLoginNextHref() {
    var q = new URLSearchParams(window.location.search);
    var raw = (q.get("next") || "").trim();
    if (!raw) return null;
    var dec = decodeURIComponent(raw).replace(/^\.\//, "").replace(/^\//, "");
    var path = dec.split("?")[0];
    if (path !== "checkout.html") return null;
    var qi = dec.indexOf("?");
    var qs = qi >= 0 ? dec.slice(qi) : "";
    return pageHref("checkout.html") + qs;
  }

  function currentPage() {
    var body = document.body;
    return body.getAttribute("data-page") || "";
  }

  function productThumbClass(id) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 360;
    return "thumb-gradient thumb-h-" + (h % 6);
  }

  /** 카탈로그 이미지 (assets/products/derkerk-{id}.png, 머그만 svg) */
  function productImageSrc(p) {
    if (!p || !p.id) return "";
    if (p.id === "ceramic-mug") return "./assets/products/derkerk-ceramic-mug.svg";
    return "./assets/products/derkerk-" + p.id + ".png";
  }

  function renderHeader() {
    var el = $("#site-header");
    if (!el) return;
    var cart = getCart();
    var count = cartCount(cart);
    var session = getSession();
    var page = currentPage();

    var params = new URLSearchParams(window.location.search);
    var tag = (params.get("tag") || "").trim().toLowerCase();
    var cat = (params.get("category") || "").trim().toLowerCase();
    var activeNav = page;

    if (page === "home") activeNav = "home";
    if (page === "shop" || page === "product") {
      if (tag === "new") activeNav = "shop-new";
      else if (tag === "sale") activeNav = "shop-sale";
      else if (cat === "apparel") activeNav = "shop-apparel";
      else if (cat === "bags") activeNav = "shop-bags";
      else activeNav = "shop";
    }
    if (page === "orders") activeNav = "orders";
    if (page === "admin") activeNav = "admin";
    if (page === "shipping" || page === "returns" || page === "faq")
      activeNav = "support";

    function navClass(name) {
      return activeNav === name ? "nav-link is-active" : "nav-link";
    }

    el.innerHTML =
      '<header class="site-header">' +
      '<div class="header-top">' +
      '<p class="header-marquee">' +
      escapeHtml(getBanner().marqueeText) +
      "</p>" +
      "</div>" +
      '<div class="container header-main">' +
      '<div class="header-row">' +
      '<a class="logo" href="' +
      pageHref("index.html") +
      '"><span class="logo-mark">D</span><span class="logo-text">DERKERK</span></a>' +
      '<form class="search-form" action="' +
      pageHref("shop.html") +
      '" method="get" role="search">' +
      '<label class="visually-hidden" for="global-search">상품 검색</label>' +
      '<input id="global-search" class="search-input" type="search" name="q" placeholder="브랜드, 상품명, 카테고리 검색" autocomplete="off" />' +
      '<button type="submit" class="search-btn" aria-label="검색">검색</button>' +
      "</form>" +
      '<div class="header-actions">' +
      (session
        ? '<a class="icon-link" href="' +
          pageHref("account.html") +
          '" title="내 계정"><span class="icon-user" aria-hidden="true"></span><span class="icon-label">' +
          escapeHtml(session.name || "계정") +
          "</span></a>"
        : '<a class="icon-link" href="' +
          pageHref("login.html") +
          '" title="로그인"><span class="icon-user" aria-hidden="true"></span><span class="icon-label">로그인</span></a>') +
      '<a class="icon-link" href="' +
      pageHref("wishlist.html") +
      '" title="찜 목록"><span class="icon-heart" aria-hidden="true"></span><span class="icon-label">찜</span></a>' +
      '<a class="icon-link cart-link" href="' +
      pageHref("cart.html") +
      '" title="장바구니"><span class="icon-bag" aria-hidden="true"></span><span class="icon-label">장바구니</span>' +
      (count > 0 ? '<span class="badge">' + count + "</span>" : "") +
      "</a>" +
      "</div>" +
      '<button type="button" class="menu-toggle" aria-expanded="false" aria-label="메뉴">' +
      "<span></span><span></span><span></span></button>" +
      "</div>" +
      '<nav class="nav-bar" aria-label="주요 메뉴">' +
      '<a class="' +
      navClass("home") +
      '" href="' +
      pageHref("index.html") +
      '">홈</a>' +
      '<a class="' +
      navClass("shop") +
      '" href="' +
      pageHref("shop.html") +
      '">전체 상품</a>' +
      '<a class="' +
      navClass("shop-new") +
      '" href="' +
      pageHref("shop.html") +
      '?tag=new">신상</a>' +
      '<a class="' +
      navClass("shop-sale") +
      '" href="' +
      pageHref("shop.html") +
      '?tag=sale">세일</a>' +
      '<a class="' +
      navClass("shop-apparel") +
      '" href="' +
      pageHref("shop.html") +
      '?category=apparel">의류</a>' +
      '<a class="' +
      navClass("shop-bags") +
      '" href="' +
      pageHref("shop.html") +
      '?category=bags">가방</a>' +
      '<a class="' +
      navClass("support") +
      '" href="' +
      pageHref("faq.html") +
      '">고객센터</a>' +
      '<a class="' +
      navClass("orders") +
      '" href="' +
      pageHref("orders.html") +
      '">주문 내역</a>' +
      (session && session.isAdmin
        ? '<a class="' +
          navClass("admin") +
          '" href="' +
          pageHref("admin.html") +
          '">관리자</a>'
        : "") +
      "</nav>" +
      "</div>" +
      "</header>";

    var qInput = $("#global-search", el);
    var params = new URLSearchParams(window.location.search);
    if (qInput && params.get("q")) qInput.value = params.get("q");

    var toggle = $(".menu-toggle", el);
    var navBar = $(".nav-bar", el);
    if (toggle && navBar) {
      toggle.addEventListener("click", function () {
        var open = navBar.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  function renderFooter() {
    var el = $("#site-footer");
    if (!el) return;
    el.innerHTML =
      '<footer class="site-footer">' +
      '<div class="container footer-grid">' +
      "<div>" +
      '<p class="footer-brand">DERKERK</p>' +
      '<p class="footer-desc">블랙 & 화이트 투톤 커머스. 정적 데모 — 나중에 Supabase·토스·Vercel로 확장.</p>' +
      "</div>" +
      "<div>" +
      '<p class="footer-title">쇼핑</p>' +
      '<ul class="footer-links">' +
      '<li><a href="' +
      pageHref("shop.html") +
      '">전체 상품</a></li>' +
      '<li><a href="' +
      pageHref("shop.html") +
      '?tag=new">신상</a></li>' +
      '<li><a href="' +
      pageHref("cart.html") +
      '">장바구니</a></li>' +
      '<li><a href="' +
      pageHref("wishlist.html") +
      '">찜 목록</a></li>' +
      "</ul></div>" +
      "<div>" +
      '<p class="footer-title">고객 지원</p>' +
      '<ul class="footer-links">' +
      '<li><a href="' +
      pageHref("shipping.html") +
      '">배송 안내</a></li>' +
      '<li><a href="' +
      pageHref("returns.html") +
      '">교환 · 반품</a></li>' +
      '<li><a href="' +
      pageHref("faq.html") +
      '">FAQ</a></li>' +
      "</ul></div>" +
      "<div>" +
      '<p class="footer-title">회원</p>' +
      '<ul class="footer-links">' +
      '<li><a href="' +
      pageHref("login.html") +
      '">로그인</a></li>' +
      '<li><a href="' +
      pageHref("register.html") +
      '">회원가입</a></li>' +
      '<li><a href="' +
      pageHref("account.html") +
      '">내 정보</a></li>' +
      '<li><a href="' +
      pageHref("orders.html") +
      '">주문 내역</a></li>' +
      "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom container footer-bottom--split">' +
      "<p>© " +
      new Date().getFullYear() +
      " DERKERK. All rights reserved.</p>" +
      '<label class="pref-toggle" title="스크롤에 따른 화이트/블랙 톤 전환">' +
      '<span class="pref-toggle__text">톤 애니메이션</span>' +
      '<input type="checkbox" id="pref-scroll-tone" class="pref-toggle__input" />' +
      '<span class="pref-toggle__track" aria-hidden="true"><span class="pref-toggle__knob"></span></span>' +
      "</label></div>" +
      "</footer>";
  }

  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function productCardHTML(p) {
    var tag =
      p.tag === "new"
        ? '<span class="tag tag-new">NEW</span>'
        : p.tag === "sale"
          ? '<span class="tag tag-sale">SALE</span>'
          : "";
    var inStock = typeof p.stock === "number" ? p.stock > 0 : true;
    var addCartHtml = inStock
      ? '<button type="button" class="btn btn-ghost btn-sm js-add-cart" data-id="' +
        escapeHtml(p.id) +
        '">장바구니</button>'
      : '<button type="button" class="btn btn-ghost btn-sm" disabled>품절</button>';
    return (
      '<article class="product-card">' +
      '<a class="product-card-link" href="' +
      pageHref("product.html") +
      "?id=" +
      encodeURIComponent(p.id) +
      '">' +
      '<div class="product-card-media has-image ' +
      productThumbClass(p.id) +
      '">' +
      tag +
      '<img class="product-card-img" src="' +
      productImageSrc(p) +
      '" alt="' +
      escapeHtml(p.name) +
      '" loading="lazy" width="800" height="600" />' +
      '<span class="product-card-logo">DERKERK</span>' +
      "</div>" +
      '<div class="product-card-body">' +
      '<h3 class="product-card-title">' +
      escapeHtml(p.name) +
      "</h3>" +
      '<p class="product-card-desc">' +
      escapeHtml(p.description.slice(0, 72)) +
      (p.description.length > 72 ? "…" : "") +
      "</p>" +
      '<p class="product-card-price">' +
      formatKRW(p.price) +
      "</p>" +
      "</div></a>" +
      '<div class="product-card-actions">' +
      addCartHtml +
      '<button type="button" class="btn btn-ghost btn-sm js-wish-toggle' +
      (isWishlisted(p.id) ? " is-on" : "") +
      '" data-id="' +
      escapeHtml(p.id) +
      '" aria-pressed="' +
      (isWishlisted(p.id) ? "true" : "false") +
      '">찜</button>' +
      "</div></article>"
    );
  }

  function bindProductCardActions(root) {
    root = root || document;
    $all(".js-add-cart", root).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var pid = btn.getAttribute("data-id");
        var pr = PRODUCTS.find(function (x) {
          return x.id === pid;
        });
        var dv = defaultVariant(pr);
        addToCart(pid, 1, dv.color, dv.size);
        btn.textContent = "담았습니다";
        setTimeout(function () {
          btn.textContent = "장바구니";
        }, 1200);
      });
    });
    $all(".js-wish-toggle", root).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id = btn.getAttribute("data-id");
        var on = toggleWishlist(id);
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
  }

  function initHome() {
    var grid = $("#featured-grid");
    if (!grid) return;

    // Apply admin-edited banner contents on the home hero.
    var banner = getBanner();
    var hk = $("#hero-kicker");
    var ht = $("#hero-title");
    var hl = $("#hero-lead");
    if (hk) hk.textContent = banner.heroKicker;
    if (ht) ht.innerHTML = banner.heroTitle;
    if (hl) hl.textContent = banner.heroLead;

    var featured = PRODUCTS.filter(function (p) {
      return p.tag === "new";
    }).slice(0, 4);
    if (featured.length < 4) featured = PRODUCTS.slice(0, 4);
    grid.innerHTML = featured.map(productCardHTML).join("");
    bindProductCardActions(grid);
  }

  var scrollToneOnScroll = null;

  function applyScrollTone() {
    if (scrollToneOnScroll) {
      window.removeEventListener("scroll", scrollToneOnScroll);
      scrollToneOnScroll = null;
    }
    var enabled = getPrefs().scrollTone !== false;
    var range = 320;
    if (!enabled) {
      var home = currentPage() === "home";
      document.body.style.setProperty("--scroll-tone-t", home ? "0" : "1");
      return;
    }
    scrollToneOnScroll = function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var home = currentPage() === "home";
      var t = home
        ? Math.min(1, Math.max(0, y / range))
        : y >= range
          ? 1
          : 0;
      document.body.style.setProperty("--scroll-tone-t", String(t));
    };
    scrollToneOnScroll();
    window.addEventListener("scroll", scrollToneOnScroll, { passive: true });
  }

  function initScrollTone() {
    applyScrollTone();
    window.addEventListener("derkerk:prefs", applyScrollTone);
  }

  function initPrefToggles() {
    var input = document.getElementById("pref-scroll-tone");
    if (!input) return;
    input.checked = getPrefs().scrollTone !== false;
    input.addEventListener("change", function () {
      savePrefs({ scrollTone: input.checked });
      applyScrollTone();
    });
  }

  function mountCheckoutAuthModal(onGuest, onClose) {
    var existing = document.getElementById("derkerk-checkout-auth-modal");
    if (existing) {
      existing.hidden = false;
      existing.setAttribute("aria-hidden", "false");
      return existing;
    }
    var wrap = document.createElement("div");
    wrap.id = "derkerk-checkout-auth-modal";
    wrap.className = "modal-overlay";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "derkerk-checkout-auth-title");
    wrap.innerHTML =
      '<div class="modal-overlay__backdrop" data-modal-close tabindex="-1"></div>' +
      '<div class="modal-overlay__card">' +
      '<h2 id="derkerk-checkout-auth-title" class="modal-overlay__title">결제 방법</h2>' +
      "<p class=\"muted\" style=\"margin:0 0 20px;font-size:14px;line-height:1.5\">" +
      "로그인 후 주문하시겠어요, 아니면 비회원으로 진행할까요?" +
      "</p>" +
      '<a class="btn btn-primary" style="width:100%;margin-bottom:10px" href="' +
      pageHref("login.html") +
      "?next=" +
      encodeURIComponent("checkout.html") +
      '">로그인하고 결제</a>' +
      '<button type="button" class="btn btn-ghost" style="width:100%;margin-bottom:12px" id="derkerk-checkout-guest-btn">' +
      "비회원으로 구매하기" +
      "</button>" +
      '<button type="button" class="link-btn" style="width:100%;text-align:center" data-modal-close>닫기</button>' +
      "</div>";
    document.body.appendChild(wrap);

    function close() {
      wrap.hidden = true;
      wrap.setAttribute("aria-hidden", "true");
      if (onClose) onClose();
    }

    wrap.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-modal-close") != null) close();
    });

    var g = document.getElementById("derkerk-checkout-guest-btn");
    if (g)
      g.addEventListener("click", function () {
        try {
          sessionStorage.setItem(SESSION_CHECKOUT_GUEST, "1");
        } catch (err) {}
        close();
        if (onGuest) onGuest();
      });

    wrap.hidden = false;
    wrap.setAttribute("aria-hidden", "false");
    return wrap;
  }

  function initShop() {
    var grid = $("#shop-grid");
    var empty = $("#shop-empty");
    if (!grid) return;
    var params = new URLSearchParams(window.location.search);
    var q = (params.get("q") || "").trim().toLowerCase();
    var cat = (params.get("category") || "").trim().toLowerCase();
    var tag = (params.get("tag") || "").trim().toLowerCase();

    var list = PRODUCTS.filter(function (p) {
      if (cat && p.category !== cat) return false;
      if (tag && p.tag !== tag) return false;
      if (q) {
        var blob = (p.name + " " + p.description + " " + p.category).toLowerCase();
        if (blob.indexOf(q) < 0) return false;
      }
      return true;
    });

    var title = $("#shop-title");
    var sub = $("#shop-sub");
    if (title) {
      if (q) title.textContent = '“' + q + '” 검색 결과';
      else if (tag === "new") title.textContent = "신상";
      else if (tag === "sale") title.textContent = "세일";
      else if (cat) title.textContent = categoryLabel(cat);
      else title.textContent = "전체 상품";
    }
    if (sub) sub.textContent = list.length + "개 상품";

    if (list.length === 0) {
      grid.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    grid.innerHTML = list.map(productCardHTML).join("");
    bindProductCardActions(grid);
  }

  function categoryLabel(c) {
    var map = {
      apparel: "의류",
      accessories: "액세서리",
      bags: "가방",
      jewelry: "주얼리",
      living: "리빙",
    };
    return map[c] || c;
  }

  function productVariantChipsHtml(kind, values, selected) {
    return values
      .map(function (v) {
        var on = v === selected ? " is-selected" : "";
        return (
          '<button type="button" class="variant-chip' +
          on +
          '" data-variant="' +
          kind +
          '" data-value="' +
          escapeHtml(v) +
          '">' +
          escapeHtml(v) +
          "</button>"
        );
      })
      .join("");
  }

  function productReviewsSectionHtml(p) {
    var list = p.reviews || [];
    var avg = avgReviewRating(list);
    var head =
      '<section class="product-reviews" aria-label="리뷰">' +
      '<h2 class="product-section-title">리뷰 · 별점</h2>' +
      '<p class="product-rating-summary">' +
      starsHtml(Math.round(avg)) +
      ' <span class="product-rating-num"><strong>' +
      (list.length ? avg : "–") +
      "</strong>" +
      (list.length ? " / 5" : "") +
      "</span>" +
      '<span class="muted"> · ' +
      list.length +
      "개</span></p>";
    if (!list.length)
      return head + '<p class="muted">아직 등록된 리뷰가 없습니다.</p></section>';
    var items = list
      .map(function (r) {
        return (
          '<li class="review-item">' +
          '<div class="review-item__meta">' +
          starsHtml(r.rating) +
          " <span>" +
          escapeHtml(r.author || "") +
          '</span> <span class="muted">' +
          escapeHtml(r.date || "") +
          "</span></div>" +
          '<p class="review-item__text">' +
          escapeHtml(r.body || "") +
          "</p></li>"
        );
      })
      .join("");
    return head + "<ul class=\"review-list\">" + items + "</ul></section>";
  }

  function initProduct() {
    var root = $("#product-root");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || PRODUCTS[0].id;
    var p = PRODUCTS.find(function (x) {
      return x.id === id;
    });
    if (!p) {
      root.innerHTML = '<p class="muted">상품을 찾을 수 없습니다.</p>';
      return;
    }
    var colors = p.colors || ["기본"];
    var sizes = p.sizes || ["ONE"];
    var qColor = params.get("color");
    var qSize = params.get("size");
    var selColor = colors.indexOf(qColor) >= 0 ? qColor : colors[0];
    var selSize = sizes.indexOf(qSize) >= 0 ? qSize : sizes[0];

    var tag =
      p.tag === "new"
        ? '<span class="tag tag-new">NEW</span>'
        : p.tag === "sale"
          ? '<span class="tag tag-sale">SALE</span>'
          : "";
    var wishOn = isWishlisted(p.id);
    var stock = typeof p.stock === "number" ? p.stock : 0;
    var inStock = stock > 0;
    var stockLine = inStock
      ? '<p class="muted" style="margin-top: 14px">재고 ' + stock + "개</p>"
      : '<p class="muted" style="margin-top: 14px">품절</p>';
    var addButtonHtml = inStock
      ? '<button type="button" class="btn btn-primary js-add-cart-main" data-id="' +
        escapeHtml(p.id) +
        '">장바구니 담기</button>'
      : '<button type="button" class="btn btn-ghost" disabled>품절</button>';

    var detailBlock =
      p.detailHtml && String(p.detailHtml).trim()
        ? '<section class="product-detail-rich" aria-label="상세 설명"><h2 class="product-section-title">상세 설명</h2><div class="product-detail-html">' +
          p.detailHtml +
          "</div></section>"
        : "";

    root.innerHTML =
      '<div class="product-layout">' +
      '<div class="product-gallery">' +
      '<div class="product-hero has-image ' +
      productThumbClass(p.id) +
      '">' +
      tag +
      '<img class="product-hero-img" src="' +
      productImageSrc(p) +
      '" alt="' +
      escapeHtml(p.name) +
      '" width="800" height="800" />' +
      '<span class="product-hero-logo">DERKERK</span>' +
      "</div></div>" +
      '<div class="product-detail">' +
      '<p class="kicker">' +
      categoryLabel(p.category).toUpperCase() +
      "</p>" +
      "<h1>" +
      escapeHtml(p.name) +
      "</h1>" +
      '<p class="lead">' +
      escapeHtml(p.description) +
      "</p>" +
      '<p class="price-lg">' +
      formatKRW(p.price) +
      "</p>" +
      stockLine +
      '<div class="product-variants">' +
      '<div class="variant-row"><span class="variant-label">컬러</span><div class="variant-chips" data-variant-group="color">' +
      productVariantChipsHtml("color", colors, selColor) +
      "</div></div>" +
      '<div class="variant-row"><span class="variant-label">사이즈</span><div class="variant-chips" data-variant-group="size">' +
      productVariantChipsHtml("size", sizes, selSize) +
      "</div></div>" +
      '<div class="variant-row variant-row--qty"><label class="variant-label" for="prod-qty">수량</label>' +
      '<input type="number" class="input product-qty-input" id="prod-qty" min="1" max="' +
      stock +
      '" value="1" ' +
      (inStock ? "" : "disabled") +
      "/></div></div>" +
      '<div class="product-cta">' +
      addButtonHtml +
      '<button type="button" class="btn btn-ghost js-wish-main' +
      (wishOn ? " is-on" : "") +
      '" data-id="' +
      escapeHtml(p.id) +
      '">찜하기</button>' +
      "</div>" +
      '<ul class="product-meta">' +
      "<li>무료 배송 7만원 이상</li>" +
      "<li>7일 이내 미개봉 교환</li>" +
      "<li>문의: support@derkerk.io (데모)</li>" +
      "</ul></div></div>" +
      detailBlock +
      productReviewsSectionHtml(p);

    function selectedVariant(kind) {
      var g = root.querySelector(
        '.variant-chips[data-variant-group="' + kind + '"]'
      );
      if (!g) return kind === "color" ? selColor : selSize;
      var btn = g.querySelector(".variant-chip.is-selected");
      return (btn && btn.getAttribute("data-value")) || (kind === "color" ? selColor : selSize);
    }

    $all(".variant-chip", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var g = btn.closest(".variant-chips");
        if (!g) return;
        $all(".variant-chip", g).forEach(function (b) {
          b.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
      });
    });

    var addBtn = $(".js-add-cart-main", root);
    if (addBtn)
      addBtn.addEventListener("click", function () {
        var qIn = $("#prod-qty", root);
        var q = qIn ? Math.max(1, Math.floor(Number(qIn.value) || 1)) : 1;
        addToCart(p.id, q, selectedVariant("color"), selectedVariant("size"));
        addBtn.textContent = "담았습니다";
        setTimeout(function () {
          addBtn.textContent = "장바구니 담기";
        }, 1200);
      });
    var wBtn = $(".js-wish-main", root);
    if (wBtn)
      wBtn.addEventListener("click", function () {
        var on = toggleWishlist(p.id);
        wBtn.classList.toggle("is-on", on);
        wBtn.textContent = on ? "찜 해제" : "찜하기";
      });
  }

  function initCart() {
    var tbody = $("#cart-tbody");
    var empty = $("#cart-empty");
    var subEl = $("#cart-subtotal");
    var aside = $("#cart-aside");
    if (!tbody) return;
    function render() {
      var items = getCart();
      if (items.length === 0) {
        tbody.innerHTML = "";
        if (empty) empty.hidden = false;
        if (aside) aside.hidden = true;
        return;
      }
      if (empty) empty.hidden = true;
      if (aside) aside.hidden = false;
      tbody.innerHTML = items
        .map(function (i) {
          var lid = escapeHtml(i.lineId);
          var pHref =
            pageHref("product.html") +
            "?id=" +
            encodeURIComponent(i.id) +
            "&color=" +
            encodeURIComponent(i.color || "") +
            "&size=" +
            encodeURIComponent(i.size || "");
          return (
            "<tr>" +
            "<td><a class=\"cart-product-link\" href=\"" +
            pHref +
            '"><strong>' +
            escapeHtml(i.name) +
            "</strong></a><br/><span class='muted'>" +
            escapeHtml(i.id) +
            "</span></td>" +
            "<td>" +
            escapeHtml(i.color || "–") +
            "</td>" +
            "<td>" +
            escapeHtml(i.size || "–") +
            "</td>" +
            "<td>" +
            formatKRW(i.price) +
            "</td>" +
            "<td>" +
            '<div class="qty">' +
            '<button type="button" class="qty-btn" data-act="minus" data-line="' +
            lid +
            '">−</button>' +
            "<span>" +
            i.qty +
            "</span>" +
            '<button type="button" class="qty-btn" data-act="plus" data-line="' +
            lid +
            '">+</button>' +
            "</div></td>" +
            "<td>" +
            formatKRW(i.price * i.qty) +
            "</td>" +
            "<td>" +
            '<button type="button" class="link-btn js-remove" data-line="' +
            lid +
            '">삭제</button>' +
            "</td></tr>"
          );
        })
        .join("");
      if (subEl) subEl.textContent = formatKRW(cartSubtotal(items));

      tbody.onclick = function (e) {
        var t = e.target;
        if (!t.getAttribute || !t.getAttribute("data-act")) return;
        var lineId = t.getAttribute("data-line");
        var act = t.getAttribute("data-act");
        var line = getCart().find(function (x) {
          return x.lineId === lineId;
        });
        if (!line) return;
        if (act === "minus") setLineQty(lineId, line.qty - 1);
        if (act === "plus") setLineQty(lineId, line.qty + 1);
        render();
      };
      $all(".js-remove", tbody).forEach(function (b) {
        b.addEventListener("click", function () {
          removeLine(b.getAttribute("data-line"));
          render();
        });
      });
    }
    render();
    window.addEventListener("derkerk:cart", render);

    var checkoutBtn = $("#cart-checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        var items = getCart();
        if (!items.length) return;
        if (getSession()) {
          window.location.href = pageHref("checkout.html");
          return;
        }
        mountCheckoutAuthModal(function () {
          window.location.href = pageHref("checkout.html");
        }, null);
      });
    }
  }

  function initCheckout() {
    var form = $("#checkout-form");
    var summary = $("#checkout-summary");
    if (!summary) return;

    if (!getSession() && sessionStorage.getItem(SESSION_CHECKOUT_GUEST) !== "1") {
      mountCheckoutAuthModal(null, null);
    }
    function render() {
      var items = getCart();
      var sub = cartSubtotal(items);
      summary.innerHTML =
        items.length === 0
          ? "<p class='muted'>장바구니가 비어 있습니다.</p>"
          : "<ul class='checkout-lines'>" +
            items
              .map(function (i) {
                var opt =
                  (i.color ? " · " + escapeHtml(i.color) : "") +
                  (i.size ? " / " + escapeHtml(i.size) : "");
                return (
                  "<li><span>" +
                  escapeHtml(i.name) +
                  opt +
                  " × " +
                  i.qty +
                  "</span><span>" +
                  formatKRW(i.price * i.qty) +
                  "</span></li>"
                );
              })
              .join("") +
            "</ul>" +
            "<p class='checkout-total'><span>합계</span><span>" +
            formatKRW(sub) +
            "</span></p>";
    }
    render();
    window.addEventListener("derkerk:cart", render);

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var items = getCart();
        if (items.length === 0) {
          alert("장바구니가 비어 있습니다.");
          return;
        }
        if (
          !getSession() &&
          sessionStorage.getItem(SESSION_CHECKOUT_GUEST) !== "1"
        ) {
          alert("로그인하거나 ‘비회원으로 구매하기’를 선택해 주세요.");
          mountCheckoutAuthModal(null, null);
          return;
        }
        var name = ($("#co-name") && $("#co-name").value) || "고객";
        var email = ($("#co-email") && $("#co-email").value) || "";
        var phone = ($("#co-phone") && $("#co-phone").value) || "";
        var addr = ($("#co-addr") && $("#co-addr").value) || "";
        var orderId = "DK" + Date.now().toString(36).toUpperCase();

        // Demo 결제: 주문 생성과 동시에 재고 차감 + 저장
        items.forEach(function (li) {
          var p = PRODUCTS.find(function (x) {
            return x.id === li.id;
          });
          if (!p) return;
          var stock = typeof p.stock === "number" ? p.stock : 0;
          stock = Math.max(0, Math.floor(stock));
          p.stock = Math.max(0, stock - (li.qty || 0));
        });
        writeJSON(STORAGE.products, PRODUCTS);

        addOrder({
          id: orderId,
          at: new Date().toISOString(),
          name: name,
          email: email,
          phone: phone,
          address: addr,
          items: items.slice(),
          total: cartSubtotal(items),
          status: "결제 완료 (데모)",
        });
        setCart([]);
        try {
          sessionStorage.removeItem(SESSION_CHECKOUT_GUEST);
        } catch (e2) {}
        window.location.href = pageHref("orders.html") + "?thanks=1";
      });
    }
  }

  function initLogin() {
    var stepEmail = $("#login-step-email");
    var form = $("#login-form");
    var sendBtn = $("#login-send-code");
    var backBtn = $("#login-change-email");
    if (!stepEmail || !form || !sendBtn) return;

    var demoBox = $("#login-demo-code");
    var demoVal = $("#login-demo-code-value");

    function showEmailStep() {
      stepEmail.hidden = false;
      form.hidden = true;
      if (demoBox) demoBox.hidden = true;
    }

    function showCodeStep(email, code) {
      stepEmail.hidden = true;
      form.hidden = false;
      if (demoBox && demoVal) {
        demoVal.textContent = code;
        demoBox.hidden = false;
      }
      var ci = $("#login-code");
      if (ci) ci.focus();
      openAuthCodeMailto(email, code);
    }

    sendBtn.addEventListener("click", function () {
      var emEl = $("#login-email");
      var email = (emEl && emEl.value) || "";
      var res = issueAuthCode(email);
      if (!res.ok) {
        alert(res.msg || "이메일을 확인해 주세요.");
        return;
      }
      showCodeStep(res.email, res.code);
    });

    if (backBtn)
      backBtn.addEventListener("click", function () {
        showEmailStep();
      });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var emEl = $("#login-email");
      var email = String((emEl && emEl.value) || "").trim().toLowerCase();
      var codeEl = $("#login-code");
      var code = (codeEl && codeEl.value) || "";
      if (!verifyAuthCode(email, code)) {
        alert("인증코드가 올바르지 않거나 만료되었습니다. 다시 받아 주세요.");
        return;
      }
      consumeAuthCode(email);
      var users = getUsers();
      var found = users.find(function (u) {
        return String(u.email || "").toLowerCase() === email;
      });
      if (!found) {
        alert("가입된 이메일이 없습니다. 회원가입 후 이용해 주세요.");
        showEmailStep();
        return;
      }
      setSession({
        email: found.email,
        name: found.name || email.split("@")[0],
        isAdmin: String(found.email).toLowerCase() === "undermask1028@gmail.com",
      });
      renderHeader();
      try {
        sessionStorage.removeItem(SESSION_CHECKOUT_GUEST);
      } catch (e0) {}
      var nextOk = getLoginNextHref();
      window.location.href = nextOk || pageHref("index.html");
    });
  }

  function initRegister() {
    var stepEmail = $("#reg-step-email");
    var form = $("#register-form");
    var sendBtn = $("#reg-send-code");
    var backBtn = $("#reg-change-email");
    if (!stepEmail || !form || !sendBtn) return;

    var demoBox = $("#reg-demo-code");
    var demoVal = $("#reg-demo-code-value");

    function showEmailStep() {
      stepEmail.hidden = false;
      form.hidden = true;
      if (demoBox) demoBox.hidden = true;
    }

    sendBtn.addEventListener("click", function () {
      var emEl = $("#reg-email");
      var email = (emEl && emEl.value) || "";
      var users = getUsers();
      if (users.some(function (u) { return String(u.email || "").toLowerCase() === String(email).trim().toLowerCase(); })) {
        alert("이미 가입된 이메일입니다. 로그인해 주세요.");
        return;
      }
      var res = issueAuthCode(email);
      if (!res.ok) {
        alert(res.msg || "이메일을 확인해 주세요.");
        return;
      }
      stepEmail.hidden = true;
      form.hidden = false;
      if (demoBox && demoVal) {
        demoVal.textContent = res.code;
        demoBox.hidden = false;
      }
      openAuthCodeMailto(res.email, res.code);
      var ci = $("#reg-code");
      if (ci) ci.focus();
    });

    if (backBtn)
      backBtn.addEventListener("click", function () {
        showEmailStep();
      });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var emEl = $("#reg-email");
      var email = String((emEl && emEl.value) || "").trim().toLowerCase();
      var code = ($("#reg-code") && $("#reg-code").value) || "";
      var name = ($("#reg-name") && $("#reg-name").value) || "";
      if (!verifyAuthCode(email, code)) {
        alert("인증코드가 올바르지 않거나 만료되었습니다.");
        return;
      }
      consumeAuthCode(email);
      var users = getUsers();
      if (users.some(function (u) { return String(u.email || "").toLowerCase() === email; })) {
        alert("이미 가입된 이메일입니다.");
        return;
      }
      users.push({
        name: String(name || "").trim() || email.split("@")[0],
        email: email,
        password: "",
      });
      saveUsers(users);
      setSession({
        email: email,
        name: String(name || "").trim() || email.split("@")[0],
        isAdmin: email === "undermask1028@gmail.com",
      });
      renderHeader();
      window.location.href = pageHref("index.html");
    });
  }

  function initAccount() {
    var box = $("#account-info");
    if (!box) return;
    var s = getSession();
    if (!s) {
      box.innerHTML =
        '<p class="muted">로그인이 필요합니다.</p><p><a class="btn btn-primary" href="' +
        pageHref("login.html") +
        '">로그인</a></p>';
      return;
    }
    box.innerHTML =
      "<p><strong>" +
      escapeHtml(s.name) +
      "</strong></p>" +
      "<p class='muted'>" +
      escapeHtml(s.email) +
      "</p>" +
      '<p class="account-actions"><button type="button" class="btn btn-ghost" id="btn-logout">로그아웃</button></p>';
    var lo = $("#btn-logout");
    if (lo)
      lo.addEventListener("click", function () {
        setSession(null);
        renderHeader();
        window.location.href = pageHref("index.html");
      });
  }

  function initOrders() {
    var list = $("#orders-list");
    if (!list) return;
    var params = new URLSearchParams(window.location.search);
    if (params.get("thanks")) {
      var banner = $("#order-thanks");
      if (banner) banner.hidden = false;
    }
    var orders = getOrders();
    if (orders.length === 0) {
      list.innerHTML =
        '<p class="muted">주문 내역이 없습니다.</p><p><a class="btn btn-primary" href="' +
        pageHref("shop.html") +
        '">쇼핑하러 가기</a></p>';
      return;
    }
    list.innerHTML = orders
      .map(function (o) {
        return (
          '<article class="order-card">' +
          "<header><strong>" +
          escapeHtml(o.id) +
          "</strong><span class='muted'>" +
          escapeHtml(o.at.slice(0, 10)) +
          "</span></header>" +
          "<p>" +
          formatKRW(o.total) +
          " · " +
          escapeHtml(o.status) +
          "</p>" +
          "<ul>" +
          o.items
            .map(function (i) {
              var bits = escapeHtml(i.name);
              if (i.color) bits += " · " + escapeHtml(String(i.color));
              if (i.size) bits += " / " + escapeHtml(String(i.size));
              return "<li>" + bits + " × " + i.qty + "</li>";
            })
            .join("") +
          "</ul></article>"
        );
      })
      .join("");
  }

  function initWishlist() {
    var grid = $("#wishlist-grid");
    var empty = $("#wishlist-empty");
    if (!grid) return;
    function render() {
      var ids = getWishlist();
      var prods = ids
        .map(function (id) {
          return PRODUCTS.find(function (p) {
            return p.id === id;
          });
        })
        .filter(Boolean);
      if (prods.length === 0) {
        grid.innerHTML = "";
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;
      grid.innerHTML = prods.map(productCardHTML).join("");
      bindProductCardActions(grid);
    }
    render();
    window.addEventListener("derkerk:wishlist", render);
  }

  function initAdmin() {
    var s = getSession();
    var isAdmin = !!(s && s.isAdmin);

    var rootBanner = $("#admin-banner");
    var rootInventory = $("#admin-inventory");
    var rootProducts = $("#admin-products");
    var rootOrders = $("#admin-orders");
    var rootUnauthorized = $("#admin-unauthorized");
    if (!rootBanner || !rootUnauthorized) return;

    function hideAll() {
      [rootBanner, rootInventory, rootProducts, rootOrders, rootUnauthorized].forEach(
        function (el) {
          if (!el) return;
          el.hidden = true;
        }
      );
    }

    function showTab(tab) {
      hideAll();
      if (tab === "banner" && rootBanner) rootBanner.hidden = false;
      if (tab === "inventory" && rootInventory) rootInventory.hidden = false;
      if (tab === "products" && rootProducts) rootProducts.hidden = false;
      if (tab === "orders" && rootOrders) rootOrders.hidden = false;
      if (!tab && rootBanner) rootBanner.hidden = false;
    }

    if (!isAdmin) {
      hideAll();
      rootUnauthorized.hidden = false;
      // 탭 버튼 비활성 처리
      $all(".admin-tab-btn").forEach(function (b) {
        b.disabled = true;
      });
      return;
    }

    // Initial render + tab selection
    var params = new URLSearchParams(window.location.search);
    var activeTab = params.get("tab") || "banner";

    function persistProducts() {
      writeJSON(STORAGE.products, PRODUCTS);
    }

    function persistOrders(list) {
      writeJSON(STORAGE.orders, list);
    }

    function renderBannerTab() {
      var b = getBanner();
      rootBanner.innerHTML =
        '<div class="kicker" style="margin-bottom: 12px">배너 관리</div>' +
        '<div class="form-stack">' +
        '<div>' +
        '<label class="label" for="banner-marquee">헤더 마퀴 문구</label>' +
        '<input class="input" id="banner-marquee" value="' +
        escapeHtml(b.marqueeText) +
        '" />' +
        "</div>" +
        '<div>' +
        '<label class="label" for="banner-hero-kicker">홈 헤더 킥커</label>' +
        '<input class="input" id="banner-hero-kicker" value="' +
        escapeHtml(b.heroKicker) +
        '" />' +
        "</div>" +
        '<div>' +
        '<label class="label" for="banner-hero-title">홈 헤더 타이틀 (HTML 허용: <br />)</label>' +
        '<textarea class="input" id="banner-hero-title" rows="3">' +
        escapeHtml(b.heroTitle) +
        "</textarea>" +
        "</div>" +
        '<div>' +
        '<label class="label" for="banner-hero-lead">홈 헤더 리드</label>' +
        '<textarea class="input" id="banner-hero-lead" rows="4">' +
        escapeHtml(b.heroLead) +
        "</textarea>" +
        "</div>" +
        '<button type="button" class="btn btn-primary" id="admin-banner-save">저장</button>' +
        "</div>";

      var btn = $("#admin-banner-save", rootBanner);
      if (btn)
        btn.addEventListener("click", function () {
          var marqueeEl = $("#banner-marquee", rootBanner);
          var kickerEl = $("#banner-hero-kicker", rootBanner);
          var titleEl = $("#banner-hero-title", rootBanner);
          var leadEl = $("#banner-hero-lead", rootBanner);

          var banner = {
            marqueeText: ((marqueeEl && marqueeEl.value) || "").trim(),
            heroKicker: ((kickerEl && kickerEl.value) || "").trim(),
            heroTitle: ((titleEl && titleEl.value) || "").trim(),
            heroLead: ((leadEl && leadEl.value) || "").trim(),
          };
          persistBanner(banner);
          renderHeader();
          alert("배너가 저장되었습니다.");
        });
    }

    function renderInventoryTab() {
      var rows = PRODUCTS.map(function (p) {
        var stock = typeof p.stock === "number" ? p.stock : 0;
        return (
          '<tr>' +
          '<td>' +
          escapeHtml(p.name) +
          '</td>' +
          '<td>' +
          escapeHtml(p.category || "") +
          '</td>' +
          '<td>' +
          '<input class="input" type="number" min="0" step="1" data-id="' +
          escapeHtml(p.id) +
          '" value="' +
          stock +
          '" />' +
          "</td>" +
          "</tr>"
        );
      }).join("");

      rootInventory.innerHTML =
        '<div class="kicker" style="margin-bottom: 12px">재고 관리</div>' +
        '<p class="muted" style="margin: 0 0 16px">재고가 0이면 해당 상품은 장바구니에 담을 수 없습니다. (정적 데모)</p>' +
        '<div class="table-wrap" style="background: transparent; border-radius: 18px">' +
        "<table class='data-table'>" +
        "<thead><tr><th>상품</th><th>카테고리</th><th>재고</th></tr></thead>" +
        "<tbody>" +
        rows +
        "</tbody>" +
        "</table>" +
        "</div>" +
        '<button type="button" class="btn btn-primary" id="admin-inventory-save" style="margin-top: 16px">재고 저장</button>';

      var btn = $("#admin-inventory-save", rootInventory);
      if (btn)
        btn.addEventListener("click", function () {
          var inputs = $all('input[type="number"][data-id]', rootInventory);
          inputs.forEach(function (inp) {
            var id = inp.getAttribute("data-id");
            var v = Math.max(0, Math.floor(Number(inp.value || 0)));
            PRODUCTS.forEach(function (p) {
              if (p.id === id) p.stock = v;
            });
          });
          persistProducts();
          alert("재고가 저장되었습니다.");
        });
    }

    function renderProductsTab() {
      var list = PRODUCTS.map(function (p) {
        return (
          '<div class="order-card" style="margin-bottom: 14px">' +
          "<div style='display:grid; grid-template-columns: 1fr 140px; gap: 12px; align-items:start'>" +
          "<div>" +
          "<p class='muted' style='margin:0 0 10px'>ID: " +
          escapeHtml(p.id) +
          "</p>" +
          "</div>" +
          "</div>" +
          '<div class="form-stack" style="margin-top: 12px">' +
          '<div><label class="label">이름</label><input class="input" data-field="name" data-id="' +
          escapeHtml(p.id) +
          '" value="' +
          escapeHtml(p.name) +
          '" /></div>' +
          '<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px">' +
          '<div><label class="label">가격</label><input class="input" type="number" min="0" step="1000" data-field="price" data-id="' +
          escapeHtml(p.id) +
          '" value="' +
          p.price +
          '" /></div>' +
          '<div><label class="label">재고</label><input class="input" type="number" min="0" step="1" data-field="stock" data-id="' +
          escapeHtml(p.id) +
          '" value="' +
          (typeof p.stock === "number" ? p.stock : 0) +
          '" /></div>' +
          "</div>" +
          '<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px">' +
          '<div><label class="label">카테고리</label><select class="input" data-field="category" data-id="' +
          escapeHtml(p.id) +
          '">' +
          renderOption("apparel", "의류", p.category) +
          renderOption("accessories", "액세서리", p.category) +
          renderOption("bags", "가방", p.category) +
          renderOption("jewelry", "주얼리", p.category) +
          renderOption("living", "리빙", p.category) +
          "</select></div>" +
          '<div><label class="label">태그</label><select class="input" data-field="tag" data-id="' +
          escapeHtml(p.id) +
          '">' +
          renderOption(null, "없음", p.tag) +
          renderOption("new", "신상", p.tag) +
          renderOption("sale", "세일", p.tag) +
          "</select></div>" +
          "</div>" +
          '<div><label class="label">설명</label><textarea class="input" rows="3" data-field="description" data-id="' +
          escapeHtml(p.id) +
          '">' +
          escapeHtml(p.description) +
          "</textarea></div>" +
          "</div>" +
          "</div>"
        );
      }).join("");

      rootProducts.innerHTML =
        '<div class="kicker" style="margin-bottom: 12px">상품관리</div>' +
        '<p class="muted" style="margin: 0 0 16px">이 페이지에서 수정한 내용은 이 브라우저의 로컬 스토리지에만 저장됩니다. (정적 데모)</p>' +
        '<div id="admin-products-list">' +
        list +
        "</div>" +
        '<div class="order-card" style="margin-top: 16px">' +
        '<div class="kicker" style="margin-bottom: 12px">새 상품 추가</div>' +
        '<div class="form-stack">' +
        '<div><label class="label">이름</label><input class="input" id="new-prod-name" /></div>' +
        '<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px">' +
        '<div><label class="label">가격</label><input class="input" type="number" min="0" step="1000" id="new-prod-price" /></div>' +
        '<div><label class="label">재고</label><input class="input" type="number" min="0" step="1" id="new-prod-stock" /></div>' +
        "</div>" +
        '<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px">' +
        '<div><label class="label">카테고리</label><select class="input" id="new-prod-category">' +
        '<option value="apparel">의류</option>' +
        '<option value="accessories">액세서리</option>' +
        '<option value="bags">가방</option>' +
        '<option value="jewelry">주얼리</option>' +
        '<option value="living">리빙</option>' +
        "</select></div>" +
        '<div><label class="label">태그</label><select class="input" id="new-prod-tag">' +
        '<option value="">없음</option>' +
        '<option value="new">신상</option>' +
        '<option value="sale">세일</option>' +
        "</select></div>" +
        "</div>" +
        '<div><label class="label">설명</label><textarea class="input" rows="3" id="new-prod-description"></textarea></div>' +
        '<button type="button" class="btn btn-primary" id="admin-products-save">상품 저장</button>' +
        '<button type="button" class="btn btn-ghost" id="admin-products-add" style="margin-top: 8px">새 상품 추가</button>' +
        "</div>" +
        "</div>";

      function renderOption(value, label, current) {
        // value가 null이면 option value=""로 처리
        var v = value == null ? "" : value;
        var cur = current == null ? "" : current;
        var isSelected = cur === v;
        return (
          "<option value='" +
          escapeHtml(v) +
          "'" +
          (isSelected ? " selected" : "") +
          ">" +
          escapeHtml(label) +
          "</option>"
        );
      }

      var saveBtn = $("#admin-products-save", rootProducts);
      if (saveBtn)
        saveBtn.addEventListener("click", function () {
          var nodes = $all("[data-id][data-field]", rootProducts);
          // 간단하게 data-id별로 갱신
          var ids = [];
          nodes.forEach(function (n) {
            var id = n.getAttribute("data-id");
            if (ids.indexOf(id) < 0) ids.push(id);
          });
          ids.forEach(function (id) {
            var target = PRODUCTS.find(function (p) {
              return p.id === id;
            });
            if (!target) return;
            var nameInput = $("[data-field='name'][data-id='" + id + "']", rootProducts);
            var priceInput = $(
              "[data-field='price'][data-id='" + id + "']",
              rootProducts
            );
            var stockInput = $(
              "[data-field='stock'][data-id='" + id + "']",
              rootProducts
            );
            var catSelect = $(
              "[data-field='category'][data-id='" + id + "']",
              rootProducts
            );
            var tagSelect = $("[data-field='tag'][data-id='" + id + "']", rootProducts);
            var descArea = $(
              "[data-field='description'][data-id='" + id + "']",
              rootProducts
            );

            if (nameInput) target.name = nameInput.value || target.name;
            if (priceInput) target.price = Math.max(0, Math.floor(Number(priceInput.value || 0)));
            if (stockInput) target.stock = Math.max(0, Math.floor(Number(stockInput.value || 0)));
            if (catSelect) target.category = catSelect.value || target.category;
            if (tagSelect) target.tag = tagSelect.value || null;
            if (descArea) target.description = descArea.value || target.description;
          });
          persistProducts();
          alert("상품이 저장되었습니다.");
        });

      var addBtn = $("#admin-products-add", rootProducts);
      if (addBtn)
        addBtn.addEventListener("click", function () {
          var name = $("#new-prod-name", rootProducts) && $("#new-prod-name", rootProducts).value;
          var price = $("#new-prod-price", rootProducts) && $("#new-prod-price", rootProducts).value;
          var stock = $("#new-prod-stock", rootProducts) && $("#new-prod-stock", rootProducts).value;
          var category = $("#new-prod-category", rootProducts).value;
          var tag = $("#new-prod-tag", rootProducts).value || null;
          var description = $("#new-prod-description", rootProducts) && $("#new-prod-description", rootProducts).value;

          name = String(name || "").trim();
          if (!name) return alert("상품 이름을 입력하세요.");
          var id = "admin-" + Date.now().toString(36);
          var p = {
            id: id,
            name: name,
            price: Math.max(0, Math.floor(Number(price || 0))),
            stock: Math.max(0, Math.floor(Number(stock || 0))),
            category: category,
            tag: tag,
            description: String(description || ""),
          };
          PRODUCTS.push(normalizeProduct(p));
          persistProducts();
          alert("새 상품이 추가되었습니다.");
          initAdmin();
        });
    }

    function renderOrdersTab() {
      var orders = getOrders();
      var statusOptions = [
        "결제 대기 (데모)",
        "결제 완료 (데모)",
        "취소",
        "실패",
      ];
      if (orders.length === 0) {
        rootOrders.innerHTML =
          "<p class='muted'>주문 내역이 없습니다.</p>";
        return;
      }

      var listHtml = orders
        .map(function (o, idx) {
          var statusSel = statusOptions
            .map(function (st) {
              var selected = o.status === st ? " selected" : "";
              return "<option value='" + escapeHtml(st) + "'" + selected + ">" + escapeHtml(st) + "</option>";
            })
            .join("");

          var itemsText = (o.items || [])
            .map(function (i) {
              var bits = [i.name];
              if (i.color) bits.push(String(i.color));
              if (i.size) bits.push(String(i.size));
              return bits.join(" · ") + " × " + i.qty;
            })
            .join("<br/>");

          return (
            "<div class='order-card'>" +
            "<header>" +
            "<strong>" +
            escapeHtml(o.id) +
            "</strong>" +
            "<span class='muted'>" +
            escapeHtml(String(o.at || "").slice(0, 10)) +
            "</span>" +
            "</header>" +
            "<p style='margin:0 0 8px' class='muted'>총액: " +
            formatKRW(o.total || 0) +
            "</p>" +
            "<div style='display:grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items:start'>" +
            "<div>" +
            "<p class='muted' style='margin:0 0 8px'>구매자</p>" +
            "<p style='margin:0'>" +
            escapeHtml(o.name || "") +
            "<br/>" +
            escapeHtml(o.email || "") +
            "</p>" +
            "</div>" +
            "<div>" +
            "<label class='label' style='margin-bottom: 8px'>상태</label>" +
            "<select class='input' data-order-idx='" +
            idx +
            "'>" +
            statusSel +
            "</select>" +
            "</div>" +
            "</div>" +
            "<div style='margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px'>" +
            "<p class='muted' style='margin:0 0 8px'>상품</p>" +
            "<div class='muted' style='line-height: 1.7; font-size: 14px'>" +
            itemsText +
            "</div>" +
            "</div>" +
            "</div>"
          );
        })
        .join("");

      rootOrders.innerHTML =
        '<div class="kicker" style="margin-bottom: 12px">주문 관리</div>' +
        '<p class="muted" style="margin: 0 0 16px">아래 상태를 바꾸면 orders.html에서도 동일하게 반영됩니다. (정적 데모)</p>' +
        listHtml +
        '<button type="button" class="btn btn-primary" id="admin-orders-save" style="margin-top: 16px">주문 상태 저장</button>';

      var btn = $("#admin-orders-save", rootOrders);
      if (btn)
        btn.addEventListener("click", function () {
          var list = getOrders();
          var selects = $all("select[data-order-idx]", rootOrders);
          selects.forEach(function (sel) {
            var idx = Number(sel.getAttribute("data-order-idx") || 0);
            var v = sel.value;
            if (list[idx]) list[idx].status = v;
          });
          persistOrders(list);
          alert("주문 상태가 저장되었습니다.");
        });
    }

    // Render all tabs once
    renderBannerTab();
    renderInventoryTab();
    renderProductsTab();
    renderOrdersTab();

    // Tab switch
    $all(".admin-tab-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var tab = b.getAttribute("data-tab");
        showTab(tab);
      });
    });

    showTab(activeTab);
  }

  function ensureAdminSeed() {
    // Admin demo: 로그인은 이메일 인증코드(OTP)만 사용합니다.
    // 이 계정으로 가입되어 있어야 관리자 탭에 진입할 수 있습니다.
    var adminEmail = "undermask1028@gmail.com";
    var adminPass = "alsdn1028";
    var users = getUsers();
    var exists = users.some(function (u) {
      return u.email === adminEmail;
    });
    if (!exists) {
      users.push({
        name: "관리자",
        email: adminEmail,
        password: adminPass,
      });
      saveUsers(users);
    }
  }

  function boot() {
    ensureAdminSeed();
    renderHeader();
    renderFooter();
    initPrefToggles();
    var page = currentPage();
    initScrollTone();
    if (page === "home") {
      initHome();
    }
    if (page === "shop") initShop();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
    if (page === "checkout") initCheckout();
    if (page === "login") initLogin();
    if (page === "register") initRegister();
    if (page === "account") initAccount();
    if (page === "orders") initOrders();
    if (page === "wishlist") initWishlist();
    if (page === "admin") initAdmin();

    window.addEventListener("derkerk:cart", function () {
      renderHeader();
    });
    window.addEventListener("derkerk:session", function () {
      renderHeader();
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
