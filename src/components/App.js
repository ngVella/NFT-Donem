import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import Pogz from '../abis/Pogz.json';


class App extends Component {

    async componentDidMount() {
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
        const web3 = window.web3
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

    mint = (PogzNFT) => {
        this.state.contract.methods.mint(PogzNFT).send({ from: this.state.accounts })
            .once('receipt', (receipt) => {
                this.setState({
                    PogZ: [...this.state.PogZ, this.state.PogzList]
                })
            })
    }

    constructor(props) {
        super(props);
        this.state = {
            accounts: '',
            contract: null,
            totalSupply: 0,
            PogzList: [],
            PogZ: []
        }
    }

    render() {
        return (
            <div>
                {console.log(this.state.PogZ)}
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <div className="navbar-brand col-sm-3 col-md-3 mr-0">
                        <h1>POGZ NFTs</h1>
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
                                <h1>POGZ NFT MARKET PLACE</h1>
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
                                        className="btn btn-primary btn-black"
                                        value="MINT" />
                                </form>
                            </div>
                        </main>
                    </div>
                </div>

            </div>
        )
    }
}

export default App;
//web3js.readthedocs.io