import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {

    const [userCurrency, setUserCurrency] = useState(() => {

        return localStorage.getItem('userCurrency') || 'CRC';
    });

    const [rates, setRates] = useState(null);


    useEffect(() => {

        localStorage.setItem('userCurrency', userCurrency);
    }, [userCurrency]);


    useEffect(() => {

        fetch('https://open.er-api.com/v6/latest/USD')
            .then(res => res.json())
            .then(data => setRates(data.rates))
            .catch(err => console.error("Error obteniendo tasas de cambio:", err));
    }, []);




    const convertPrice = (amount, fromCurrency, toCurrency) => {

        if (!rates || !rates[fromCurrency] || !rates[toCurrency]) return null;

        if (fromCurrency === toCurrency) return amount;

        
        const amountInUSD = amount / rates[fromCurrency];

        return amountInUSD * rates[toCurrency];


    };

    
    const formatCurrency = (amount, currency) => {

        if (amount === null) return '...';

        return new Intl.NumberFormat('es-CR', {

            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };


    return (

        <CurrencyContext.Provider value={{ userCurrency, setUserCurrency, convertPrice, formatCurrency, rates }}>
            {children}
        </CurrencyContext.Provider>

    );
};



export const useCurrency = () => useContext(CurrencyContext);