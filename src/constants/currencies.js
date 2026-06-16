// Common travel currencies for the converter dropdowns. Conversion itself works
// for any ISO code the rates API returns; this list just curates the picker.
export const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
  { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
];

// Symbol used to prefix converted amounts (falls back to the code).
export const CURRENCY_SYMBOLS = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥", AUD: "A$", CAD: "C$",
  CHF: "CHF", CNY: "¥", AED: "د.إ", SGD: "S$", THB: "฿", HKD: "HK$",
  MYR: "RM", IDR: "Rp", KRW: "₩", VND: "₫", PHP: "₱", NZD: "NZ$",
  ZAR: "R", TRY: "₺", SAR: "﷼", QAR: "﷼", EGP: "E£", MAD: "DH",
  BRL: "R$", MXN: "$", RUB: "₽", LKR: "Rs", NPR: "₨",
};
