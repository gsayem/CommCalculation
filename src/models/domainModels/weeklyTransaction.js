/**
 * Weekly Transaction Class, It's domain model to maintaine the user weekly transaction amount, commission, ledger
 */
export class WeeklyTransaction {
    constructor(userId, weekNumber) {
        this.userId = userId;
        this.weekNumber = weekNumber; //Week Number
        this.weeklyLedger = 0; //Weekly Ledger
        this.commissionedAmount = 0; //Already commissioned applied 
    }
    /**
     * Get User Id
     */
    getUserId() {
        return this.userId;
    }

    /**
     * Set commissionedAmount
     */
    setCommissionedAmount(commissionedAmount) {
        this.commissionedAmount = commissionedAmount;
        return this;
    }
    /**
     * Get commissionedAmount
     */
    getCommissionedAmount() {
        return this.commissionedAmount;
    }

    /**
     * Get weekNumber
     */
    getWeekNumber() {
        return this.weekNumber;
    }

    /**
     * Set weekly Ledger    
     */
    setWeeklyLedger(weeklyLedger) {
        this.weeklyLedger = weeklyLedger;
        return this;
    }
    /**
     * Get weekly Ledger
     */
    getWeeklyLedger() {
        return this.weeklyLedger;
    }
}