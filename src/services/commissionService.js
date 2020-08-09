import { WeeklyTransaction } from '../models/domainModels/weeklyTransaction.js'
import { AppUtils } from '../utils/appUtils.js'
import AppConstant from '../config/index.js'
import { Transaction } from '../models/transaction.js';
import { CashInConfig } from '../models/api/cashInConfig.js';
import { CashOutJuridicalConfig } from '../models/api/cashOutJuridicalConfig.js';
import { CashOutNaturalConfig } from '../models/api/cashOutNaturalConfig.js';
/**
 * Commission service; Resonsible for all calculations of commissions.
 */
export class CommissionService {
    constructor(cashInConfig, cashOutJuridicalConfig, cashOutNaturalConfig) {
        this.cashInConfig = cashInConfig; //Cash in configuration
        this.cashOutJuridicalConfig = cashOutJuridicalConfig; // Cashout Juridical Configuration
        this.cashOutNaturalConfig = cashOutNaturalConfig;  // Cashout Natural Configuration

        this.weeklyTransaction = []; // Weekly Transaction for Natural user
    }

    /**
     *  Calculate Commission for provided transaction list
     */
    calculateCommission(transactionList) {
        this.validateConfiguration();
        let com = 0.0;
        const comArray = [];
        if (transactionList != null && transactionList.length > 0) {
            transactionList.map(tempTran => {
                if (tempTran instanceof Transaction) {
                    switch (tempTran.getTransactionType()) {
                        case AppConstant.TRANSACTION_TYPE.CASH_IN:
                            com = this.cashInCalculation(tempTran.getOperation().getAmount());
                            break;
                        case AppConstant.TRANSACTION_TYPE.CASH_OUT:
                            com = this.cashOutCalculation(tempTran, this.weeklyTransaction);
                            break;
                        default:
                            break;
                    }
                    comArray.push(com.toFixed(2));
                } else {
                    throw Error('Invalid Transaction data.');
                }
            });
        } else {
            throw Error('Transaction data not found.');
        }
        return comArray;
    }

    /**
     * Cash In calculation     
     */
    cashInCalculation(transactionAmount) {
        //calculating commission
        let com = AppUtils.roundingCurrency((this.cashInConfig.getPercent() / 100) * transactionAmount, 2);
        // Checking commission amount is more then maxuimum amount or not
        if (com > this.cashInConfig.getMaxAmount()) {
            com = this.cashInConfig.getMaxAmount();
        }
        return com;

    }
    /**
     * Cashout Calculation
     */
    cashOutCalculation(transaction, weeklyTransaction) {
        let com = 0.0;
        switch (transaction.getUserType()) {
            case AppConstant.USER_TYPE.NATURAL:
                com = this.cashOutCalculationForNatural(transaction, weeklyTransaction);
                break;
            case AppConstant.USER_TYPE.JURIDICAL:
                com = this.cashOutCalculationForJuridical(transaction.getOperation().getAmount());
                break;
            default:
                break;
        }
        return com;
    }
    /**
     * cashOut Calculation for Natural users
     */
    cashOutCalculationForNatural(transaction, weeklyTransaction) {
        let com = 0.0;
        //Get Transaction Amount
        const transactionAmount = transaction.getOperation();
        //Get Transaction Week
        const weekNumber = AppUtils.weekNumber(transaction.getDate());        
        // Initiate WeeklyTransaction
        let tempWeeklyTransaction = new WeeklyTransaction(transaction.getUserId(), weekNumber);
        if (weeklyTransaction == null || weeklyTransaction == undefined) {
            weeklyTransaction = [];
        }
        // Checking WeeklyTransaction found or not for current user
        const index = weeklyTransaction.findIndex(i => i.getUserId() === tempWeeklyTransaction.getUserId() && i.getWeekNumber() === weekNumber);
        if (index < 0) { //WeeklyTransaction not found, It's first transaction for this user in this week
            if (transactionAmount.getAmount() > this.cashOutNaturalConfig.getWeeklyLimitAmount()) { // Checking weekly limit cross or not
                // Weekly limit crossed and calculating commission
                com = AppUtils.roundingCurrency((this.cashOutNaturalConfig.getPercent() / 100) * (transactionAmount.getAmount() - this.cashOutNaturalConfig.getWeeklyLimitAmount()), 2);
                tempWeeklyTransaction.setCommissionedAmount(transactionAmount.getAmount()); // Set commissioned applied this amount
            }

            // Set the weekly ledger for next commission calcualte
            tempWeeklyTransaction.setWeeklyLedger(transactionAmount.getAmount());
            weeklyTransaction.push(tempWeeklyTransaction);
        } else {
            //WeeklyTransaction found, this user transacted before in this week 
            // Getting the WeeklyTransaction
            tempWeeklyTransaction = weeklyTransaction[index];
            //Update the weekly ledger for next commission calcualte
            tempWeeklyTransaction.setWeeklyLedger(tempWeeklyTransaction.getWeeklyLedger() + transactionAmount.getAmount());

            // Checking weekly limit cross or not
            if (tempWeeklyTransaction.getWeeklyLedger() > this.cashOutNaturalConfig.getWeeklyLimitAmount()) {
                // Weekly limit crossed and calculating commission

                //Getting the weekly transaction amount;
                let comWIllApply = tempWeeklyTransaction.getWeeklyLedger() - tempWeeklyTransaction.getCommissionedAmount()
                if (tempWeeklyTransaction.getCommissionedAmount() === 0) {
                    //first transaction for user in this week, so need to minus the weekly limit amount.
                    comWIllApply = comWIllApply - this.cashOutNaturalConfig.getWeeklyLimitAmount();
                }

                //calculating commission
                com = AppUtils.roundingCurrency((this.cashOutNaturalConfig.getPercent() / 100) * (comWIllApply), 2);
                // Set commissioned applied this amount
                tempWeeklyTransaction.setCommissionedAmount(tempWeeklyTransaction.getCommissionedAmount() + transactionAmount.getAmount());
            }
        }
        return com;
    }
    /**
     * cashOut Calculation for Juridical users
     */
    cashOutCalculationForJuridical(transactionAmount) {
        //calculating commission
        let com = AppUtils.roundingCurrency((this.cashOutJuridicalConfig.getPercent() / 100) * transactionAmount, 2)
        // Checking commission amount is less then minimum amount or not for Juridical user
        if (com < this.cashOutJuridicalConfig.getMinAmount()) {
            com = this.cashOutJuridicalConfig.getMinAmount();
        }
        return com;
    }

    /**
     * Validate the configuration
     */
    validateConfiguration() {
        if (this.cashInConfig == null || this.cashInConfig == undefined) {
            throw Error('Cash In configuration not found.');
        }
        if (this.cashOutJuridicalConfig == null || this.cashOutJuridicalConfig == undefined) {
            throw Error('Cash Out Juridical configuration not found.');
        }
        if (this.cashOutNaturalConfig == null || this.cashOutNaturalConfig == undefined) {
            throw Error('Cash Out Natural configuration not found.');
        }

        if (!(this.cashInConfig instanceof CashInConfig)) {
            throw Error('Invalid Cash In configuration.');
        }

        if (!(this.cashOutJuridicalConfig instanceof CashOutJuridicalConfig)) {
            throw Error('Invalid Cash Out Juridical configuration.');
        }

        if (!(this.cashOutNaturalConfig instanceof CashOutNaturalConfig)) {
            throw Error('Invalid Cash Out Natural configuration.');
        }
    }
}