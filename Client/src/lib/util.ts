export function currencyFormat(amount: number) {
    return 'GH₵' + (amount/100).toFixed(2)
}