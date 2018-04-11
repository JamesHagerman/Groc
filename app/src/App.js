import React, { Component } from 'react';
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import { Checkbox, Button, Collapse, Intent } from '@blueprintjs/core';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

import croc from './croc.png'
import './App.css';

const initialState = {
  itemList: [],
  toAdd: '',
  sotableDisabled: true,
  helpIsOpen: true,
  controlsAreOpen: false
}

class App extends Component {

  constructor(props) {
    super(props)

    this.saveState = this.saveState.bind(this)
    this.resetState = this.resetState.bind(this)
    this.recoverState = this.recoverState.bind(this)

    const recoveredState = this.recoverState()
    if (recoveredState === null) {
      this.resetState()
    } else {
      this.state = recoveredState
    }

    this.handleEnabledChange = this.handleEnabledChange.bind(this)
    this.handleItemEdit = this.handleItemEdit.bind(this)
    this.handleNewItem = this.handleNewItem.bind(this)
    this.handleSortEnd = this.handleSortEnd.bind(this)
    this.handleShowHelp = this.handleShowHelp.bind(this)
    this.handleShowControls = this.handleShowControls.bind(this)

    this.renderSortableComponent = this.renderSortableComponent.bind(this)
  }

  handleShowHelp() {
    this.setState({
      ...this.state,
      helpIsOpen: !this.state.helpIsOpen
     }, this.saveState)
  }

  handleShowControls() {
    this.setState({
      ...this.state,
      controlsAreOpen: !this.state.controlsAreOpen
    }, this.saveState)
  }

  handleEnabledChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    console.log(this.state.sotableDisabled)
    this.setState({
      ...this.state,
      sotableDisabled: value
    }, this.saveState)
  }

  handleItemEdit(event) {
    console.log(event.target.value)
    this.setState({
      ...this.state,
      toAdd: event.target.value
    }, this.saveState)
  }

  handleNewItem() {
    const newValue = this.state.toAdd.trim()
    if (newValue === '') {
      return
    }
    const newItemList = this.state.itemList.concat(newValue)
    console.log('new item added:', newItemList)
    this.setState({
      ...this.state,
      toAdd: '',
      itemList: newItemList
    }, this.saveState)
    
  }

  handleSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      ...this.state,
      itemList: arrayMove(this.state.itemList, oldIndex, newIndex),
    }, this.saveState)
  };

  saveState() {
    console.log('Saving Groc State:' + this.state, this.state)
    localStorage.setItem('grocStateData', JSON.stringify(this.state));
  }

  resetState() {
    console.log('Resetting Groc State...')
    // TODO: Find a better way to set state on mount and any other time:
    this.state = initialState
    this.setState(initialState, this.saveState)
  }

  recoverState() {
    const grocStateDataJSON = localStorage.getItem('grocStateData');
    let grocStateData = {}
    if (grocStateDataJSON === null || grocStateDataJSON === '"[object Object]"') {
      console.log('No Groc State to recover...')
      return null
    }
    try {
      grocStateData = JSON.parse(grocStateDataJSON)
    }
    catch(error) {
      console.error('Groc State was invalid! Resetting it...');
      return null
    }
    console.log('Got Groc State Data from localStorage:', JSON.stringify(grocStateData,0,2))
    return grocStateData
  }

  renderSortableComponent() {
    const items = this.state.itemList
    return (
      <SortableList items={items} onSortEnd={this.handleSortEnd} disabled={this.state.sotableDisabled}/>
    )// lockAxis='y'
  }
  render() {
    // TODO: Upgrade blueprint to something AFTER 2.1.1 because checkboxes were broken in that version
    return (
      <div className='App pt-app pt-dark'>
        <div className='groc-outter'>
          <div className={`groc-doc column`} >
            <Collapse isOpen={this.state.helpIsOpen} className='docs'>
              <img src={croc} className={this.state.helpIsOpen ? 'large' : 'small'} />
              <p>Groc Your Grocery List!</p>
              <pre>
                <p>1. Add items not yet on the list</p>
                <p>2. Check items you need</p>
                <p>3. Enable sorting</p>
                <p>4. Sort items by store location</p>
                <p>5. Disable sorting</p>
                <p>6. Uncheck items when get them</p>
              </pre>
              <p>
                All items and their order are saved to your browser's local storage for your next visit.
              </p>
            </Collapse>
            <Button onClick={this.handleShowHelp} className='showHide'>
                {this.state.helpIsOpen ? "Hide" : "Show"} Help
            </Button>
            <Button onClick={this.handleShowControls} className='showHide'>
                {this.state.controlsAreOpen ? "Hide" : "Show"} Tools
            </Button>
          </div>
          <div className='groc-list'>
            {/* Items you need: */}
            {this.renderSortableComponent()}
          </div>
          <div className='groc-control'>
            <input className="pt-input .modifier" type="text" value={this.state.toAdd} placeholder="Item Name" dir="auto" onChange={this.handleItemEdit}/>
            <Button intent={Intent.SUCCESS} onClick={this.handleNewItem}>
              Add Item
            </Button>
            <div>
              <label className="pt-label .modifier">
                Disable Item Sorting:
                <input
                  name="isDraggable"
                  type="checkbox"
                  checked={this.state.sotableDisabled}
                  onChange={this.handleEnabledChange} />
                {/* <Checkbox label="Toggle Resortable" onChange={this.handleEnabledChange}/> */}
              </label>
            </div>
            <Collapse isOpen={this.state.controlsAreOpen} className='controls'>
              <Button onClick={this.resetState}>
                  Reset Groc
              </Button>
            </Collapse>
            <div>
              
            </div>
          </div>
          <div className='groc-footer'>
            <p>
              Thanks for trying Groc! <img src={croc} className={this.state.helpIsOpen ? 'tiny' : 'small'} /><br/> 
              Suggestion? Issues? <a href="">GitHub</a>.<br/>
            </p>
            <p>
              © 2018 <a href='https://twitter.com/jamisnemo'>James Hagerman</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const SortableItem = SortableElement(({value}) =>
  <li>
    <Checkbox label={value} className='pt-align-right pt-large'/>
  </li>
);

const SortableList = SortableContainer((props) => {
  const {items, disabled} = props
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} value={item} disabled={disabled}/>
      ))}
    </ul>
  );
});

export default App;
