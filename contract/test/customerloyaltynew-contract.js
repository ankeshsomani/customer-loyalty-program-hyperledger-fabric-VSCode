/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { CustomerloyaltynewContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('CustomerloyaltynewContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new CustomerloyaltynewContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"customerloyaltynew 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"customerloyaltynew 1002 value"}'));
    });

    describe('#customerloyaltynewExists', () => {

        it('should return true for a customerloyaltynew', async () => {
            await contract.customerloyaltynewExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a customerloyaltynew that does not exist', async () => {
            await contract.customerloyaltynewExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCustomerloyaltynew', () => {

        it('should create a customerloyaltynew', async () => {
            await contract.createCustomerloyaltynew(ctx, '1003', 'customerloyaltynew 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"customerloyaltynew 1003 value"}'));
        });

        it('should throw an error for a customerloyaltynew that already exists', async () => {
            await contract.createCustomerloyaltynew(ctx, '1001', 'myvalue').should.be.rejectedWith(/The customerloyaltynew 1001 already exists/);
        });

    });

    describe('#readCustomerloyaltynew', () => {

        it('should return a customerloyaltynew', async () => {
            await contract.readCustomerloyaltynew(ctx, '1001').should.eventually.deep.equal({ value: 'customerloyaltynew 1001 value' });
        });

        it('should throw an error for a customerloyaltynew that does not exist', async () => {
            await contract.readCustomerloyaltynew(ctx, '1003').should.be.rejectedWith(/The customerloyaltynew 1003 does not exist/);
        });

    });

    describe('#updateCustomerloyaltynew', () => {

        it('should update a customerloyaltynew', async () => {
            await contract.updateCustomerloyaltynew(ctx, '1001', 'customerloyaltynew 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"customerloyaltynew 1001 new value"}'));
        });

        it('should throw an error for a customerloyaltynew that does not exist', async () => {
            await contract.updateCustomerloyaltynew(ctx, '1003', 'customerloyaltynew 1003 new value').should.be.rejectedWith(/The customerloyaltynew 1003 does not exist/);
        });

    });

    describe('#deleteCustomerloyaltynew', () => {

        it('should delete a customerloyaltynew', async () => {
            await contract.deleteCustomerloyaltynew(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a customerloyaltynew that does not exist', async () => {
            await contract.deleteCustomerloyaltynew(ctx, '1003').should.be.rejectedWith(/The customerloyaltynew 1003 does not exist/);
        });

    });

});