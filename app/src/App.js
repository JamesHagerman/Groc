import React, { Component } from 'react';
import uuid from 'uuid/v1'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import { Checkbox, Button, Collapse, Intent } from '@blueprintjs/core';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

import croc from './croc.png'
import './App.css';

import defaultItems from './defaultItems'

const initialState = {
  itemList: [],
  toAdd: '',
  sotableDisabled: true,
  helpIsOpen: true,
  controlsAreOpen: false,
  checkedHidden: false
}

class App extends Component {

  constructor(props) {
    super(props)

    // Local storage/state management
    this.saveState = this.saveState.bind(this)
    this.resetState = this.resetState.bind(this)
    this.recoverState = this.recoverState.bind(this)

    const recoveredState = this.recoverState()
    if (recoveredState === null) {
      this.resetState()
    } else {
      this.state = recoveredState
    }

    // Useful tools
    this.handleShowHelp = this.handleShowHelp.bind(this)
    this.handleShowControls = this.handleShowControls.bind(this)
    this.handleShowChecked = this.handleShowChecked.bind(this)
    this.handleAddCommonItems = this.handleAddCommonItems.bind(this)

    // Item stuff
    this.buildNewItem = this.buildNewItem.bind(this)
    this.handleItemEdit = this.handleItemEdit.bind(this)
    this.handleNewItem = this.handleNewItem.bind(this)
    this.handleNewItemKeyPress = this.handleNewItemKeyPress.bind(this)
    this.handleCheck = this.handleCheck.bind(this)

    // sortable list stuff
    this.handleEnabledChange = this.handleEnabledChange.bind(this)
    this.handleSortEnd = this.handleSortEnd.bind(this)
    this.renderSortableComponent = this.renderSortableComponent.bind(this)
  }

  saveState() {
    console.log('Saving Groc State:', this.state)
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
      prompt('Groc state was invalid. Here it is if you want to debug it:', JSON.stringify(this.state))
      return null
    }
    console.log('Got Groc State Data from localStorage:', JSON.stringify(grocStateData,0,2))
    return grocStateData
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

  handleShowChecked() {
    this.setState({
      ...this.state,
      checkedHidden: !this.state.checkedHidden
    }, this.saveState)
  }

  handleAddCommonItems() {
    let newItemList = this.state.itemList.concat()

    defaultItems.forEach((itemName) => {
      let itemAlreadyInList = newItemList.find((item) => {
        return item.itemName === itemName
      })
      if (typeof itemAlreadyInList === 'undefined') {
        let newItem = this.buildNewItem(itemName)
        // console.log('Adding', newItem)
        newItemList.push(newItem)
      }
    })

    this.setState({
      ...this.state,
      itemList: newItemList
    })
  }

  buildNewItem(itemName) {
    return {
      itemUuid: uuid(),
      itemName,
      itemChecked: false
    }
  }

  handleItemEdit(event) {
    // console.log(event.target.value)
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
    const newItem = this.buildNewItem(newValue)
    const newItemList = this.state.itemList.concat(newItem)
    console.log('new item added:', newItemList)
    this.setState({
      ...this.state,
      toAdd: '',
      itemList: newItemList
    }, this.saveState)
    
  }

  handleNewItemKeyPress(event) {
    if(event.keyCode === 13) {
      this.handleNewItem()
    }
  }

  handleCheck(event) {
    const target = event.target
    const checked = target.checked
    const uuid = target.value
    console.log('OK!', uuid, checked)

    const updatedItemList = this.state.itemList.concat()
    console.log('currentList', updatedItemList)
    const modifiedItemId = updatedItemList.findIndex((item, index) => {
      console.warn('item', item)
      return item.itemUuid === uuid;
    })

    console.log('modifiedItemId', modifiedItemId)
    
    let itemToToggle = updatedItemList[modifiedItemId]
    itemToToggle.itemChecked = !itemToToggle.itemChecked

    console.log('omfg:', JSON.stringify(itemToToggle, 0, 2))
    updatedItemList.splice(modifiedItemId, 1, itemToToggle)

    console.log('updatedItemList', updatedItemList)
    this.setState({
      ...this.state,
      itemList: updatedItemList
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

  handleSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      ...this.state,
      itemList: arrayMove(this.state.itemList, oldIndex, newIndex),
    }, this.saveState)
  };

  renderSortableComponent() {
    const items = this.state.itemList
    return (
      <SortableList
        items={items}
        onSortEnd={this.handleSortEnd}
        disabled={this.state.sotableDisabled}
        handleCheck={this.handleCheck}
        checkedHidden={this.state.checkedHidden}/>
    )
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
            <Button onClick={this.handleAddCommonItems}>
              Add Common Items
            </Button>
            <Button onClick={this.handleShowChecked} className='showChecked'>
                {this.state.checkedHidden ? "Show" : "Hide"} Unchecked Items
            </Button>
          </div>

          <div className='groc-list'>
            {this.renderSortableComponent()}
          </div>

          <div className='groc-control'>
            <input
              className="pt-input .modifier"
              type="text"
              value={this.state.toAdd}
              placeholder="Item Name"
              dir="auto"
              onChange={this.handleItemEdit}
              onKeyDown={this.handleNewItemKeyPress}/>
            <Button intent={Intent.SUCCESS} onClick={this.handleNewItem}>
              Add Item
            </Button>
            <div>
              <label className="pt-label .modifier">
                Disable Sorting: 
                <input
                  name="isDraggable"
                  type="checkbox"
                  checked={this.state.sotableDisabled}
                  onChange={this.handleEnabledChange} />
                {/* <Checkbox label="Toggle Resortable" onChange={this.handleEnabledChange}/> */}
              </label>
              <Button onClick={this.handleShowControls} className='showHide'>
                {this.state.controlsAreOpen ? "Hide" : "Show"} Tools
              </Button>
            </div>
            <Collapse isOpen={this.state.controlsAreOpen} className='controls'>
              <Button onClick={this.resetState}>
                  Reset Groc
              </Button>
            </Collapse>
          </div>

          <div className='groc-footer'>
            <p>
              Thanks for trying Groc! <img src={croc} className={this.state.helpIsOpen ? 'tiny' : 'small'} /><br/> 
              Suggestion? Issues? <a href="https://github.com/JamesHagerman/Groc">GitHub</a>.<br/>
            </p>
            <p>
              © 2018 <a href='https://twitter.com/jamisnemo'>James Hagerman</a>
            </p>
            <Collapse isOpen={this.state.controlsAreOpen} className='debug'>
              <div className='debug'>
                Debug: <br />
                {JSON.stringify(this.state)}
              </div>
            </Collapse>
            
          </div>

        </div>
      </div>
    );
  }
}

const SortableItem = SortableElement((props) => {
  const {
    item: {
      itemUuid,
      itemName,
      itemChecked
    },
    handleCheck,
    checkedHidden
  } = props
  // console.warn('props', props)

  if (checkedHidden && !itemChecked) {
    return null
  }

  return (
    <li>
      <label className="pt-label .modifier">
        {itemName}
        <input
          type='checkbox'
          value={itemUuid}
          checked={itemChecked}
          onChange={handleCheck} />
        {/* <Checkbox label={value} className='pt-align-right pt-large' onClick={this.handleCheck}/> */}
      </label>
      
    </li>
  )
});

const SortableList = SortableContainer((props) => {
  const {
    items,
    disabled,
    itemChecked,
    handleCheck,
    checkedHidden
  } = props
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          item={item}
          disabled={disabled}
          handleCheck={handleCheck}
          checkedHidden={checkedHidden}/>
      ))}
    </ul>
  );
});

export default App;
