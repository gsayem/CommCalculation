import dotenv from 'dotenv';
/**
 * Application configuration or Constant define
 */
const envFound = dotenv.config();
if (envFound.error) {
    throw new Error('Couldn'/'t find .env file');
}
export default {
    API_END_POINT: {
        CASH_IN_CONFIG_URL: process.env.API_BASE_URL + '/config/cash-in',
        CASH_OUT_NATURAL_CONFIG_URL: process.env.API_BASE_URL + '/config/cash-out/natural',
        CASH_OUT_JURIDICAL_CONFIG_URL: process.env.API_BASE_URL + '/config/cash-out/juridical'
    },
    TRANSACTION_TYPE: {
        CASH_IN: 'cash_in',
        CASH_OUT: 'cash_out'
    },
    USER_TYPE: {
        NATURAL: 'natural',
        JURIDICAL: 'juridical'
    }
}