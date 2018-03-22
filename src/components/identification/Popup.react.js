import React from 'react';
import classnames from 'classnames';
import Icon from '../../Icon';
import Dropdown from '../ui/dropdown/Dropdown.react'
import './Popup.scss';


const Field = ({index, label, value, html}) => {
  const classes = classnames('list-item', {even: index % 2 === 0});
  return (
    <div className={classes}>
      { label && <label>{label}:</label> }
      {html ? <p dangerouslySetInnerHTML={{__html: value}}></p> : <p>{''+value}</p>}
    </div>
  );
};

/* onClick events is not working due to https://github.com/openlayers/openlayers/issues/6948 */
const convertToClick = (e) => {
  const evt = new MouseEvent('click', { bubbles: true })
  evt.stopPropagation = () => {}
  e.target.dispatchEvent(evt)
}

export const Popup = ({ title, fields, onClose, className = '' }) => {
  return (
    <div className={className} onMouseUp={convertToClick}>
      <h3>{title}</h3>
      <button
        onClick={ () => onClose() }
        className="close-btn">
      </button>
      <div className="list">
        { fields.map((field, i) => <Field key={i} index={i} {...field} />) }
      </div>
    </div>
  )
};

export class GroupedInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      group: 0
    };
  }

  setGroup(group) {
    this.setState({group: parseInt(group, 10)});
  }

  render() {
    const { title, fields, groups, onClose, className = '' } = this.props;
    const groupsList = Object.keys(groups);
    const groupIndex = this.state.group;
    const groupAttribs = Object.values(groups)[groupIndex]
    const visibleFields = fields.filter(f => groupAttribs.includes(f.id))

    return (
      <div className={className} onMouseUp={convertToClick}>
        <h3>{title}</h3>
        <button
          onClick={ () => onClose() }
          className="close-btn">
        </button>
        <div className="groups">
          <button
            className="left"
            disabled={groupIndex < 1}
            onClick={e => this.setGroup(groupIndex - 1)}>
            <Icon glyph="arrow-left" />
          </button>
          <Dropdown
            options={groupsList}
            selected={groupIndex}
            onChange={(v, i) => this.setGroup(i)} />
          <button
            className="right"
            disabled={groupIndex === groupsList.length - 1}
            onClick={e => this.setGroup(groupIndex + 1)}>
            <Icon glyph="arrow-right" />
          </button>
        </div>
        <div className="list">
          { visibleFields.map((field, i) => <Field key={i} index={i} {...field} />) }
        </div>
      </div>
    );
  }
}
