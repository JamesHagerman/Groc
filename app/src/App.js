import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import { Checkbox, Button, Intent, Spinner, DatePickerFactory } from '@blueprintjs/core';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sortableEnabled: false
    }

    // this.handleEnabledChange = this.handleEnabledChange.bind(this)
  }

  handleEnabledChange() {
    console.log(this.state.sortableEnabled)
    this.setState({
      ...this.state,
      sortableEnabled: !this.sortableEnabled
    })
  }
  render() {
    return (
      <div className="App" className='pt-app pt-dark'>
        <div>
          <Button intent={Intent.SUCCESS}>
            Just some button
          </Button>
          <Checkbox label="Toggle Resortable" onChange={this.handleEnabledChange}/>
          derp: '{this.state.sortableEnabled ? 'true' : 'false' }'

          Items to buy:
          <SortableComponent sortableEnabled={this.state.sortableEnabled} />
        </div>
      </div>
    );
  }
}

const SortableItem = SortableElement(({value}) =>
  <li>
    deeeeeerp: {value}
    <Checkbox label="Need?"/>
  </li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} value={item.value} disabled={item.sortableEnabled}/>
      ))}
    </ul>
  );
});

class SortableComponent extends Component {
  state = {
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  render() {
    const items = this.state.items.map((value, index) => {
      return {
        value,
        sortableEnabled: this.props.sortableEnabled
      }
    })
    return <SortableList items={items} onSortEnd={this.onSortEnd}/>;
  } // lockAxis='y'
}

export default App;
