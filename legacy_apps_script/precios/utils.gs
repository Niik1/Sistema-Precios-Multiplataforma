function toNumber(value) {
  if (typeof value === "number") return value;
  if (value == null) return NaN;
  var str = String(value).trim().replace(",", ".");
  var n = parseFloat(str);
  return isNaN(n) ? NaN : n;
}
