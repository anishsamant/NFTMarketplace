const {assert} = require('chai');

const KryptoBird = artifacts.require('KryptoBird');

require('chai').use(require('chai-as-promised')).should();

contract('KryptoBird', accounts => {
    let contract;
    before(async() => {
        contract = await KryptoBird.deployed();
    })

    // container 1: tests on deployment
    describe('deployment', async() => {
        // test 1: to check successful deployment
        it('deployment successful', async() => {
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, 0x0);
        })

        // test 2: test the name in metadata matches
        it('name matched', async() => {
            const name = await contract.name();
            assert.equal(name, 'KryptoBird');
        })

        // test 3: test the name in metadata matches
        it('symbol matched', async() => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'Kbirdz');
        })
    })

    // container 2: tests on minting
    describe('minting', async() => {
        // test 1: test to check if new token is minted successfully
        it('new token minted', async() => {
            const result = await contract.mint('B1');
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', 'from is the contract address');
            assert.equal(event._to, accounts[0], 'to is message sender');

            await contract.mint('B1').should.be.rejected;
        })
    })

    // container 3: tests on indexing
    describe('indexing', async() => {
        // test 1: check the indexes of all tokens
        it('tokens listed', async() => {
            await contract.mint('B2');
            await contract.mint('B3');
            await contract.mint('B4');
            const totalSupply = await contract.totalSupply();

            let result = [];
            let KryptoBird;
            for (let i = 0; i < totalSupply; i++) {
                KryptoBird = await contract.kryptoBirdz(i);
                result.push(KryptoBird);
            }
            let expected = ['B1', 'B2', 'B3', 'B4'];
            assert.equal(expected.join(','), result.join(','));
        })
    })

    // container 4: tests on transfer
    describe('transfering', async() => {
        // test 1: check if token was successfully transferred from one account to another
        it('owned token successfully transferred', async() => {
            const senderInitBalance = await contract.balanceOf(accounts[0]);
            const receiverInitBalance = await contract.balanceOf(accounts[1]);
            const result = await contract.transferFrom(accounts[0], accounts[1], 0);
            const event = result.logs[1].args;                                       // 0th index is Approval and 1st index is Transfer
            const senderNewBalance = await contract.balanceOf(accounts[0]);
            const receiverNewBalance = await contract.balanceOf(accounts[1]);
            assert.equal(event._from, accounts[0], 'from is the sender address');
            assert.equal(event._to, accounts[1], 'to is the recipient address');
            assert.equal(senderInitBalance.words[0] - 1, senderNewBalance.words[0] );
            assert.equal(receiverInitBalance.words[0] + 1, receiverNewBalance.words[0]);
        })

        // test 2: check if unowned token was not transferred
        it('unowned token not transferred', async() => {
            const senderInitBalance = await contract.balanceOf(accounts[0]);
            const receiverInitBalance = await contract.balanceOf(accounts[1]);
            await contract.transferFrom(accounts[0], accounts[1], 5).should.be.rejected;
            const senderNewBalance = await contract.balanceOf(accounts[0]);
            const receiverNewBalance = await contract.balanceOf(accounts[1]);
            assert.equal(senderInitBalance.words[0], senderNewBalance.words[0]);
            assert.equal(receiverInitBalance.words[0], receiverNewBalance.words[0]);
        })
    })

    // container 5: tests on approving
    describe('approving', async() => {
        // test 1: check if another account was successfully approved
        it('another account approved successfully', async() => {
            const result = await contract.approve(accounts[2], 1);
            const event = result.logs[0].args;
            const approvedAddress = await contract.getApproved(1);
            assert.equal(event._owner, accounts[0], 'from is the owner address');
            assert.equal(event._approved, accounts[2], 'to is the approved address');
            assert.equal(approvedAddress, accounts[2]);
        })

        // test 2: check if approved account can transfer tokens
        it('approved account can transfer tokens successfully', async() => {
            const result = await contract.transferFrom(accounts[0], accounts[3], 1, {from: accounts[2]});
            const event = result.logs[1].args;                                       // 0th index is Approval and 1st index is Transfer
            const senderNewBalance = await contract.balanceOf(accounts[0]);
            const receiverNewBalance = await contract.balanceOf(accounts[3]);
            assert.equal(event._from, accounts[0], 'from is the sender address');
            assert.equal(event._to, accounts[3], 'to is the recipient address');
            assert.equal(2, senderNewBalance.words[0]);
            assert.equal(1, receiverNewBalance.words[0]);
        })
    })
})