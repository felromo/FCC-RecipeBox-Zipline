import React from 'react';
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
          colors: JSON.parse(localStorage.getItem('temporary2'))
        };
        console.log('this is what was in memory');
        console.log(localStorage.getItem('temporary2'));
      } else {
        // there isnt anything stored there yet and we need to use a default value
        console.log('there was nothing in memory');
        this.state = {
          colors: colors
        };
      }
    } else {
      // you cant use local storage not available
    }
    /* this.state = {
       colors: colors
       }; */
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
        <List data={this.state.colors} removeItem={this.removeItemFromList}/>
        <div className="list-footer" onClick={this.addItemToList}>
          <i className="add-button fa fa-plus-square"></i>
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
    /* console.log($(e.target).text()); */
    $('.content-section').removeClass('content-section-open');
    /* $('li').removeClass('li-no-border'); */
    console.log($(e.target).siblings());
    if($($(e.target).siblings()[0]).is('div')) {
      /* $($(e.target).addClass('li-no-border')); */
        $($(e.target).siblings()[0]).addClass('content-section-open');
    }
        else
      /* $($(e.target).siblings()[0]).addClass('content-section-open'); */
      $($($(e.target).parent()).siblings()[0]).addClass('content-section-open');
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
                      {item}<span className="edit-buttons pull-right" id={i}><button type="button" id={i} className="btn btn-success edit-list-item"><i className="fa fa-pencil"></i></button><button type="button" id={i} className="btn btn-danger pull-right delete-list-item" onClick={this.removeItemHandler}><i className="fa fa-trash"></i></button></span>
                    </li>
                    <div className="content-section">This is some content</div>
                  </div>);
         }, this)
        }
      </ul>
    );
  }
}


export default App;
