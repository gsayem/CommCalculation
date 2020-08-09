import chai from 'chai';
import { equal } from 'assert';
import sinon from 'sinon';
import { CommissionService } from '../src/services/commissionService.js';
import { TransactionAPI } from '../src/api/transactionAPI.js';
import { CashInConfig } from '../src/models/api/cashInConfig.js';
import { CashOutJuridicalConfig } from '../src/models/api/cashOutJuridicalConfig.js';
import { CashOutNaturalConfig } from '../src/models/api/cashOutNaturalConfig.js';
import { Transaction } from '../src/models/transaction.js';
import { WeeklyTransaction } from '../src/models/domainModels/weeklyTransaction.js';
import { TransactionAmount } from '../src/models/transactionAmount.js';
const assert = chai.assert;
const expect = chai.expect;

const expectThrowsAsync = async (method, errorMessage) => {
    let error = null;
    try {
        await method();
    }
    catch (err) {
        error = err;
    }
    expect(error).to.be.an('Error');
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage);
    }

}

describe('CommissionService================================', async () => {
    describe('#validateConfiguration()', async () => {
        it('should throw Cash In configuration not found when configuration not provided', async () => {
            const message = 'Cash In configuration not found.'
            const commissionService = new CommissionService();
            await expectThrowsAsync(() => commissionService.calculateCommission(), message);
        });
        it('should throw Cash Out Juridical configuration not found when Cash Out Juridical configuration not provided', async () => {
            const message = 'Cash Out Juridical configuration not found.'
            const commissionService = new CommissionService({});
            await expectThrowsAsync(() => commissionService.calculateCommission(), message);
        });
        it('should throw Cash Out Natural configuration not found when Cash Out Natural configuration not provided', async () => {
            const message = 'Cash Out Natural configuration not found.'
            const commissionService = new CommissionService({}, {});
            await expectThrowsAsync(() => commissionService.calculateCommission(), message);
        });
        it('should throw Invalid Cash In configuration when provided all configuration but Invalid', async () => {
            const message = 'Invalid Cash In configuration.'
            const commissionService = new CommissionService({}, {}, {});
            await expectThrowsAsync(() => commissionService.calculateCommission(), message);
        });
        it('should throw Invalid Cash Out Juridical configuration when provided Invalid Cash Out Juridical Config', async () => {
            const message = 'Invalid Cash Out Juridical configuration.'
            const commissionService = new CommissionService(new CashInConfig(), {}, {});
            await expectThrowsAsync(() => commissionService.calculateCommission(), message);
        });
        it('should throw Invalid Cash Out Natural configuration when provided Invalid Cash Out Natural Config', async () => {
            const message = 'Invalid Cash Out Natural configuration.'
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), {});
            await expectThrowsAsync(() => commissionService.calculateCommission(), message);
        });
    });
    describe('#calculateCommission()', async () => {
        it('should throw Transaction data not found when transactionList not provided', async () => {
            const message = 'Transaction data not found.'
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), new CashOutNaturalConfig());
            await expectThrowsAsync(() => commissionService.calculateCommission(), message);
        });
        it('should throw Transaction data not found when transactionList null provided', async () => {
            const message = 'Transaction data not found.'
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), new CashOutNaturalConfig());
            await expectThrowsAsync(() => commissionService.calculateCommission(null), message);
        });
        it('should throw Transaction data not found when transactionList not array provided', async () => {
            const message = 'Transaction data not found.'
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), new CashOutNaturalConfig());
            await expectThrowsAsync(() => commissionService.calculateCommission({}), message);
        });
        it('should throw Transaction data not found when transactionList array provided but zero length', async () => {
            const message = 'Transaction data not found.'
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), new CashOutNaturalConfig());
            await expectThrowsAsync(() => commissionService.calculateCommission([]), message);
        });
        it('should throw Invalid Transaction data. when transactionList array provided but Invalid', async () => {
            const message = 'Invalid Transaction data.'
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), new CashOutNaturalConfig());
            await expectThrowsAsync(() => commissionService.calculateCommission([{}]), message);
        });
        it('should throw Invalid Transaction data. when transactionList have invalid data', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const transactions = [];
            if (data.length > 0) {
                data.map(t => {
                    const tempTran = new Transaction();
                    const tempTramAmnt = new TransactionAmount();
                    tempTran.setDate(new Date(t.date));
                    tempTran.setUserId(t.user_id);
                    tempTran.setUserType(t.user_type);
                    tempTran.setTransactionType(t.type);
                    tempTramAmnt.setAmount(t.operation.amount);
                    tempTramAmnt.setCurrency(t.operation.currency);
                    tempTran.setOperation(tempTramAmnt);
                    transactions.push(tempTran);
                });
            }
            transactions.push({});
            const message = 'Invalid Transaction data.'
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), new CashOutNaturalConfig());
            await expectThrowsAsync(() => commissionService.calculateCommission(transactions), message);
        });
        it('should return array of commission', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const transactions = [];
            if (data.length > 0) {
                data.map(t => {
                    const tempTran = new Transaction();
                    const tempTramAmnt = new TransactionAmount();
                    tempTran.setDate(new Date(t.date));
                    tempTran.setUserId(t.user_id);
                    tempTran.setUserType(t.user_type);
                    tempTran.setTransactionType(t.type);
                    tempTramAmnt.setAmount(t.operation.amount);
                    tempTramAmnt.setCurrency(t.operation.currency);
                    tempTran.setOperation(tempTramAmnt);
                    transactions.push(tempTran);
                });
            }
            const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), new CashOutNaturalConfig());
            expect(commissionService.calculateCommission(transactions)).to.be.an('array')
        });
        it('should return array of commission as order [0.06, 0.90, 87.00, 3.00, 0.30, 0.30, 5.00, 0.00, 0.00]', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } },
                { 'date': '2016-01-06', 'user_id': 2, 'user_type': 'juridical', 'type': 'cash_out', 'operation': { 'amount': 300.00, 'currency': 'EUR' } },
                { 'date': '2016-01-06', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 30000, 'currency': 'EUR' } },
                { 'date': '2016-01-07', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 1000.00, 'currency': 'EUR' } },
                { 'date': '2016-01-07', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 100.00, 'currency': 'EUR' } },
                { 'date': '2016-01-10', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 100.00, 'currency': 'EUR' } },
                { 'date': '2016-01-10', 'user_id': 2, 'user_type': 'juridical', 'type': 'cash_in', 'operation': { 'amount': 1000000.00, 'currency': 'EUR' } },
                { 'date': '2016-01-10', 'user_id': 3, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 1000.00, 'currency': 'EUR' } },
                { 'date': '2016-02-15', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 300.00, 'currency': 'EUR' } }
            ];
            const transactions = [];
            if (data.length > 0) {
                data.map(t => {
                    const tempTran = new Transaction();
                    const tempTramAmnt = new TransactionAmount();
                    tempTran.setDate(new Date(t.date));
                    tempTran.setUserId(t.user_id);
                    tempTran.setUserType(t.user_type);
                    tempTran.setTransactionType(t.type);
                    tempTramAmnt.setAmount(t.operation.amount);
                    tempTramAmnt.setCurrency(t.operation.currency);
                    tempTran.setOperation(tempTramAmnt);
                    transactions.push(tempTran);
                });
            }
            const commissionService = new CommissionService(new CashInConfig(0.03, 5, 'EUR'), new CashOutJuridicalConfig(0.3, 0.5, 'EUR'), new CashOutNaturalConfig(0.3, 1000, 'EUR'));
            expect(commissionService.calculateCommission(transactions)).to.have.ordered.members(['0.06', '0.90', '87.00', '3.00', '0.30', '0.30', '5.00', '0.00', '0.00']);
        });

    });
    describe('#cashInCalculation()', async () => {
        const cashInConfig = new CashInConfig(0.03, 5, 'EUR');
        const commissionService = new CommissionService(cashInConfig, new CashOutJuridicalConfig(), new CashOutNaturalConfig());
        it('should return 0.06 for natural cash_in 200 with CashIn Percent 0.03 and MaxAmount 5', async () => {
            expect(commissionService.cashInCalculation(200)).to.be.equal(0.06);
        });
        it('should return 5 for natural cash_in 1000000.00 with CashIn Percent 0.03 and MaxAmount 5', async () => {
            expect(commissionService.cashInCalculation(1000000)).to.be.equal(5)
        });
    });
    describe('#cashOutCalculationForJuridical()', async () => {
        const cashOutJuridicalConfig = new CashOutJuridicalConfig(0.3, 0.5, 'EUR')
        const commissionService = new CommissionService(new CashInConfig(), cashOutJuridicalConfig, new CashOutNaturalConfig());
        it('should return 0.90 for Juridical cash_out 300 with CashOutJuridical Percent 0.3 and MaxAmount 0.5', async () => {
            expect(commissionService.cashOutCalculationForJuridical(300)).to.be.equal(0.90)
        });
        it('should return 1.80 for Juridical cash_out 600 with CashOutJuridical Percent 0.3 and MaxAmount 0.5', async () => {
            expect(commissionService.cashOutCalculationForJuridical(600)).to.be.equal(1.80)
        });
    });
    describe('#cashOutCalculationForNatural() - CashOutNatural Config Percent 0.3 and week_limit 1000', async () => {
        const cashOutNaturalConfig = new CashOutNaturalConfig(0.3, 1000, 'EUR')
        const commissionService = new CommissionService(new CashInConfig(), new CashOutJuridicalConfig(), cashOutNaturalConfig);
        //const weeklyTransaction = new WeeklyTransaction(1)
        it('should return 87 for Natural cash_out 30000 as First transaction Of the week, exceed the limit', async () => {
            let data = [
                { 'date': '2016-01-06', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 30000, 'currency': 'EUR' } }
            ];
            const transactions = [];
            if (data.length > 0) {
                data.map(t => {
                    const tempTran = new Transaction();
                    const tempTramAmnt = new TransactionAmount();
                    tempTran.setDate(new Date(t.date));
                    tempTran.setUserId(t.user_id);
                    tempTran.setUserType(t.user_type);
                    tempTran.setTransactionType(t.type);
                    tempTramAmnt.setAmount(t.operation.amount);
                    tempTramAmnt.setCurrency(t.operation.currency);
                    tempTran.setOperation(tempTramAmnt);
                    transactions.push(tempTran);
                });
            }
            expect(commissionService.cashOutCalculationForNatural(transactions[0])).to.be.equal(87);
        });
        it('should return 0 for Natural cash_out 300 as First transaction Of the week, not exceed the limit', async () => {
            let data = [
                { 'date': '2016-02-15', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 300.00, 'currency': 'EUR' } }
            ];
            const transactions = [];
            if (data.length > 0) {
                data.map(t => {
                    const tempTran = new Transaction();
                    const tempTramAmnt = new TransactionAmount();
                    tempTran.setDate(new Date(t.date));
                    tempTran.setUserId(t.user_id);
                    tempTran.setUserType(t.user_type);
                    tempTran.setTransactionType(t.type);
                    tempTramAmnt.setAmount(t.operation.amount);
                    tempTramAmnt.setCurrency(t.operation.currency);
                    tempTran.setOperation(tempTramAmnt);
                    transactions.push(tempTran);
                });
            }
            expect(commissionService.cashOutCalculationForNatural(transactions[0])).to.be.equal(0);
        });
        it('should return 0 for Natural cash_out 400 as 2nd transaction Of the week[Weekly totlal 700], not exceed the limit', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 300.00, 'currency': 'EUR' } }
            ];
            const transactions = [];
            const weeklyTransaction = [];
            weeklyTransaction.push(new WeeklyTransaction(1, 1).setWeeklyLedger(300));
            if (data.length > 0) {
                data.map(t => {
                    const tempTran = new Transaction();
                    const tempTramAmnt = new TransactionAmount();
                    tempTran.setDate(new Date(t.date));
                    tempTran.setUserId(t.user_id);
                    tempTran.setUserType(t.user_type);
                    tempTran.setTransactionType(t.type);
                    tempTramAmnt.setAmount(t.operation.amount);
                    tempTramAmnt.setCurrency(t.operation.currency);
                    tempTran.setOperation(tempTramAmnt);
                    transactions.push(tempTran);
                });
            }
            expect(commissionService.cashOutCalculationForNatural(transactions[0], weeklyTransaction)).to.be.equal(0);
        });
        it('should return 0.6 for Natural cash_out 5000 as 3nd transaction Of the week[Weekly totlal 5700], exceed the limit', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 5000.00, 'currency': 'EUR' } }
            ];
            const transactions = [];
            const weeklyTransaction = [];
            weeklyTransaction.push(new WeeklyTransaction(1, 1).setWeeklyLedger(700));
            if (data.length > 0) {
                data.map(t => {
                    const tempTran = new Transaction();
                    const tempTramAmnt = new TransactionAmount();
                    tempTran.setDate(new Date(t.date));
                    tempTran.setUserId(t.user_id);
                    tempTran.setUserType(t.user_type);
                    tempTran.setTransactionType(t.type);
                    tempTramAmnt.setAmount(t.operation.amount);
                    tempTramAmnt.setCurrency(t.operation.currency);
                    tempTran.setOperation(tempTramAmnt);
                    transactions.push(tempTran);
                });
            }
            expect(commissionService.cashOutCalculationForNatural(transactions[0], weeklyTransaction)).to.be.equal(14.1);
        });
    });
});