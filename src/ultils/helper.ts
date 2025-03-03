export function currencyFormat(num: number): string {
    return '₫' + num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export function currencyFormat2(num: number): string {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
