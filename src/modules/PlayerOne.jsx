import React, {Component} from 'react';
import logo_player from '../img/france-rec.png'
import {Grid, Row, Col} from 'react-bootstrap';
import getWeb3 from '../utils/getWeb3.js';
import AtlethContract from '../contracts/Atleth.json'
import '../App.css';

const contract = require('truffle-contract');
const Atleth = contract(AtlethContract);

class PlayerOne extends Component {
    constructor() {
        super();
        this.state = {
            address: "",
            web3: '',
            meta_on: false,
            nb_bet: 10,
            bet: 0,
            weiConv: 1000000000000000000
        }
        this.getNumberBets = this.getNumberBets.bind(this);
        this.Bet = this.Bet.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentWillMount() {
        var that = this;
        getWeb3.then(results => {
            results.web3.eth.getAccounts((error, acc) => {
                this.setState({address: acc[0], meta_on: true, web3: results.web3})
                that.getNumberBets()
            });
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    handleInputChange(e) {
        this.setState({
            bet: e.target.value * this.state.weiConv
        });
    }

    getNumberBets() {

        Atleth.setProvider(this.state.web3.currentProvider);
        let AtlethInstance;
        this.state.web3.eth.getAccounts((error, accounts) => {
            Atleth.deployed().then((instance) => {
                //Instanciation du contrat
                AtlethInstance = instance
            }).then((result) => {
                // On récupère ensuite la valeur du contrat
                // et on appelle la fonction BuyFirst avec ses paramètres.
                return AtlethInstance.AmountOne.call({from: accounts[0]})
            }).then((result) => {
                console.log(result.c)
                return this.setState({
                    nb_bet: result.c / 10000
                })
            });
        })
    }


    Bet() {
        Atleth.setProvider(this.state.web3.currentProvider);
        let AtlethInstance;
        this.state.web3.eth.getAccounts((error, accounts) => {
            Atleth.deployed().then((instance) => {
                AtlethInstance = instance
            }).then((result) => {
                // Get the value from the contract to prove it worked.
                return AtlethInstance.bet(1, {
                    from: accounts[0],
                    value: this.state.bet
                })
            }).then((result) => {
                // Update state with the result.
            })
        })
        this.getNumberBets()
    }


    render() {
        return (<div>
            <Row>
                <h4 className="title_game">FRANCE</h4>
            </Row>
            <hr/>
            <Row><img src={logo_player} className="image_player"/></Row>

            <Row>
                <Col xs={0} md={1} lg={2}></Col>
                <Col xs={12} md={10} lg={8}>
                    <h5 className="infos">
                        <span className="ball_blue"></span>
                        Total bet : {this.state.nb_bet}
                        ETH</h5>
                </Col>
                <Col xs={0} md={1} lg={2}></Col>
            </Row>
            <br/>
            <Row>

                <Col xs={12}>
                    <form>
                        <div className="input-group">
                            <input type="text" className="form-control" onChange={this.handleInputChange}
                                   required="required" pattern="[0-9]*[.,][0-9]*"/>
                            <span className="input-group-addon">ETH</span>
                        </div>

                    </form>
                </Col>

            </Row>
            <Row>
                <div className="button_bet" onClick={this.Bet}>Bet</div>

            </Row>

        </div>);
    }
}

export default PlayerOne;
