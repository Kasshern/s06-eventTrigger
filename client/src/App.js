import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
state = { cost: 0, itemName: "exmapleItem1", loaded: false};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      
      this.ItemManager = new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
      );

      this.Item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[networkId] && Item.networks[networkId].address,
      );
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
    this.setState({loaded:true});

  } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleSubmit = async () => {
    const {cost, itemName} = this.state;
    console.log(itemName, cost, this.ItemManager);
    let result = await this.ItemManager.methods.createItem(itemName, cost).send({from: this.accounts[0]});
    console.log(result);
    alert("Send " + cost + " Wei to " + result.events.SupplyChainStep.returnVaules._address);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({[name] : value});
  }
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Simple Payment & Supply Chain</h1>
        <h2>Items</h2>

        <h2>Add Element</h2>
        Cost: <input type="text" name="ItemName" value={this.state.itemName} onChange={this.handleInputChange} />
        <button type ="button" onClick={this.handleSubmit}>Create New Item</button>
        </div>
    );
  }
}

export default App;
