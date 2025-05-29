export function currencyFormat(num: number): string {
  return "₫" + num?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() bắt đầu từ 0
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
};
