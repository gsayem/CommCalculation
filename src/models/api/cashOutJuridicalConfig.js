/**
 * Cashout Juridical Configuration
 */
export class CashOutJuridicalConfig {
    constructor(percent, minAmount, currency) {
        this.percent = percent; //Percent
        this.minAmount = minAmount; // min amount
        this.currency = currency;  // Currency
    }

    /**
     * Get Percent
     */
    getPercent() {
        return this.percent;
    }
    /**
     * Get weekly limit amount
     */
    getMinAmount() {
        return this.minAmount;
    }
    /**
     * Get Currency
     */
    getCurrency() {
        return this.currency;
    }
}