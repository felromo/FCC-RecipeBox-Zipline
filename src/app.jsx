import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import PubSub from 'pubsub-js';
require('bootstrap-webpack');
require('./styles.scss');
require('font-awesome-webpack');

var colors = ['Click me for more Info'];
var placeholder = document.createElement('li');
placeholder.className = 'placeholder';
/* localStorage.setItem('stored-recipes', JSON.stringify(names)); */


class App extends React.Component {
  constructor(props) {
    super(props);
    if(localStorage) {
      // use the local storage to set the state
      if (localStorage.getItem('temporary2')) {
        // set the state here
        this.state = {
          colors: JSON.parse(localStorage.getItem('temporary2')),
          view: {showModal: false} 
        };
        console.log('this is what was in memory');
        console.log(localStorage.getItem('temporary2'));
      } else {
        // there isnt anything stored there yet and we need to use a default value
        console.log('there was nothing in memory');
        this.state = {
          colors: colors,
          view: {showModal: false} 
        };
      }
    } else {
      // you cant use local storage not available
    }
  }
  handleHideModal = () => {
    this.setState({
      view: {
        showModal: false
      }
    });
  }
  handleShowModal = (title, items, index) => {
    this.setState({
      view: {
        showModal: true
      },
      title: title,
      items: items,
      index: index
    });
  }
  addItemToList = () => {
    console.log(colors);
    var tmp = this.state.colors;
    tmp.push('New Item');
    this.setState({
      colors: tmp
    });
    localStorage.setItem('temporary2', JSON.stringify(tmp));
    console.log(colors);
  }
  removeItemFromList = (id) => {
    console.log('I will remove ' +  this.state.colors[id] );
    var tmp = this.state.colors;
    tmp.splice(id, 1);
    this.setState({
      colors: tmp
    });
    localStorage.setItem('temporary2', JSON.stringify(tmp));
  }
  saveForwarder = (items) => {
    // in here set some state that will be passed down to list
    console.log('we will be saving: ');
    console.log(items);
  }
  render() {
    return (
      <div className="list-container">
        <div className="list-title">Recipe Box</div>
        <List data={this.state.colors} removeItem={this.removeItemFromList} modalHandler={this.handleShowModal}/>
        <div className="list-footer" onClick={this.addItemToList}>
          <i className="add-button fa fa-plus-square"></i>
        </div>
        <div className="row">
          {this.state.view.showModal ? <Modal handleHideModal={this.handleHideModal} title={this.state.title} items={this.state.items} index={this.state.index} saveForwarder={this.saveForwarder}/> : null}
        </div>
      </div>
    );
  }
}

class List extends React.Component{
  constructor(props) {
    super(props);
    this.state = {data: this.props.data};
    var token = PubSub.subscribe('MyTopic', function (msg, data) {
      // data will be some kind of object with the list and the index of the li
      console.log('all the way from downtown');
      console.log(data);
      var tmp = this.state.data;
      tmp[data.index] = data.title;
      this.setState({
        data: tmp
      });
      $('#content-' + data.index).text(data.items);
    }.bind(this));
  }
  dragStart = (e) => {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';

    e.dataTransfer.setData('text/html', e.currentTarget);
  }
  dragEnd = () => {
    this.dragged.style.display = 'block';
    /* console.log('--->' + this.dragged.parentNode); */
    /* console.log('--->' + this.dragged.parentNode.parentNode.children); */
    /* console.log('--->' + $('.placeholder')); */
    /* this.dragged.parentNode.removeChild(placeholder); */
    $('.placeholder').remove();

    var data = this.state.data;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if(this.nodePlacement == 'after') to--;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({data: data});
  }
  dragOver = (e) => {
    e.preventDefault();
    this.dragged.style.display = 'none';
    if(e.target.className == 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
    var relY = e.clientY - this.over.offsetTop;
    var height = this.over.offsetHeight / 2;
    var parent = e.target.parentNode;

    if(relY > height) {
      this.nodePlacement = 'after';
      parent.insertBefore(placeholder, e.target.nextElementSibling);
    } else if (relY < height) {
      this.nodePlacement = 'before';
      parent.insertBefore(placeholder, e.target);
    }
  }
  removeItemHandler = (e) => {
    console.log(e.target.parentElement.id);
    this.props.removeItem(e.target.parentElement.id);
  }
  onClickHandler = (e) => {
    // handle the clicks
    console.log('reveal information');
    /* $('.content-section').removeClass('content-section-open'); */
    console.log($(e.target).siblings());
    if($($(e.target).siblings()[0]).is('div')) {
      $('.content-section').removeClass('content-section-open');
      $($(e.target).siblings()[0]).addClass('content-section-open');
    }
    else if ($($(e.target).siblings()[0]).is('span')){
      $('.content-section').removeClass('content-section-open');
      $($($(e.target).parent()).siblings()[0]).addClass('content-section-open');
    } else {
      console.log('legit do nothing');
    }
  }
  onClickModalHandler = (e) => {

    console.log($($(e.target).closest('li')).attr('id'));
    var title = $(e.target).closest('li').text();
    var listOfItems = $($(e.target).closest('li').siblings()[0]).text();
    var index = $($(e.target).closest('li')).attr('id');
    this.props.modalHandler(title, listOfItems, index);
  }
  render() {
    return (
      <ul onDragOver={this.dragOver}>
        {this.state.data.map(function(item, i) {
           return (
                  <div key={i}>
                    <li
                      data-id={i}
                      id={i}
                      key={i}
                      draggable="true"
                      onDragEnd={this.dragEnd}
                      onDragStart={this.dragStart}
                      onClick={this.onClickHandler}
                      className="accordion-section"
                    >
                      {item}<span className="edit-buttons pull-right" id={i}><button type="button" id={i} className="btn btn-success edit-list-item" onClick={this.onClickModalHandler}><i className="fa fa-pencil"></i></button><button type="button" id={i} className="btn btn-danger pull-right delete-list-item" onClick={this.removeItemHandler}><i className="fa fa-trash"></i></button></span>
                    </li>
                    <div className="content-section" id={'content-' + i}>This is some content</div>
                  </div>);
         }, this)
        }
      </ul>
    );
  }
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      recipeItems: this.props.items
    };
  }
  componentDidMount = () => {
    $(ReactDom.findDOMNode(this)).modal('show');
    $(ReactDom.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
  }
  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value
    });
  }
  handleContentChange = (e) => {
    this.setState({
      recipeItems: e.target.value
    });
  }
  saveHandler = () => {
    // here is where we will pass the new edits up to be displayed on the list
    var tmp = this.state.recipeItems;
    var title = this.state.title;
    var index = this.props.index;
    /* this.props.saveForwarder(tmp); */
    var data = {
      title: title,
      items: tmp,
      index: index
    };
    PubSub.publish('MyTopic', data);
  }
  render() {
    return (
      <div className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              {/* <h4 className="modal-title">{this.state.title}</h4> */}
              <h4 className="modal-title"><input value={this.state.title} onChange={this.handleTitleChange}/></h4>
            </div>
            <div className="modal-body">
              <input value={this.state.recipeItems} onChange={this.handleContentChange}/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.saveHandler}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
