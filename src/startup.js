import { Transaction } from './models/transaction.js';
import { TransactionAmount } from './models/transactionAmount.js';
import * as fs from 'fs';
import { TransactionAPI } from './api/transactionAPI.js';
import { CommissionService } from './services/commissionService.js';
import jsonschema from 'jsonschema';
import path from 'path';


/**
 * Application Startup class
 */
export class Startup {
    /**
     * Application Start Point
     */
    async startApp(args) {
        if (args == null || args == undefined) {
            console.error('Please provide arguments to Startup');
        } else {
            try {
                const commissions = await this.processFile(args);
                if (commissions != null && commissions.length > 0) {
                    //Printout commission
                    commissions.map(com => {
                        console.log(com);
                    });
                } else {
                    console.log('Commission can not calculate!');
                }
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    /**
     *  Read arguments and processFile
     */
    async processFile(args) {
        let commissions = null;
        // Make sure we got a filename on the command line.
        if (args.length < 3) {
            throw Error('Syntax: node .\\src\\app.js input.json');
        } else {
            // Checking file is exists or not
            if (fs.existsSync(args[2])) {
                let inputContent = null;
                try {
                    // Read the input file 
                    inputContent = fs.readFileSync(args[2], 'utf8');
                } catch (error) {
                    throw Error('File can'/'t read.\n' + error);
                }

                //Validate the file
                const jsonData = this.validateFile(inputContent);

                //Convert json to model
                const transaction = this.jsonToModelMap(jsonData);

                //Calcualtion the commission
                commissions = await this.calculation(transaction);
            } else {
                // File not exists
                throw Error('File not found');
            }
        }
        return commissions;
    }

    /**
     * Validate file content     
     */
    validateFile(data) {
        let jsonData = null;
        let validatorResult = null;
        try {
            //Parsing json            
            jsonData = JSON.parse(data);
        } catch (error) {
            // Json can't parse
            throw Error('Json data can' / 't parse.\n' + error);
        }
        //Checking Json is empty or not
        if (jsonData != null && jsonData.length > 0) {
            //File/Json not empty.
            //Checking input file validation
            //Getting input file json schema for validation
            const schema = JSON.parse(fs.readFileSync(path.resolve() + '/src/schema/json/transactionSchema.json', 'utf8'))

            //Validating input file with schema.
            validatorResult = new jsonschema.Validator().validate(jsonData, schema);
        } else {
            //File/Json is empty.
            throw Error('Empty file/json data.');
        }
        //Chekcing validation failed or not
        if (validatorResult != null && validatorResult.errors != null && validatorResult.errors.length > 0) {
            //Validation failed. Parsing the error details.
            const msg = [];
            validatorResult.errors.map(err => {
                msg.push(err.property + ': ' + err.message);
            });
            // throw the validation error to show.
            throw Error('Invalid data format.\n' + msg.toString());
        }
        //Validation success. returing the json data.
        return jsonData;
    }

    /**
     * Json data to transaction Model     
     */
    jsonToModelMap(jsonData) {
        const transactions = [];
        if (jsonData.length > 0) {
            jsonData.map(t => {
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
        return transactions;
    }

    /**
     * calculation the commissions for the transactions
     */
    async calculation(transactions) {

        let commissions = null;

        //Checking transactions data empty or not
        if (transactions != null && transactions.length > 0) {

            // Getting cash In/Out Config
            const transactionAPI = new TransactionAPI();
            const cashInConfig = await transactionAPI.retriveCashInConfiguration();
            const cashOutJuridicalConfig = await transactionAPI.retriveCashOutJuridicalConfig();
            const cashOutNaturalConfig = await transactionAPI.retriveCashOutNaturalConfig();

            //Checking cash In/Out configuration
            if (cashInConfig != null && cashOutJuridicalConfig != null && cashOutNaturalConfig != null) {
                //CommissionService initiate with configuration
                const commissionService = new CommissionService(cashInConfig, cashOutJuridicalConfig, cashOutNaturalConfig);

                //calculate commission
                commissions = commissionService.calculateCommission(transactions);

            } else {
                throw Error('Cash In/Out configuration not found.');
            }
        } else {
            throw Error('Transaction data not found.');
        }

        //Return the commissions
        return commissions;

    };
}