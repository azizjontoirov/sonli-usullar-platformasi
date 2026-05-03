// ============================================================
// MATEMATIK HISOBLASH FUNKSIYALARI
// Backend da hisoblash va tekshirish uchun
// ============================================================
 
// Faktorial hisoblash
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
 
// 1. Gorner usuli - Ko'phadni hisoblash
function gornerHisoblash(coefficients, x) {
  let natija = coefficients[0];
  const qadamlar = [{ qadam: 0, koeffitsient: coefficients[0], natija }];
 
  for (let i = 1; i < coefficients.length; i++) {
    natija = natija * x + coefficients[i];
    qadamlar.push({ qadam: i, koeffitsient: coefficients[i], natija });
  }
 
  return { natija, qadamlar };
}
 
// 2. Teylor qatori (sin va cos)
function taylorHisoblash(x, n, tur) {
  const qadamlar = [];
  let taqribiy = 0;
  const aniq = tur === "sin" ? Math.sin(x) : Math.cos(x);
 
  for (let k = 0; k < n; k++) {
    let had;
    if (tur === "sin") {
      had = (Math.pow(-1, k) * Math.pow(x, 2 * k + 1)) / factorial(2 * k + 1);
    } else {
      had = (Math.pow(-1, k) * Math.pow(x, 2 * k)) / factorial(2 * k);
    }
    taqribiy += had;
    qadamlar.push({
      iteratsiya: k,
      had,
      joriyYigindi: taqribiy,
      xatolik: Math.abs(aniq - taqribiy),
    });
  }
 
  return { taqribiy, aniq, qadamlar };
}
 
// 3. Nyuton usuli (kvadrat ildiz)
function nyutonHisoblash(S, x0, aniqlik, maxIter = 100) {
  const qadamlar = [];
  let xJoriy = x0;
 
  for (let i = 0; i < maxIter; i++) {
    const xOldingi = xJoriy;
    xJoriy = 0.5 * (xOldingi + S / xOldingi);
    const xatolik = Math.abs(xJoriy - xOldingi);
    qadamlar.push({ iteratsiya: i + 1, x: xJoriy, xatolik });
    if (xatolik < aniqlik) break;
  }
 
  return { natija: xJoriy, qadamlar };
}
 
// 4. Oddiy iteratsiya usuli
function iteratsiyaHisoblash(x0, aniqlik, formula, maxIter = 100) {
  let g;
  try {
    g = new Function("x", `
      const sin = Math.sin, cos = Math.cos, tan = Math.tan,
            sqrt = Math.sqrt, abs = Math.abs, log = Math.log,
            exp = Math.exp, PI = Math.PI, E = Math.E,
            pow = Math.pow, cbrt = Math.cbrt;
      return ${formula};
    `);
    const sinov = g(x0);
    if (typeof sinov !== "number") throw new Error("Natija son emas");
  } catch (e) {
    return { xato: `Formula xato: ${e.message}` };
  }
 
  const qadamlar = [];
  let xJoriy = x0;
 
  for (let i = 0; i < maxIter; i++) {
    const xOldingi = xJoriy;
    let xYangi;
    try {
      xYangi = g(xOldingi);
    } catch {
      return { xato: "Hisoblash jarayonida xatolik (masalan, manfiy sondan ildiz)." };
    }
 
    if (!isFinite(xYangi) || isNaN(xYangi)) {
      return { xato: "Ketma-ketlik divergensiyaga uchradi (cheksiz yoki NaN)." };
    }
 
    const xatolik = Math.abs(xYangi - xOldingi);
    qadamlar.push({ iteratsiya: i + 1, x: xYangi, xatolik });
    xJoriy = xYangi;
    if (xatolik < aniqlik) break;
  }
 
  return { natija: xJoriy, qadamlar };
}
 
// 5. Transport masalasi - Shimoli-g'arbiy burchak usuli
function shimoliGarbiyUsul(ta_minot, ehtiyoj, xarajatlar) {
  let i = 0, j = 0;
  const taqsimlash = ta_minot.map(() => ehtiyoj.map(() => 0));
  const qadamlar = [];
  const localS = [...ta_minot];
  const localD = [...ehtiyoj];
 
  while (i < ta_minot.length && j < ehtiyoj.length) {
    const miqdor = Math.min(localS[i], localD[j]);
    taqsimlash[i][j] = miqdor;
    localS[i] -= miqdor;
    localD[j] -= miqdor;
    qadamlar.push({ i, j, miqdor, xarajat: xarajatlar[i][j] });
    if (localS[i] === 0) i++;
    else j++;
  }
 
  return { taqsimlash, qadamlar };
}
 
// ============================================================
// 5. Transport masalasi - Potensiallar usuli (MODI metodi)
// Boshlang'ich rejani shimoli-g'arbiy usulda tuzib,
// keyin MODI bilan optimal holatga yetkazadi.
// ============================================================
function potensiallarUsuli(ta_minot, ehtiyoj, xarajatlar) {
  const m = ta_minot.length;
  const n = ehtiyoj.length;
  const qadamlar = [];
 
  // --- Boshlang'ich reja: Shimoli-g'arbiy burchak ---
  const localS = [...ta_minot];
  const localD = [...ehtiyoj];
  const x = Array.from({ length: m }, () => Array(n).fill(0));
  let si = 0, sj = 0;
  while (si < m && sj < n) {
    const miqdor = Math.min(localS[si], localD[sj]);
    x[si][sj] = miqdor;
    localS[si] -= miqdor;
    localD[sj] -= miqdor;
    if (localS[si] === 0 && localD[sj] === 0 && si + 1 < m) {
      si++; // degenerate: keyingi satrga o'tamiz
    } else if (localS[si] === 0) {
      si++;
    } else {
      sj++;
    }
  }
 
  qadamlar.push({
    tavsif: "Boshlang'ich reja (Shimoli-g'arbiy burchak usuli)",
    taqsimlash: x.map(r => [...r]),
    xarajat: _jami(x, xarajatlar, m, n)
  });
 
  // --- MODI iteratsiyalari ---
  for (let iter = 1; iter <= 200; iter++) {
 
    // 1. u va v potensiallarini hisoblash
    const u = Array(m).fill(null);
    const v = Array(n).fill(null);
    u[0] = 0;
 
    // Band kataklar: x[i][j] > 0
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (x[i][j] > 0) {
            if (u[i] !== null && v[j] === null) { v[j] = xarajatlar[i][j] - u[i]; changed = true; }
            else if (v[j] !== null && u[i] === null) { u[i] = xarajatlar[i][j] - v[j]; changed = true; }
          }
        }
      }
    }
 
    // 2. Delta hisoblash — eng kichik manfiy deltani topish
    let minDelta = -1e-9; // Faqat aniq manfiy
    let kirish = null;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (x[i][j] === 0 && u[i] !== null && v[j] !== null) {
          const d = xarajatlar[i][j] - u[i] - v[j];
          if (d < minDelta) { minDelta = d; kirish = { i, j }; }
        }
      }
    }
 
    // Barcha delta >= 0 → optimal
    if (!kirish) {
      qadamlar.push({
        tavsif: `Optimal! (${iter - 1} iteratsiyadan so'ng)`,
        taqsimlash: x.map(r => [...r]),
        xarajat: _jami(x, xarajatlar, m, n),
        u, v
      });
      break;
    }
 
    // 3. Sikl topish (to'g'ri to'rtburchak/ko'pburchak sikl)
    const sikl = _siklTop(x, kirish, m, n);
    if (!sikl || sikl.length < 4) {
      qadamlar.push({ tavsif: "Sikl topilmadi, to'xtatildi", xarajat: _jami(x, xarajatlar, m, n) });
      break;
    }
 
    // 4. Theta — "-" pozitsiyalaridagi minimalni topish
    let theta = Infinity;
    for (let k = 1; k < sikl.length; k += 2) {
      if (x[sikl[k].i][sikl[k].j] < theta) theta = x[sikl[k].i][sikl[k].j];
    }
 
    // 5. Qayta taqsimlash
    for (let k = 0; k < sikl.length; k++) {
      const { i, j } = sikl[k];
      x[i][j] += (k % 2 === 0 ? theta : -theta);
    }
 
    qadamlar.push({
      tavsif: `${iter}-iteratsiya: (P${kirish.i+1}→D${kirish.j+1}) kiritildi, θ=${theta}, Δ=${minDelta.toFixed(2)}`,
      taqsimlash: x.map(r => [...r]),
      xarajat: _jami(x, xarajatlar, m, n),
      kirish, theta, minDelta, u, v
    });
  }
 
  return { taqsimlash: x, qadamlar };
}
 
// --- Yordamchi: umumiy xarajat ---
function _jami(x, c, m, n) {
  let s = 0;
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) s += x[i][j] * c[i][j];
  return s;
}
 
// --- Yordamchi: Sikl topish (loop finding) ---
// To'g'ri usul: band kataklar grafida bir qator, bir ustun
// navbatlashib yuruvchi yo'l izlanadi.
function _siklTop(x, start, m, n) {
  // Band kataklar (kiruvchi katak qo'shiladi)
  const band = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++)
      if (x[i][j] > 0) band.push([i, j]);
  band.push([start.i, start.j]);
 
  // DFS: navbatlashib qator→ustun→qator... yo'nalish
  // qadam=0: gorizontal (bir xil i), qadam=1: vertikal (bir xil j)...
  function dfs(path, cur, depth) {
    const [ci, cj] = cur;
    if (depth >= 4 && ci === start.i && cj === start.j) return path;
    if (depth > band.length * 2 + 2) return null;
 
    const horizontal = depth % 2 === 1; // juft qadamlar: gorizontal, toq: vertikal
    // Aslida: 0-qadam (start→birinchi qadam) gorizontal yoki vertikal bo'lishi mumkin
    // Lekin MODI siklda qator va ustun navbatlashadi.
    // depth=1: birinchi harakat, depth juft bo'lsa = gorizontal (bir xil i)
    const useHorizontal = (depth % 2 === 0);
 
    for (const [ni, nj] of band) {
      if (depth > 1 && ni === start.i && nj === start.j) {
        // Siklni yoptik
        if (useHorizontal ? ni === ci : nj === cj) return [...path, [ni, nj]];
      }
      // Avvalgi yo'lda bo'lmasin (start bundan mustasno)
      if (path.slice(1).some(([pi, pj]) => pi === ni && pj === nj)) continue;
 
      if (useHorizontal && ni === ci && nj !== cj) {
        const r = dfs([...path, [ni, nj]], [ni, nj], depth + 1);
        if (r) return r;
      } else if (!useHorizontal && nj === cj && ni !== ci) {
        const r = dfs([...path, [ni, nj]], [ni, nj], depth + 1);
        if (r) return r;
      }
    }
    return null;
  }
 
  // Har ikkala yo'nalishdan sinab ko'ramiz
  let sikl = dfs([[start.i, start.j]], [start.i, start.j], 1);
  if (!sikl) return null;
 
  // Oxirgi element (start) ni olib tashlaymiz (takrorlanadi)
  sikl = sikl.slice(0, -1);
  return sikl.map(([i, j]) => ({ i, j }));
}
 
// 5. Transport masalasi - Vogel aproksimatsiyasi
function vogelUsuli(ta_minot, ehtiyoj, xarajatlar) {
  const localS = [...ta_minot];
  const localD = [...ehtiyoj];
  const taqsimlash = ta_minot.map(() => ehtiyoj.map(() => 0));
  const qadamlar = [];
  const qolganSatirlar = new Set(ta_minot.map((_, i) => i));
  const qolganUsunlar = new Set(ehtiyoj.map((_, j) => j));
 
  while (qolganSatirlar.size > 0 && qolganUsunlar.size > 0) {
    let maksimalJarima = -1;
    let targetKatak = { i: -1, j: -1 };
 
    for (const i of qolganSatirlar) {
      const satrNarxlari = Array.from(qolganUsunlar).map(j => xarajatlar[i][j]).sort((a, b) => a - b);
      const jarima = satrNarxlari.length > 1 ? satrNarxlari[1] - satrNarxlari[0] : satrNarxlari[0];
      if (jarima > maksimalJarima) {
        maksimalJarima = jarima;
        const minJ = Array.from(qolganUsunlar).reduce((best, j) =>
          xarajatlar[i][j] < xarajatlar[i][best] ? j : best,
          Array.from(qolganUsunlar)[0]
        );
        targetKatak = { i, j: minJ };
      }
    }
 
    for (const j of qolganUsunlar) {
      const ustunNarxlari = Array.from(qolganSatirlar).map(i => xarajatlar[i][j]).sort((a, b) => a - b);
      const jarima = ustunNarxlari.length > 1 ? ustunNarxlari[1] - ustunNarxlari[0] : ustunNarxlari[0];
      if (jarima > maksimalJarima) {
        maksimalJarima = jarima;
        const minI = Array.from(qolganSatirlar).reduce((best, i) =>
          xarajatlar[i][j] < xarajatlar[best][j] ? i : best,
          Array.from(qolganSatirlar)[0]
        );
        targetKatak = { i: minI, j };
      }
    }
 
    const { i, j } = targetKatak;
    const miqdor = Math.min(localS[i], localD[j]);
    taqsimlash[i][j] = miqdor;
    localS[i] -= miqdor;
    localD[j] -= miqdor;
    qadamlar.push({ i, j, miqdor, xarajat: xarajatlar[i][j], jarima: maksimalJarima });
 
    if (localS[i] === 0) qolganSatirlar.delete(i);
    else qolganUsunlar.delete(j);
  }
 
  return { taqsimlash, qadamlar };
}
 
// Transport masalasini yechish - usulni tanlash
function transportHisoblash(ta_minot, ehtiyoj, xarajatlar, usul) {
  let natija;
  if (usul === "northwest")  natija = shimoliGarbiyUsul(ta_minot, ehtiyoj, xarajatlar);
  else if (usul === "leastcost") natija = potensiallarUsuli(ta_minot, ehtiyoj, xarajatlar);
  else natija = vogelUsuli(ta_minot, ehtiyoj, xarajatlar);
 
  let umumiyXarajat = 0;
  for (let i = 0; i < ta_minot.length; i++) {
    for (let j = 0; j < ehtiyoj.length; j++) {
      umumiyXarajat += natija.taqsimlash[i][j] * xarajatlar[i][j];
    }
  }
 
  return { ...natija, umumiyXarajat };
}
 
// 6. Investitsiyalarni taqsimlash (Dinamik dasturlash)
function investitsiyaHisoblash(umumiyByudjet, loyihalar) {
  const n = loyihalar.length;
  const dp = Array(n + 1).fill(0).map(() => Array(umumiyByudjet + 1).fill(0));
  const parent = Array(n + 1).fill(0).map(() => Array(umumiyByudjet + 1).fill(0));
 
  for (let i = 1; i <= n; i++) {
    const daromadlar = loyihalar[i - 1].daromadlar;
    for (let b = 0; b <= umumiyByudjet; b++) {
      for (let x = 0; x <= b; x++) {
        const foyda = (daromadlar[x] || 0) + dp[i - 1][b - x];
        if (foyda > dp[i][b]) {
          dp[i][b] = foyda;
          parent[i][b] = x;
        }
      }
    }
  }
 
  const taqsimlash = [];
  let joriyByudjet = umumiyByudjet;
  for (let i = n; i >= 1; i--) {
    const sarmoya = parent[i][joriyByudjet];
    taqsimlash.unshift({ loyiha: loyihalar[i - 1].nomi, sarmoya });
    joriyByudjet -= sarmoya;
  }
 
  return { umumiyFoyda: dp[n][umumiyByudjet], taqsimlash, dpJadvali: dp };
}
 
module.exports = {
  gornerHisoblash,
  taylorHisoblash,
  nyutonHisoblash,
  iteratsiyaHisoblash,
  transportHisoblash,
  investitsiyaHisoblash
};
 