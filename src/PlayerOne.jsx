import React, { Component } from 'react';
import logo from './logo.svg';
import logo_player from './france-rec.png'
import {Grid,Row,Col} from 'react-bootstrap';
import getWeb3 from './utils/getWeb3.js';
import AtlethContract from './contracts/Atleth.json'
import './App.css';

class PlayerOne extends Component {
  constructor(){
    super();
    this.state ={
      address : "",
      web3: '',
      meta_on: false,
      nb_bet : 10,
      odd: 3,
      bet: 0,
      seconds : 0,
      weiConv : 1000000000000000000
    }
    this.getInfos = this.getInfos.bind(this);
    this.Bet = this.Bet.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
      that.getInfos()
    });
  })
  .catch(() => {
    console.log('Error finding web3.')
  })

  }

  handleInputChange(e) {
    this.setState({bet: e.target.value*1000000000000000000});
  }

  getInfos(){
    var that = this;

    const contract = require('truffle-contract');
    const Atleth = contract(AtlethContract);
    Atleth.setProvider(this.state.web3.currentProvider);
    var AtlethInstance;
    this.state.web3.eth.getAccounts((error, accounts) => {
    Atleth.deployed().then((instance) => {
      //Instanciation du contrat
      AtlethInstance = instance
    }).then((result) => {
      // On récupère ensuite la valeur du contrat
      // et on appelle la fonction BuyFirst avec ses paramètres.
      return AtlethInstance.AmountOne.call({from: accounts[0]})
    }).then((result) => {
      console.log(result.c[0])
      return this.setState({ nb_bet: result.c / 10000})
    });
  })

    this.state.web3.eth.getAccounts((error, accounts) => {
    Atleth.deployed().then((instance) => {
      //Instanciation du contrat
      AtlethInstance = instance
    }).then((result) => {
      // On récupère ensuite la valeur du contrat
      // et on appelle la fonction BuyFirst avec ses paramètres.
      return AtlethInstance.Odd.call(1, {from: accounts[0]})
    }).then((result) => {
      return this.setState({ odd: 1 + (result.c /10000) })
    })

    });
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


  Bet(){
    var that = this;
    const contract = require('truffle-contract');
    const Atleth = contract(AtlethContract);
    Atleth.setProvider(this.state.web3.currentProvider);
    var AtlethInstance;
    this.state.web3.eth.getAccounts((error, accounts) => {
        Atleth.deployed().then((instance) => {
          AtlethInstance = instance
        }).then((result) => {
          // Get the value from the contract to prove it worked.
          return AtlethInstance.bet(1, {from: accounts[0],
          value: this.state.bet})
        }).then((result) => {
          // Update state with the result.
          that.getInfos();
        })
      })


  }

  render(){
    return(
      <div>
      <Row><h4 className="title_game">France</h4></Row>
      <hr/>
        <Row><img src={logo_player} className="image_player" /></Row>

          <Row>
            <Col xs={0} md={1} lg={2}></Col>
            <Col xs={6} md={5} lg={4}><h5 className="infos"><span className="ball_blue"></span> Odds : {this.state.odd}</h5></Col>
            <Col xs={6} md={5} lg={4}><h5 className="infos"><span className="ball_blue"></span> Total bet : {this.state.nb_bet} ETH</h5></Col>
            <Col xs={0} md={1} lg={2}></Col>
          </Row>
          <br/>
        <Row>

          <Col xs={12}>
          <form>
            <div className="input-group">
              <input type="text" className="form-control" onChange={this.handleInputChange} required pattern="[0-9]*[.,][0-9]*"/>
              <span className="input-group-addon">Gain : {this.state.bet*this.state.odd/this.state.weiConv} ETH</span>
            </div>
          </form>
          </Col>

        </Row>
        <Row><div className="button_bet" onClick={this.Bet}>Bet</div>
      </Row>

      </div>
    );
  }
}

export default PlayerOne;
