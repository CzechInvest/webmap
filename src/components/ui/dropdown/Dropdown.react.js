import React from 'react';
import classnames from 'classnames';
import Icon from '../../../Icon';
import './Dropdown.scss';


export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  select(index) {
    const { options, onChange } = this.props;
    onChange(options[index], index)
  }

  toggle() {
    this.setState({open: !this.state.open})
  }

  render() {
    const { options, selected } = this.props;
    const { open } = this.state
    return (
      <div className="dropdown" onClick={e => this.toggle()}>
        <span>{options[selected]}</span>
        <Icon glyph="arrow_down" />
        { open && <div className="backdrop"></div> }
        { open &&
          <div className="options">
            { options.map((item, i) =>
              <span
                key={i}
                className={ classnames({selected: selected === i}) }
                onClick={e => this.select(i)}
              >
                {item}
              </span>
            )}
          </div>
        }
      </div>
    );
  }
}
