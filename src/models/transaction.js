import { TransactionAmount } from './transactionAmount.js'

/**
 * Transaction Class
 */
export class Transaction {
    constructor() {
        this.date = null; //Transaction Date
        this.user_id = 0; // User Id
        this.user_type = ''; // User Type : natural/juridical
        this.type = ''; // Transaction Type: cash_in, cash_out
        this.operation = new TransactionAmount(); // Transaction Amount and Currency
    }

    /**
     * Set Transaction Date
     */
    setDate(date) {
        this.date = date;
        return this;
    }
    /**
     * Get transaction Date
     */
    getDate() {
        return this.date;
    }
    /**
     * Set User Id
     */
    setUserId(user_id) {
        this.user_id = user_id;
        return this;
    }
    /**
     * Get User Id
     */
    getUserId() {
        return this.user_id;
    }

    /**
     * Set TransactionType: cash_in, cash_out
     */
    setTransactionType(type) {
        this.type = type;
        return this;
    }
    /**
     * Get Transaction Type: : cash_in, cash_out
     */
    getTransactionType() {
        return this.type;
    }

    /**
     * Set User type
     */
    setUserType(user_type) {
        this.user_type = user_type;
        return this;
    }
    /**
     * Get User Type: natural/juridical
     */
    getUserType() {
        return this.user_type;
    }

    /**
     * Set Operation/Transaction Amount and Currency
     */
    setOperation(operation) {
        if (operation instanceof TransactionAmount) {
            this.operation = operation;
        } else {
            this.operation = null;
        }

        return this;
    }
    /**
     * Get Operation/Transaction Amount and Currency
     */
    getOperation() {
        return this.operation;
    }
}

