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

export const formatCountDate = ((date: string) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - reviewDate.getTime()) / 1000
  );

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInMonth = 30 * secondsInDay;
  const secondsInYear = 12 * secondsInMonth;

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < secondsInHour) {
    return `${Math.floor(
      diffInSeconds / secondsInMinute
    )} minutes ago`;
  } else if (diffInSeconds < secondsInDay) {
    return `${Math.floor(
      diffInSeconds / secondsInHour
    )} hours ago`;
  } else if (diffInSeconds < secondsInMonth) {
    return `${Math.floor(
      diffInSeconds / secondsInDay
    )} days ago`;
  } else if (diffInSeconds < secondsInYear) {
    return `${Math.floor(
      diffInSeconds / secondsInMonth
    )} months ago`;
  } else {
    return `${Math.floor(
      diffInSeconds / secondsInYear
    )} years ago`;
  }
})