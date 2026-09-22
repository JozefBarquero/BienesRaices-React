export const formatPrice = (amount, currency = 'CRC') => {
    if (amount === null || amount === undefined || isNaN(amount)) return '';

    const numericValue = Number(amount);

    const currencySymbols = {
        CRC: 'CRC ₡',
        USD: 'USD $',
        EUR: 'EUR €'
    };

    const symbol = currencySymbols[currency] || `${currency} `;

    const formattedNumber = numericValue.toLocaleString('es-CR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    return `${symbol}${formattedNumber}`;
};