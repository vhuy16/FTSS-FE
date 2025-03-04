export function currencyFormat(num: number): string {
  return "₫" + num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};
