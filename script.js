// ---- Unit definitions ----
// Each category maps unit -> factor relative to a base unit (except temperature, handled specially)
const UNITS = {
  length: {
    base: "meter",
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      mile: 1609.34,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
  },
  weight: {
    base: "kilogram",
    units: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      pound: 0.453592,
      ounce: 0.0283495,
      ton: 1000,
    },
  },
  volume: {
    base: "liter",
    units: {
      liter: 1,
      milliliter: 0.001,
      gallon: 3.78541,
      quart: 0.946353,
      pint: 0.473176,
      cup: 0.24,
    },
  },
  temperature: {
    units: { celsius: "C", fahrenheit: "F", kelvin: "K" },
  },
  currency: {
    units: {}, // populated dynamically from API
  },
};

let currencyRates = null;
let currentTab = "length";

const tabsEl = document.getElementById("tabs");
const fromSelect = document.getElementById("fromUnit");
const toSelect = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const resultEl = document.getElementById("result");

function populateSelects(category) {
  const units = category === "temperature"
    ? Object.keys(UNITS.temperature.units)
    : Object.keys(UNITS[category].units);

  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  units.forEach((unit, i) => {
    const opt1 = new Option(capitalize(unit), unit);
    const opt2 = new Option(capitalize(unit), unit, false, i === 1);
    fromSelect.add(opt1.cloneNode(true));
    toSelect.add(opt2);
  });

  if (units.length > 1) {
    fromSelect.selectedIndex = 0;
    toSelect.selectedIndex = 1;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function convertLinear(category, value, from, to) {
  const factors = UNITS[category].units;
  const base = value * factors[from];
  return base / factors[to];
}

function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius;
  if (from === "celsius") celsius = value;
  else if (from === "fahrenheit") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15; // kelvin

  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return celsius * (9 / 5) + 32;
  return celsius + 273.15; // kelvin
}

async function loadCurrencyRates() {
  if (currencyRates) return currencyRates;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR");
    const data = await res.json();
    currencyRates = data.rates; // { INR: 1, USD: 0.012, ... }
    UNITS.currency.units = currencyRates;
  } catch (err) {
    resultEl.textContent = "Currency rates unavailable right now.";
  }
  return currencyRates;
}

function convertCurrency(value, from, to) {
  if (!currencyRates) return null;
  const usdValue = value / currencyRates[from];
  return usdValue * currencyRates[to];
}

async function runConversion() {
  const value = parseFloat(inputValue.value);
  if (isNaN(value)) {
    resultEl.textContent = "Result: --";
    return;
  }

  const from = fromSelect.value;
  const to = toSelect.value;
  let output;

  if (currentTab === "temperature") {
    output = convertTemperature(value, from, to);
  } else if (currentTab === "currency") {
    await loadCurrencyRates();
    output = convertCurrency(value, from, to);
    if (output === null) return;
  } else {
    output = convertLinear(currentTab, value, from, to);
  }

  resultEl.textContent = `Result: ${output.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${capitalize(to)}`;
}

async function switchTab(tab) {
  currentTab = tab;
  [...tabsEl.children].forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tab));

  if (tab === "currency") {
    await loadCurrencyRates();
    const codes = Object.keys(currencyRates || { INR: 1, USD: 1, EUR: 1 });
    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";
    codes.forEach((code) => {
      fromSelect.add(new Option(code, code, code === "INR", code === "INR"));
      toSelect.add(new Option(code, code, code === "USD", code === "USD"));
    });
  } else {
    populateSelects(tab);
  }
  runConversion();
}

tabsEl.addEventListener("click", (e) => {
  if (e.target.matches(".tab-btn")) switchTab(e.target.dataset.tab);
});

[inputValue, fromSelect, toSelect].forEach((el) =>
  el.addEventListener("input", runConversion)
);

// ---- Ad-free unlock (client-side flag; pair with a real payment webhook for production) ----
function applyAdFreeState() {
  if (localStorage.getItem("adFree") === "true") {
    document.body.classList.add("ad-free");
  }
}

document.getElementById("alreadyPaidBtn").addEventListener("click", () => {
  const code = prompt("Enter the confirmation code from your payment receipt:");
  if (code && code.trim().length > 0) {
    localStorage.setItem("adFree", "true");
    applyAdFreeState();
    alert("Thanks! Ads have been removed on this device.");
  }
});

// ---- init ----
applyAdFreeState();
populateSelects(currentTab);
runConversion();
