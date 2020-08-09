import { BaseApi } from './baseAPI.js';
import config from '../config/index.js';
import { CashInConfig } from '../models/api/cashInConfig.js';
import { CashOutJuridicalConfig } from '../models/api/cashOutJuridicalConfig.js';
import { CashOutNaturalConfig } from '../models/api/cashOutNaturalConfig.js';

/**
 * Transaction API 
 */
export class TransactionAPI extends BaseApi {
    constructor() {
        super();
        this.api = new BaseApi();
    }
    /**
     * Retrive cash in configuration
     */
    async retriveCashInConfiguration() {        
        let cashInConfig = null;
        //retrive cash in configuration
        await this.api.get(config.API_END_POINT.CASH_IN_CONFIG_URL).then(function (data) {
            cashInConfig = new CashInConfig(data.percents, data.max.amount, data.max.currency);
        }).catch(function (error) {
            throw Error('Can not retrive cash in configuration.\nError Details:' + error);
        });
        return cashInConfig;
    }
    /**
     * Retrive cash out (natural) configuration
     */
    async retriveCashOutNaturalConfig() {
        let cashOutNaturalConfig = null;
        //retrive cash out (natural) configuration
        await this.api.get(config.API_END_POINT.CASH_OUT_NATURAL_CONFIG_URL).then(function (data) {
            cashOutNaturalConfig = new CashOutNaturalConfig(data.percents, data.week_limit.amount, data.week_limit.currency);
        }).catch(function (error) {
            throw Error('Can not retrive cash out (natural) configuration.\nError Details:' + error);
        });
        return cashOutNaturalConfig;
    }

    /**
     * Retrive cash out (juridical) configuration
     */
    async retriveCashOutJuridicalConfig() {
        let cashOutJuridicalConfig = null;
        //retrive cash out (juridical) configuration
        await this.api.get(config.API_END_POINT.CASH_OUT_JURIDICAL_CONFIG_URL).then(function (data) {
            cashOutJuridicalConfig = new CashOutJuridicalConfig(data.percents, data.min.amount, data.min.currency);
        }).catch(function (error) {
            throw Error('Can not retrive cash out (juridical) configuration.\nError Details:' + error);
        });
        return cashOutJuridicalConfig;
    }
}