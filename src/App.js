import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PlayerOne from './PlayerOne.jsx';
import ethereum from './ethereum.png';
import fond from './stadium.jpeg';
import PlayerTwo from './PlayerTwo.jsx';
import AtlethContract from './contracts/Atleth.json'
import getWeb3 from './utils/getWeb3.js';
import {Grid,Row,Col} from 'react-bootstrap';
class App extends Component {
  constructor(){
    super();
    this.state = {
      web3 : '',
      address: "0x0",
      meta_on: false,
      seconds : 0
    };
    this.setWinner = this.setWinner.bind(this);
  }

  componentWillMount() {
  var that = this;
  getWeb3
  .then(results => {
    results.web3.eth.getAccounts( (error,acc) => {
      this.setState({
        address: acc[0],
        meta_on : true,
        web3: results.web3
      })
    });
  })
  .catch(() => {
    console.log('Error finding web3.')
  })

  }

  tick() {
  this.setState(prevState => ({
    seconds: prevState.seconds + 1
  }));
  }

  componentDidMount() {
  this.interval = setInterval(() => this.tick(), 60000);

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setWinner(){
    const contract = require('truffle-contract');
    const Atleth = contract(AtlethContract);
    Atleth.setProvider(this.state.web3.currentProvider);
    var AtlethInstance;
    this.state.web3.eth.getAccounts((error, accounts) => {
        Atleth.deployed().then((instance) => {
          AtlethInstance = instance
        }).then((result) => {
          // Get the value from the contract to prove it worked.
          return AtlethInstance.distributePrizes(2, {from: accounts[0],
          value: this.state.bet})
        }).then((result) => {
          // Update state with the result.
        })
      })
  }

  render() {
    return (
      <div className="App">
        <div className="bet_div">
        <header className="App-header">
          <Row>
            <Col xs={3}></Col>
            <Col xs={6}>
              <h1>Welcome to Atl.eth </h1>
              <h4> Bet with your ethers & win money securely</h4>
            </Col>
            <Col xs={3}><h5 className="alignright">Your eth address: {this.state.address}</h5></Col>
          </Row>

        </header>

        <Grid>
          <Row>
            <Col xs={12} sm={6}><div className="containerWhite"><PlayerOne /></div></Col>
            <Col xs={12} sm={6}><div className="containerWhite"><PlayerTwo/></div></Col>
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
              <img src={ethereum} height="100" />
              <h1> Use Ethereum technology to bet on this match</h1>
              <br/>
              <h3>How does it work ?</h3>
              <h5>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</h5>
            </Col>
            <Col xs={1}></Col>
          </Row>




        </Grid>

        <div className="footer">© Stéphane Guichard, 2018</div>
        </div>



      </div>
    );
  }
}

export default App;
