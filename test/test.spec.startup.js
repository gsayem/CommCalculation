import chai from 'chai';
import sinon from 'sinon';
import { Startup } from '../src/startup.js';
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
describe('Startup================================', async () => {
    describe('#startApp()', async () => {
        it('require arguments', async () => {
            let consoleError = sinon.spy(console, 'error');
            const message = 'Please provide arguments to Startup';
            const startup = new Startup();
            startup.startApp();
            assert.equal(consoleError.calledWith(message), true);
            consoleError.restore();
        });
        it('arguments passed and call processFile() with arguments', async () => {
            const startup = new Startup();
            const stub = sinon.stub(startup, 'processFile');
            startup.startApp('[]');
            assert.equal(stub.calledOnce, true);
            stub.restore();
        });
    });


    describe('#processFile()', async () => {
        it('incorrect arguments passed', async () => {
            const message = 'Syntax: node .\\src\\app.js input.json';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.processFile('[]'), message);
        });
        it('correct arguments passed but File not found', async () => {
            const message = 'File not found';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.processFile('node .\src\app.js input.json'), message);
        });
    });
    describe('#validateFile()', async () => {
        it('Should throw Json data can not parse', async () => {
            const message = 'Json data can'/'t parse.\nSyntaxError: Unexpected token ] in JSON at position 4';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile('[{},]'), message);
        });
        it('Should throw Empty file/json data.', async () => {
            const message = 'Empty file/json data.';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile('[]'), message);
        });
        it('should throw validation error when not providing date.', async () => {
            let data = [
                { 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0]: requires property "date"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when provide invalid date.', async () => {
            let data = [
                { 'date': '2016-013-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0].date: does not conform to the "date" format';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when not providing user_id.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0]: requires property "user_id"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when provide invalid user_id.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 0, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0].user_id: must have a minimum value of 1';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when not providing user_type.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0]: requires property "user_type"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when provide invalid user_type.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'sprotsman', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0].user_type: is not one of enum values: natural,juridical';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when not providing type.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0]: requires property "type"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when provide invalid type.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_plus', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0].type: is not one of enum values: cash_in,cash_out';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when not providing operation.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in' }
            ];
            const message = 'Invalid data format.\ninstance[0]: requires property "operation"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when operation properties missing.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': {} }
            ];
            const message = 'Invalid data format.\ninstance[0].operation: requires property "amount",instance[0].operation: requires property "currency"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });

        it('should throw validation error when not providing operation amount.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0].operation: requires property "amount"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });

        it('should throw validation error when provide invalid operation amount.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 0, 'currency': 'EUR' } }
            ];
            const message = 'Invalid data format.\ninstance[0].operation.amount: must have a minimum value of 0.01';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when not providing operation currency.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 1 } }
            ];
            const message = 'Invalid data format.\ninstance[0].operation: requires property "currency"';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
        it('should throw validation error when provide invalid operation currency.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 1, 'currency': 'USD' } }
            ];
            const message = 'Invalid data format.\ninstance[0].operation.currency: is not one of enum values: EUR';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.validateFile(JSON.stringify(data)), message);
        });
    });

    describe('#jsonToModelMap()', async () => {
        it('should return transaction array when valid json provide.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const startup = new Startup();
            expect(startup.jsonToModelMap(data)).to.be.an('array')
        });
        it('should return transaction array length 1 when 1 valid json data provide.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } }
            ];
            const startup = new Startup();
            expect(startup.jsonToModelMap(data)).to.be.an('array').to.have.length(1)
        });
        it('should return transaction array length 5 when 5 valid json data provide.', async () => {
            let data = [
                { 'date': '2016-01-05', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_in', 'operation': { 'amount': 200.00, 'currency': 'EUR' } },
                { 'date': '2016-01-06', 'user_id': 2, 'user_type': 'juridical', 'type': 'cash_out', 'operation': { 'amount': 300.00, 'currency': 'EUR' } },
                { 'date': '2016-01-06', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 30000, 'currency': 'EUR' } },
                { 'date': '2016-01-07', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 1000.00, 'currency': 'EUR' } },
                { 'date': '2016-01-07', 'user_id': 1, 'user_type': 'natural', 'type': 'cash_out', 'operation': { 'amount': 100.00, 'currency': 'EUR' } }
            ];
            const startup = new Startup();
            expect(startup.jsonToModelMap(data)).to.be.an('array').to.have.length(5)
        });
        it('should return transaction array length 0 when empty json provide.', async () => {
            let data = '';
            const startup = new Startup();
            expect(startup.jsonToModelMap(data)).to.be.an('array').to.have.length(0)
        });
    });
    describe('#calculation()', async () => {
        it('should throw Transaction data not found when null transactions provide', async () => {
            const message = 'Transaction data not found.'
            const startup = new Startup();
            await expectThrowsAsync(() => startup.calculation(null), message);
        });
        it('should throw Transaction data not found when not null but zero length transactions provide', async () => {
            const message = 'Transaction data not found.';
            const startup = new Startup();
            await expectThrowsAsync(() => startup.calculation([]), message);
        });
        
    });

});
