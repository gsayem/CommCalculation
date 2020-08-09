/**
 * Transaction Amount Class
 */
export class TransactionAmount {
    constructor() {
        this.amount = 0.0; //Transaction Amount 
        this.currency = ''; //Transaction Currency;
    }
    /**
     * Set Amount
     */
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    /**
     * Get Amount
     */
    getAmount() {
        return this.amount;
    }
    /**
     * Set Currency
     */
    setCurrency(currency) {
        this.currency = currency;
        return this;
    }
    /**
     * Get Currency
     */
    getCurrency() {
        return this.currency;
    }
}