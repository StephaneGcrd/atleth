import React, {Component} from 'react';
import logo from './img/logo.svg';
import './App.css';
import PlayerOne from './modules/PlayerOne.jsx';
import ethereum from './img/ethereum.png';
import fond from './img/stadium.jpeg';
import PlayerTwo from './modules/PlayerTwo.jsx';
import AtlethContract from './contracts/Atleth.json'
import getWeb3 from './utils/getWeb3.js';
import {Grid, Row, Col} from 'react-bootstrap';

const contract = require('truffle-contract');
const Atleth = contract(AtlethContract);

class App extends Component {
    constructor() {
        super();
        this.state = {
            web3: '',
            address: "0x0",
            meta_on: false,
        };
        this.setWinner = this.setWinner.bind(this);
    }

    componentWillMount() {
        // get the user wallet address.
        getWeb3.then(results => {
            results.web3.eth.getAccounts((error, acc) => {
                this.setState({address: acc[0], meta_on: true, web3: results.web3})
            });
        }).catch(() => {
            console.log('Error finding web3.')
        })

    }


    setWinner() {

        Atleth.setProvider(this.state.web3.currentProvider);

        let AtlethInstance;


        this.state.web3.eth.getAccounts((error, accounts) => {
            Atleth.deployed().then((instance) => {
                AtlethInstance = instance
            }).then((result) => {
                // Get the value from the contract to prove it worked.
                // Calling the distributePrize function, giving 1 in parameter ( so the team 1 will win )
                return AtlethInstance.distributePrizes(1, {
                    from: accounts[0],
                    value: this.state.bet
                })
            }).then((result) => {
                console.log('Winner correctly set')
            }).catch(()  =>{
                console.log('Error with setWinner() function')
            })
        })
    }

    render() {
        return (<div className="App">
            <div className="bet_div">
                <header className="App-header">
                    <Row>
                        <Col xs={3}></Col>
                        <Col xs={6}>
                            <h1>Welcome to Atl.eth
                            </h1>
                            <h4>
                                Bet with your ethers & win money securely</h4>
                        </Col>
                        <Col xs={3}>
                            <h5 className="alignright">Your eth address: {this.state.address}</h5>
                        </Col>
                    </Row>

                </header>

                <Grid>
                    <Row>
                        <Col xs={12} sm={6}>
                            <div className="containerWhite"><PlayerOne/></div>
                        </Col>
                        <Col xs={12} sm={6}>
                            <div className="containerWhite"><PlayerTwo/></div>
                        </Col>
                    </Row>
                </Grid>
            </div>
            <br/>
            <br/>
            <div className="explain_div">
                <Grid>
                    <Row></Row>
                    <Row>
                        <Col xs={1}></Col>
                        <Col xs={10}>
                            <img src={ethereum} height="100"/>
                            <h1>
                                Use Ethereum technology to bet on this match</h1>
                            <br/>
                            <h3>How to make it work ?</h3>
                            <hr/>
                            <h4>Install <a href="https://metamask.io/">Metamask</a> extension on Chrome & Go to Ropsten
                                network</h4>
                            <h5>An API giving the game results will automatically trigger the smart-contract and give a
                                ponderation (depending on the bet) of the jackpot to the winners</h5>
                        </Col>
                        <Col xs={1}></Col>
                    </Row>

                </Grid>

                <div className="footer" onClick={this.setWinner}>© Stéphane Guichard, 2018</div>
            </div>

        </div>);
    }
}

export default App;
