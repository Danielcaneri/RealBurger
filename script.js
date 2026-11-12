(function () {
  'use strict';
  var WA = '5511947046486';
  var IMG = 'assets/img/';

  var CATS = [
    { id: 'burger', name: 'Hambúrgueres' },
    { id: 'dog', name: 'Hot-dogs' },
    { id: 'porcao', name: 'Porções' },
    { id: 'salgado', name: 'Salgados e pastéis' },
    { id: 'bebida', name: 'Bebidas' }
  ];

  var P = [
    ['b1', 'burger', 'X-Egg', 17, 'burger-b1'],
    ['b2', 'burger', 'X-Egg Bacon', 19, 'burger-x-bacon'],
    ['b3', 'burger', 'Duplo Cheddar', 22, 'burger-duplo'],
    ['b4', 'burger', 'X-Bacon', 18, 'burger-b3'],
    ['b5', 'burger', 'X-Tudo', 22, 'burger-b2'],
    ['b6', 'burger', 'X-Salada', 14, 'burger-x-burger'],
    ['b7', 'burger', 'X-Burger', 12, 'burger-b1'],
    ['b8', 'burger', 'X-Calabresa', 18, 'burger-x-bacon'],
    ['b9', 'burger', 'X-Frango', 20, 'burger-frango'],
    ['d1', 'dog', 'Dogão', 18, 'hotdog2'],
    ['d2', 'dog', 'Hot Dog Duplo', 14, 'hotdog'],
    ['d3', 'dog', 'Hot Dog Simples', 12, 'hotdog'],
    ['p1', 'porcao', 'Porção Batata Pequena', 13, 'fritas'],
    ['s1', 'salgado', 'Pastel Frango', 10, 'pastel'],
    ['s2', 'salgado', 'Pastel Calabresa', 10, 'pastel-aberto'],
    ['s3', 'salgado', 'Pastel Carne', 10, 'pastel'],
    ['s4', 'salgado', 'Pastel Pizza', 10, 'pastel-aberto'],
    ['s5', 'salgado', 'Pastel Bauru', 10, 'pastel-aberto'],
    ['s6', 'salgado', 'Pastel Queijo', 10, 'pastel'],
    ['s7', 'salgado', 'Pastel Frango c/Catupiry', 12, 'pastel'],
    ['s8', 'salgado', 'Pastel Frango c/Cheddar', 12, 'pastel'],
    ['s9', 'salgado', 'Pastel Calabresa c/Queijo', 12, 'pastel-aberto'],
    ['s10', 'salgado', 'Pastel Frango c/Queijo', 12, 'pastel'],
    ['s11', 'salgado', 'Pastel Carne c/Ovo', 12, 'pastel'],
    ['s12', 'salgado', 'Pastel Carne c/Queijo', 12, 'pastel-aberto'],
    ['e1', 'bebida', 'Coca-Cola 2 L retornável', 10, 'coca2l'],
    ['e2', 'bebida', 'Frutuba vários sabores 2 L', 7, 'fanta'],
    ['e3', 'bebida', 'Suco Del Valle 450 ml', 7, 'delvalle'],
    ['e4', 'bebida', 'Refrigerante lata', 6, 'coca'],
    ['e5', 'bebida', 'Refrigerante caçulinha', 3, 'sprite']
  ].map(function (a) { return { id: a[0], cat: a[1], name: a[2], price: a[3], img: IMG + a[4] + '.png' }; });

  var byId = {};
  P.forEach(function (p) { byId[p.id] = p; });

  var COMBOS = [
    { name: 'Duplo Cheddar com batata e refri', items: ['b3', 'p1', 'e4'], img: 'burger-c-duplo' },
    { name: 'X-Bacon com batata e refri', items: ['b4', 'p1', 'e4'], img: 'burger-c-bacon' },
    { name: 'Dois pastéis e refri', items: ['s1', 's3', 'e4'], img: 'combo-salgados' }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('rb-cart') || '{}') || {}; } catch (e) { cart = {}; }
  Object.keys(cart).forEach(function (k) { if (!byId[k] || !(cart[k] > 0)) delete cart[k]; });

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;

  function watch(root) {
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      if (observer) observer.observe(el); else el.classList.add('in');
    });
  }

  function icon(n) { return '<svg class="ic"><use href="#i-' + n + '"/></svg>'; }

  function card(p, delay) {
    return '<article class="card reveal" style="transition-delay:' + delay + 'ms">' +
      '<div class="pic"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></div>' +
      '<h3>' + p.name + '</h3>' +
      '<div class="foot"><span class="price">' + money(p.price) + '</span>' +
      '<button class="add" data-add="' + p.id + '">' + icon('plus') + 'Adicionar</button></div></article>';
  }

  var current = 'burger';
  function renderTabs() {
    $('tabs').innerHTML = CATS.map(function (c) {
      return '<button class="tab" role="tab" data-cat="' + c.id + '" aria-selected="' + (c.id === current) + '">' + c.name + '</button>';
    }).join('');
  }
  function renderGrid() {
    $('grid').innerHTML = P.filter(function (p) { return p.cat === current; })
      .map(function (p, i) { return card(p, Math.min(i, 8) * 40); }).join('');
    watch($('grid'));
  }
  function renderCombos() {
    $('combosGrid').innerHTML = COMBOS.map(function (c, i) {
      var total = c.items.reduce(function (s, id) { return s + byId[id].price; }, 0);
      var names = c.items.map(function (id) { return byId[id].name; }).join(', ');
      return '<article class="card reveal" style="transition-delay:' + i * 60 + 'ms">' +
        '<div class="pic"><img src="' + IMG + c.img + '.png" alt="' + c.name + '" loading="lazy"></div>' +
        '<h3>' + c.name + '</h3><p class="sub">' + names + '</p>' +
        '<div class="foot"><span class="price">' + money(total) + '</span>' +
        '<button class="add" data-combo="' + i + '">' + icon('plus') + 'Adicionar</button></div></article>';
    }).join('');
    watch($('combosGrid'));
  }

  var toastTimer;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('on'); }, 1800);
  }

  function totals() {
    var n = 0, v = 0;
    Object.keys(cart).forEach(function (k) { n += cart[k]; v += cart[k] * byId[k].price; });
    return { n: n, v: v };
  }

  function renderCart() {
    var t = totals(), keys = Object.keys(cart);
    try { localStorage.setItem('rb-cart', JSON.stringify(cart)); } catch (e) {}
    $('badge').textContent = t.n;
    $('barCount').textContent = t.n + (t.n === 1 ? ' item' : ' itens');
    $('barTotal').textContent = money(t.v);
    $('cartBar').classList.toggle('on', t.n > 0);
    $('sub').textContent = $('total').textContent = money(t.v);
    $('send').disabled = t.n === 0;
    $('items').innerHTML = keys.length ? keys.map(function (k) {
      var p = byId[k], q = cart[k];
      return '<div class="line"><img src="' + p.img + '" alt="">' +
        '<div><h4>' + p.name + '</h4><small>' + money(p.price) + ' cada</small>' +
        '<div class="qty"><button data-dec="' + k + '" aria-label="Diminuir quantidade de ' + p.name + '">' + icon('minus') + '</button><b>' + q + '</b>' +
        '<button data-inc="' + k + '" aria-label="Aumentar quantidade de ' + p.name + '">' + icon('plus') + '</button></div></div>' +
        '<div class="lt">' + money(p.price * q) + '<button class="rm" data-rm="' + k + '" aria-label="Remover ' + p.name + '">' + icon('trash') + '</button></div></div>';
    }).join('') : '<div class="empty">' + icon('cart') + '<p>Seu carrinho está vazio.<br>Escolha algo no cardápio para começar.</p></div>';
  }

  function add(id, q) {
    cart[id] = (cart[id] || 0) + (q || 1);
    renderCart();
    var b = $('badge'); b.classList.add('pop'); setTimeout(function () { b.classList.remove('pop'); }, 220);
  }

  function open(on) {
    $('drawer').classList.toggle('on', on);
    $('scrim').classList.toggle('on', on);
    $('drawer').setAttribute('aria-hidden', String(!on));
    document.body.classList.toggle('lock', on);
    if (on) $('closeCart').focus();
  }

  function send() {
    var keys = Object.keys(cart);
    if (!keys.length) return;
    var name = $('cname').value.trim(), note = $('cnote').value.trim();
    var L = ['*Novo pedido - Real Burger*', ''];
    if (name) L.push('Cliente: ' + name, '');
    L.push('*Itens:*');
    keys.forEach(function (k) {
      var p = byId[k], q = cart[k];
      L.push(q + 'x ' + p.name + ' - ' + money(p.price) + ' cada = ' + money(p.price * q));
    });
    L.push('', '*Total: ' + money(totals().v) + '*');
    L.push('', 'Observações: ' + (note || 'Nenhuma'));
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(L.join('\n'));
    var l = document.createElement('a');
    l.href = url; l.target = '_blank'; l.rel = 'noopener';
    document.body.appendChild(l); l.click(); l.remove();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button,a');
    if (!t) return;
    var d = t.dataset;
    if (d.add) {
      add(d.add); toast(byId[d.add].name + ' adicionado');
      t.classList.add('ok'); setTimeout(function () { t.classList.remove('ok'); }, 700);
    } else if (d.combo) {
      COMBOS[d.combo].items.forEach(function (id) { add(id); }); toast('Combo adicionado ao carrinho');
    } else if (d.cat) {
      current = d.cat; renderTabs(); renderGrid();
    } else if (d.inc) add(d.inc);
    else if (d.dec) { cart[d.dec]--; if (cart[d.dec] <= 0) delete cart[d.dec]; renderCart(); }
    else if (d.rm) { delete cart[d.rm]; renderCart(); }
    else if (t.id === 'openCart' || t.id === 'cartBar') open(true);
    else if (t.id === 'closeCart') open(false);
    else if (t.id === 'send') send();
    else if (t.id === 'clear') { cart = {}; renderCart(); }
    else if (t.id === 'menuBtn') {
      var on = !$('nav').classList.contains('on');
      $('nav').classList.toggle('on', on); t.setAttribute('aria-expanded', String(on));
    } else if (t.closest('#nav')) { $('nav').classList.remove('on'); $('menuBtn').setAttribute('aria-expanded', 'false'); }
  });
  $('scrim').addEventListener('click', function () { open(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });

  renderTabs(); renderGrid(); renderCombos(); renderCart(); watch();
})();
