import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getRates } from "@/service/RealtimeApi";
import { CURRENCIES, CURRENCY_SYMBOLS } from "@/constants/currencies";

const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CurrencyCard() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState(null);
  const [updated, setUpdated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Refetch the rate table only when the base currency changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getRates(from)
      .then(({ rates, updated }) => {
        if (!active) return;
        setRates(rates);
        setUpdated(updated);
      })
      .catch(() => {
        if (active) setError("Live exchange rates are temporarily unavailable. Please try again shortly.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [from]);

  const rate = rates?.[to];
  const numeric = parseFloat(amount);
  const converted = rate && !isNaN(numeric) ? numeric * rate : null;
  const symbol = CURRENCY_SYMBOLS[to] || to;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const selectClass =
    "input-dark rounded-md px-3 py-2 text-sm text-white [&>option]:bg-slate-800";

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-1 flex items-center gap-2 text-xl font-bold text-white">
        💱 Currency Converter
      </h3>
      <p className="mb-4 text-sm text-white/60">Live exchange rates for 160+ currencies.</p>

      <Input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="input-dark"
      />

      <div className="mt-3 flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-white/50">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={`w-full ${selectClass}`}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={swap}
          title="Swap currencies"
          className="mb-0.5 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-white transition-colors hover:bg-white/15"
        >
          ⇄
        </button>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-white/50">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={`w-full ${selectClass}`}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-300">{error}</p>
      ) : (
        <div className="mt-5 rounded-2xl bg-white/5 p-4 text-center">
          {loading && !rates ? (
            <p className="text-white/60">Loading live rates…</p>
          ) : converted != null ? (
            <>
              <p className="text-3xl font-extrabold text-white">
                {symbol} {fmt(converted)}
              </p>
              <p className="mt-1 text-sm text-white/70">
                1 {from} = {fmt(rate)} {to}
              </p>
              {updated && (
                <p className="mt-2 text-xs text-white/40">
                  Rates updated {updated.replace(" 00:00:01 +0000", "")} · rates fluctuate
                </p>
              )}
            </>
          ) : (
            <p className="text-white/60">Enter an amount to convert.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CurrencyCard;
