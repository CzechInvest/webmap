import React from 'react';
import ReactDOM from 'react-dom'
import './Backdrop.scss';


export default class Backdrop extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  onClick(evt) {
    this.props.onClose(evt);
    evt.stopPropagation();
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      <div>
        {this.props.onClose && <div className="backdrop" onClick={evt => this.onClick(evt)}></div>}
        {this.props.children}
      </div>,
      this.el,
    );
  }
}
