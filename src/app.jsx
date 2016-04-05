import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
require('bootstrap-webpack');
require('./styles.scss');
require('font-awesome-webpack');

var colors = ['Click me for more Info!'];
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
    /* this.state = {
       colors: colors
       }; */
    // no matter what we still need to set a state for the modal
    /* this.state = { view: {showModal: false} }; */
  }
  handleHideModal = () => {
    this.setState({
      view: {
        showModal: false
      }
    });
  }
  handleShowModal = () => {
    this.setState({
      view: {
        showModal: true
      }
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
  render() {
    return (
      <div className="list-container">
        <div className="list-title">Recipe Box</div>
        <List data={this.state.colors} removeItem={this.removeItemFromList} modalHandler={this.handleShowModal}/>
        <div className="list-footer" onClick={this.addItemToList}>
          <i className="add-button fa fa-plus-square"></i>
        </div>
        <div className="row">
          {this.state.view.showModal ? <Modal handleHideModal={this.handleHideModal}/> : null}
        </div>
      </div>
    );
  }
}


class List extends React.Component{
  constructor(props) {
    super(props);
    this.state = {data: this.props.data};
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
    console.log('reveal information')
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
  render() {
    return (
      <ul onDragOver={this.dragOver}>
        {this.state.data.map(function(item, i) {
           return (
                  <div key={i}>
                    <li
                      data-id={i}
                      key={i}
                      draggable="true"
                      onDragEnd={this.dragEnd}
                      onDragStart={this.dragStart}
                      onClick={this.onClickHandler}
                      className="accordion-section"
                    >
                      {item}<span className="edit-buttons pull-right" id={i}><button type="button" id={i} className="btn btn-success edit-list-item" onClick={this.props.modalHandler}><i className="fa fa-pencil"></i></button><button type="button" id={i} className="btn btn-danger pull-right delete-list-item" onClick={this.removeItemHandler}><i className="fa fa-trash"></i></button></span>
                    </li>
                    <div className="content-section">This is some content</div>
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
  }
  componentDidMount = () => {
    /* $(this.getDOMNode()).modal('show'); */
    $(ReactDom.findDOMNode(this)).modal('show');
    $(ReactDom.findDOMNode(this)).on('hidden.bs.modal', this.props.handleHideModal);
    /* $(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal); */
  }
  render() {
    return (
      <div className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Modal title</h4>
            </div>
            <div className="modal-body">
              <p>One fine body&hellip;</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
