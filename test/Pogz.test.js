const { assert } = require('chai');
const { FormControlStatic } = require('react-bootstrap');

const Pogz = artifacts.require('./Pogz');

//chai kontrolleri
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Pogz', (accounts) => {
    let contract
    before(async () => {
        contract = await Pogz.deployed()
    })

    //test alanı
    describe('deployment', async () => {
        it('deploys succesfuly', async () => {
            const address = contract.address;
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
            assert.notEqual(address, 0x0)
        })
        it('it has a name', async () => {
            const name = await contract.name()
            assert.equal(name, 'Pogz')

        })
        it('it has a symbol', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'POGZ')

        })
    })

    //minting test
    describe('mint', async () => {
        it('creats a new token', async () => {
            const result = await contract.mint('https...1')
            const totalSupply = await contract.totalSupply()

            //success
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', 'form is the contract')
            assert.equal(event._to, accounts[0], 'to is msg.sender')

            //fail
            await contract.mint('https...1').should.be.rejected;
        })

    })

    //indexing test
    describe('indexing', async () => {
        it('list Pogz', async () => {
            await contract.mint('https...2')
            await contract.mint('https...3')
            await contract.mint('https...4')
            const totalSupply = await contract.totalSupply()

            //loop list and grap Pogz from list
            let result = []
            let Pogz
            for (i = 0; i <= totalSupply - 1; i++) { // PogZ = Pogz.sol içinde bulunan nftleri tutan array
                Pogz = await contract.PogZ(i)
                result.push(Pogz)
            }

            let expected = ['https...1', 'https...2', 'https...3', 'https...4']
            assert.equal(result.join(','), expected.join(','))
        })
    })

    
})