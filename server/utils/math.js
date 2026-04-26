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

// 5. Transport masalasi - Minimal xarajat usuli
function minimalXarajatUsul(ta_minot, ehtiyoj, xarajatlar) {
  const localS = [...ta_minot];
  const localD = [...ehtiyoj];
  const taqsimlash = ta_minot.map(() => ehtiyoj.map(() => 0));
  const qadamlar = [];

  const saralangan = [];
  for (let i = 0; i < ta_minot.length; i++) {
    for (let j = 0; j < ehtiyoj.length; j++) {
      saralangan.push({ i, j, xarajat: xarajatlar[i][j] });
    }
  }
  saralangan.sort((a, b) => a.xarajat - b.xarajat);

  for (const katak of saralangan) {
    const { i, j } = katak;
    if (localS[i] > 0 && localD[j] > 0) {
      const miqdor = Math.min(localS[i], localD[j]);
      taqsimlash[i][j] = miqdor;
      localS[i] -= miqdor;
      localD[j] -= miqdor;
      qadamlar.push({ i, j, miqdor, xarajat: xarajatlar[i][j] });
    }
  }

  return { taqsimlash, qadamlar };
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
  if (usul === "northwest") natija = shimoliGarbiyUsul(ta_minot, ehtiyoj, xarajatlar);
  else if (usul === "leastcost") natija = minimalXarajatUsul(ta_minot, ehtiyoj, xarajatlar);
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
