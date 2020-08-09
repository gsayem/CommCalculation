/**
 * Cash in configuration
 */
export class CashInConfig {
    constructor(percent, maxAmount, currency) {
        this.percent = percent; //Percent
        this.maxAmount = maxAmount; // Max Amount
        this.currency = currency;  // Currency
    }


    /**
     * Get Percent
     */
    getPercent() {
        return this.percent;
    }
    /**
     * Get max amount
     */
    getMaxAmount() {
        return this.maxAmount;
    }
    /**
     * Get Currency
     */
    getCurrency() {
        return this.currency;
    }
}