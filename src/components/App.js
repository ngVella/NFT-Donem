import React, { Component } from "react";

import detectEthereumProvider from "@metamask/detect-provider";
import Pogz from '../abis/Pogz.json';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardImage, MDBBtn, MDBCardText } from 'mdb-react-ui-kit'
import './App.css';
import logo from '../logo.png';

var Eth = require('web3-eth');

// or using the web3 umbrella package

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

// -> web3.eth

class App extends Component {
    

    async componentDidMount() {
        this.balance();
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    //first detect ethereum provider
    async loadWeb3() {
        const provider = await detectEthereumProvider();

        //modern browsers
        if (provider) {
            console.log("Ethereum Wallet Detected")
            window.web3 = new Web3(provider)
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(res => { })
        }
        else {
            console.log("No ETH Wallet")
        }

    }

    async loadBlockchainData() {
        //bağlı olduğumuz cüzdan adresi

        const _accounts = await window.web3.eth.getAccounts();
        this.setState({ accounts: _accounts[0] })

        //bağlı olduğumuz netword ıD
        const networkID = await web3.eth.net.getId();
        const networkData = Pogz.networks[networkID]

        if (networkData) {
            //contract
            const abi = Pogz.abi;
            const address = networkData.address;
            const _contract = new web3.eth.Contract(abi, address)
            this.setState({ contract: _contract })

            //totalsupply
            const _totalSupply = await _contract.methods.totalSupply().call()
            this.setState({ totalSupply: _totalSupply })

            //token listesi
            for (let i = 0; i <= _totalSupply - 1; i++) { // PogZ = Pogz.sol içinde bulunan nftleri tutan array
                const _PogzList = await _contract.methods.PogZ(i).call()
                this.setState({
                    PogZ: [...this.state.PogZ, _PogzList]
                })
                this.setState({ PogzList: [_PogzList] })
            }
        }
        else {
            window.alert('Smart Contract Cant Deployed')
        }

    }


   balance = async() => {
       const _blocks=  await web3.eth.getBlock()
       console.log(_blocks.number)
        for (let i = 251 ; i<=_blocks.number; i++){
            const tempBlock = await web3.eth.getBlock(i)
            this.setState({
                blockNumber: [...this.state.blockNumber, tempBlock.number],
                tokenList: [tempBlock.number],
                hashList: [...this.state.hashList, tempBlock.hash],
                lastHash: [tempBlock.hash],
                parentHashList: [...this.state.parentHashList, tempBlock.parentHash],
                lastParentHash: [tempBlock.parentHash],
                gasLimitList: [...this.state.gasLimitList, tempBlock.gasLimit],
                lastGasLimit: [tempBlock.gasLimit],
                gasUsedList: [...this.state.gasUsedList, tempBlock.gasUsed],
                lastGasUsed: [tempBlock.gasUsed]

            })
        }
    }
    
    mint = (PogzNFT) => {
        this.state.contract.methods.mint(PogzNFT).send({ from: this.state.accounts })
            .once('receipt', (receipt) => {
                this.setState({
                    PogZ: [...this.state.PogZ, this.state.PogzList],
                    tokenList: [...this.state.tokenList, this.state.blockNumber],
                    lastHash: [...this.state.lastHash, this.state.hashList],
                    lastParentHash: [...this.state.lastParentHash, this.state.parentHashList],
                    lastGasLimit: [...this.state.lastGasLimit, this.state.gasLimitList],
                    lastGasUsed: [...this.state.lastGasUsed, this.state.gasUsedList]
                })
            })
    }

    showLogs = (link) =>{
        //number, hash, parent hash, gas limit, gas used
        alert("I am an alert box!");
        for (const index in this.state.PogZ){
            if (link == this.state.PogZ[index]){
                console.log("Block Number : " + this.state.blockNumber[index])
                console.log("Hash : " + this.state.hashList[index])
                console.log("Parent Hash : " + this.state.parentHashList[index])
                console.log("Gas Limit: " + this.state.gasLimitList[index])
                console.log("Gas Used: " + this.state.gasUsedList[index])
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            accounts: '',
            contract: null,
            totalSupply: 0,
            PogzList: [], //son pogz
            PogZ: [], //pogz list
            blockNumber: [], // block numarası listesi
            tokenList: [], //son token block numarası
            hashList: [],
            lastHash: [],
            parentHashList: [],
            lastParentHash: [],
            gasLimitList: [],
            lastGasLimit: [],
            gasUsedList: [],
            lastGasUsed: []
        }
    }

    render() {
        return (
            <div className="container-filled">

                <div class="bg"></div>
                <div class="bg bg2"></div>
                <div class="bg bg3"></div>

                
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <div className="navbar-brand col-sm-3 col-md-3 mr-0">
                        <img src={logo} style={{ maxWidth: '5rem' }} />
                    </div>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowarp d-none d-sm-none d-sm-block">
                            <small className="text-white">
                                {this.state.accounts}
                            </small>
                        </li>
                    </ul>
                </nav>
            
                <div className="container-fluid mt-1">
                    <div className="row" style={{ margin: '25px' }}>
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <h1 className="main-h1">PogZ NFT MARKET PLACE</h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const PogzNFT = this.PogzNFT.value
                                    this.mint(PogzNFT)
                                }}>
                                    <input type='text'
                                        placeholder='Add a file location'
                                        className="form-control mb-1"
                                        ref={(input) => this.PogzNFT = input} />

                                    <input style={{ margin: '6px' }}
                                        type='submit'
                                        className="btn btn-dark btn-black"
                                        value="MINT" />

                                </form>
                            </div>
                        </main>
                    </div>

                    <hr></hr>
                    <div className="row  textCenter pad">
                        {this.state.PogZ.map((PogZ, key) => {
                            return (
                                <div>
                                    <div>
                                        <MDBCard className="token mdb-card" style={{ maxWidth: '22rem' }}>
                                            <MDBCardImage src={PogZ} className="mdb-card-img" position='top' height={'250rem'} style={{ marginRight: '4px' }} />
                                            <MDBCardBody>
                                                <MDBCardTitle>
                                                    PogZ
                                                </MDBCardTitle>
                                                <MDBCardText>
                                                    Pogz NFTs bir dönem projesi için oluşturulmuş bir test projedir. Kim bilir belki bir gün gerçek olur...
                                                </MDBCardText>
                                                <MDBBtn href={PogZ} className="btn btn-dark btn-black">Download</MDBBtn>
                                                <MDBBtn onClick={() => { this.showLogs(PogZ)}} style={{margin:5}} className="btn btn-dark btn-black">LOGS</MDBBtn>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
//web3js.readthedocs.io
//logları ekrana bastır
//mint fiyatı
