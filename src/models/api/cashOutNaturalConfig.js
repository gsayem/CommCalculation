/**
 * Cashout Natural Configuration
 */
export class CashOutNaturalConfig {
    constructor(percent, weekLimitAmount, currency) {
        this.percent = percent; //Percent
        this.weekLimitAmount = weekLimitAmount; // weekly limit amount
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
    getWeeklyLimitAmount() {
        return this.weekLimitAmount;
    }
    /**
     * Get Currency
     */
    getCurrency() {
        return this.currency;
    }
}