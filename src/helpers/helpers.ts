export const formatPriceIDR = (price: number): string => {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return formattedPrice;
}

export const formatThousandsToK = (value: number): string => {
  const formattedValue = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
  return formattedValue;
}