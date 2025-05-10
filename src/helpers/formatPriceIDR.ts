export const formatPriceIDR = (price: number): string => {
  const formattedPrice = price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: "standard",
  });
  return formattedPrice;
}