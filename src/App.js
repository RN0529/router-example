import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Debits from "./components/Debits";

import axios from "axios";
import Credits from "./components/Credits";


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      debits: [],
      credits: []
    }
  }

  async componentDidMount() {
    let debits = await axios.get("https://moj-api.herokuapp.com/debits")
    let credits = await axios.get("https://moj-api.herokuapp.com/credits")
   
    //get data from API response
    debits = debits.data
    credits = credits.data

    let debitSum = 0, creditSum = 0;
    debits.forEach((debit) => {
      debitSum += debit.amount
    })
    credits.forEach((credit) => {
      creditSum += credit.amount
    })

    let accountBalance = creditSum - debitSum;
    accountBalance = accountBalance.toFixed(2)
    
    this.setState({debits, credits, accountBalance});
  } 


  addDebit = (e) => {
    //send to debits view via props
    //updates state based off user input
    e.preventDefault()
    let { debits } = this.state
    let balance = this.state.accountBalance;

    const description  = e.target[0].value
    const amount  = Number(e.target[1].value)
    const today = new Date();

    //formatting to match other dates
    const month = today.getMonth() + 1;
    const date = today.getFullYear().toString() + "-" + month.toString() + "-" + today.getDate().toString();
    
    const newDebit = {description, amount, date}
    balance = balance - amount;
    balance = balance.toFixed(2)
    balance= parseFloat(balance)
    debits = [...debits, newDebit]
    this.setState({debits: debits, accountBalance: balance})
  }


  addCredit = (e) => {
    //send to debits view via props
    //updates state based off user input
    e.preventDefault()
    let { credits } = this.state
    let balances = this.state.accountBalance;

    const description  = e.target[0].value
    const amount  = Number(e.target[1].value)
    const today = new Date();

    //formatting to match other dates
    const month = today.getMonth() + 1;
    const date = today.getFullYear().toString() + "-" + month.toString() + "-" + today.getDate().toString();
    
    const newCredit = {description, amount, date}
    balances= parseFloat(balances)
    balances = balances + amount;
    balances = balances.toFixed(2)
    balances= parseFloat(balances)
    console.log(balances)
    
    credits = [...credits, newCredit]
    this.setState({credits: credits, accountBalance: balances})
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome to React Router!</h1>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debits" element={<Debits addDebit={this.addDebit} debits={this.state.debits} />} />
          <Route path="/credits" element={<Credits addCredit={this.addCredit} credits={this.state.credits} />} />
        </Routes>
        <h3>{this.state.accountBalance}</h3>
      </div>
    );
  }


}


function Home() {
  return (
    <div>
      <h2>Welcome to the homepage!</h2>
      <Link to="/debits">Debits</Link>
      <br></br>
      <Link to="/credits">Credits</Link>
    </div>
  );
}


export default App;