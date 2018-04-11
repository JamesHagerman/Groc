import React, { Component } from 'react';
import logo from './logo.svg';
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import { Checkbox, Button, Collapse, Intent } from '@blueprintjs/core';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

import croc from './croc.png'
import './App.css';

const DragHandle = SortableHandle(() => <span>::</span>); // This can be any component you want

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      itemList: [],
      toAdd: '',
      sotableDisabled: true,
      helpIsOpen: true,
      controlsAreOpen: true
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
     })
  }

  handleShowControls() {
    this.setState({
      ...this.state,
      controlsAreOpen: !this.state.controlsAreOpen
    })
  }

  handleEnabledChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    console.log(this.state.sotableDisabled)
    this.setState({
      ...this.state,
      sotableDisabled: value
    })
  }

  handleItemEdit(event) {
    console.log(event.target.value)
    this.setState({
      ...this.state,
      toAdd: event.target.value
    })
  }

  handleNewItem() {
    const newValue = this.state.toAdd.trim()
    if (newValue === '') {
      return
    }
    const newItemList = [].concat(this.state.itemList, newValue)
    this.setState({
      ...this.state,
      toAdd: '',
      itemList: newItemList
    })
  }

  handleSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      ...this.state,
      itemList: arrayMove(this.state.itemList, oldIndex, newIndex),
    });
  };

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
              <img src={croc} className='large' />
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
            <Collapse isOpen={this.state.controlsAreOpen} className='controls'>
              <label className="pt-label .modifier">
                Disable Item Sorting:
                <input
                  name="isDraggable"
                  type="checkbox"
                  checked={this.state.sotableDisabled}
                  onChange={this.handleEnabledChange} />
                {/* <Checkbox label="Toggle Resortable" onChange={this.handleEnabledChange}/> */}
              </label>
            </Collapse>
            <div>
              
            </div>
          </div>
          <div className='groc-footer'>
            <p>
              Thanks for trying Groc! <img src={croc} className='tiny' /><br/> 
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
    {/* <DragHandle /> */}
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
