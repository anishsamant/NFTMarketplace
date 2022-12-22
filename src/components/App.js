import React, { Component } from 'react';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import KryptoBird from './src/abis/KryptoBird.json';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, 
    MDBCardImage, MDBCardFooter } from 'mdb-react-ui-kit';

import Popup from './Popup';

import './App.css';


import AWSHttpProvider from '@aws/web3-http-provider';
const endpoint = process.env.NFT_HTTP_ENDPOINT;
const web3 = new Web3(new AWSHttpProvider(endpoint));
web3.eth.getNodeInfo().then(console.log);

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            kryptoBirdz: [],
            totalAvailable: 0,
            showPopup: false,
            tokenid: null
        }
    }

    tokens = [
        'https://i.ibb.co/QXw6sj1/k1.png', 'https://i.ibb.co/0jXWJHz/k2.png', 'https://i.ibb.co/KhCPp4c/k3.png', 
        'https://i.ibb.co/128yW6X/k4.png', 'https://i.ibb.co/724VVpd/k5.png', 'https://i.ibb.co/HdtxKRf/k6.png', 
        'https://i.ibb.co/Rybj7Bc/k7.png', 'https://i.ibb.co/dcv7g1M/k8.png', 'https://i.ibb.co/Jx3fjkH/k9.png', 
        'https://i.ibb.co/f8223qB/k10.png', 'https://i.ibb.co/b5QJPxC/k11.png'
    ]

    async componentDidMount() {
        let res = await this.loadWeb3();
        if (res !== -1) {
            await this.loadBlockchainData();
        }
    }

    // detect ethereum provider
    async loadWeb3() {
        const provider = await detectEthereumProvider();
        if (provider) {
            await window.ethereum.enable();
            window.web3 = new Web3(provider);
            return 1;
        } else {
            console.log("Not Working");
            window.alert("No provider detected");
            return -1;
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]})
        // const networkId = await web3.eth.net.getId();
        // const networkData = KryptoBird.networks[networkId];
        if (KryptoBird) {
            const abi = KryptoBird.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract})

            const totalSupply = await contract.methods.totalSupply().call();
            this.setState({totalSupply});

            for (let i = 0; i < totalSupply; i++) {
                const KryptoBird = await contract.methods.kryptoBirdz(i).call();
                const owner = await contract.methods.ownerOf(i).call();
                let kbirdInfo = {
                    kryptoBird: KryptoBird,
                    owner: owner
                }
                this.setState({kryptoBirdz: [...this.state.kryptoBirdz, kbirdInfo]});
            }
            let totalAvailable = 11 - totalSupply;
            this.setState({totalAvailable});
        } else {
            window.alert('Smart contract not deployed');
        }
    }

    togglePopup(tokenId) {
        this.setState({
          showPopup: !this.state.showPopup
        });
        this.setState({
            tokenid: tokenId.index
        });
    }

    mint() {
        let kryptoBird;
        let tokensMinted = this.state.kryptoBirdz.length;
        let tokenSupply = this.tokens.length;
        if (tokensMinted === tokenSupply) {
            return;
        }
        for (let i=0; i<tokenSupply; i++) {
            let present = false;
            for (let j=0; j<tokensMinted; j++) {
                if (this.tokens[i] === this.state.kryptoBirdz[j].kryptoBird) {
                    present = true;
                    break;
                }
            }
            if (!present) {
                kryptoBird = this.tokens[i]
                break;
            }
        }
        let kbirdInfo = {
            kryptoBird: kryptoBird,
            owner: this.state.account
        }
        this.state.contract.methods.mint(kryptoBird).send({from: this.state.account})
        .on('confirmation', (con) => {
            if (kbirdInfo) {
                this.setState({
                    kryptoBirdz: [...this.state.kryptoBirdz, kbirdInfo]
                });
                kbirdInfo = null;
                this.setState({totalAvailable: this.state.totalAvailable - 1});
            } 
        });
    }

    render() {
        const listItems = this.state.kryptoBirdz.map((kbird, index) => 
            <MDBCard key={kbird.kryptoBird} className='token img' style={{maxWidth: '25rem'}}>
                <MDBCardImage 
                    src={kbird.kryptoBird}
                    alt={kbird.kryptoBird}
                    position='top'
                    height= '250px'
                />
                <MDBCardBody>
                    <MDBCardTitle className="projects-card-title">KryptoBirdz</MDBCardTitle>
                    <MDBCardText className="projects-card-text">
                        <span>Owner: <span style={{color: '#0608A3', fontSize: '18px'}}>{kbird.owner}</span></span>
                    </MDBCardText>
                </MDBCardBody>
                <MDBCardFooter className="projects-card-footer">
                    <button disabled={kbird.owner !== this.state.account} className={kbird.owner !== this.state.account? 'transfer-btn-disabled': 'transfer-btn'} onClick={() => this.togglePopup({index})}>Transfer</button>
                </MDBCardFooter>
            </MDBCard>
        );
        return (
            <div className='container-filled'>
                <nav className='navbar navbar-dark fixed-top bg-dark flex-mdnowrap p-0 shadow'>
                    <div className='navbar-brand col-sm-3 col-md-3 mr-0' style={{color: 'white'}}>
                        KryptoBird NFTS
                    </div>
                    <ul className='navbar-nav px-3'>
                        <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                            <small className='text-white'>
                                {this.state.account}
                            </small>
                        </li>
                    </ul>
                </nav>

                <div className='container-fluid mt-1'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 d-flex text-center'>
                            <div className='content mr-auto ml-auto' stylee={{opacity: '0.8'}}>
                                <h1 style={{color: 'black'}}>KryptoBirdz - NFT Marketplace</h1>
                                <h5>11 uniquely generated Kbirdz</h5>
                                <button className="mint-btn" onClick={() => this.mint()}>MINT</button>
                                {this.state.totalAvailable > 0 ? 
                                    <div style={{padding: '5px'}}> {this.state.totalAvailable} left, Hurry up!!! </div> :
                                    <div style={{padding: '5px'}}> Sold out, buy from the market </div>
                                }       
                            </div>
                        </main>
                    </div>

                    <hr></hr>

                    <div className="cards-container-style row">  
                        {listItems}
                    </div>
                </div>

                <Popup
                    show = {this.state.showPopup}
                    onHide = {() => this.setState({showPopup: false})}
                    from = {this.state.account}
                    contract = {this.state.contract}
                    tokenid = {this.state.tokenid}
                    context = {this}
                />
                    
            </div>
        );
    }
}

export default App;