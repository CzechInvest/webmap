import React from 'react';
import classnames from 'classnames';
import './Popup.scss';


const Field = ({index, label, value, html}) => {
  const classes = classnames('list-item', {even: index % 2 === 0});
  return (
    <div className={classes}>
      { label && <label>{label}:</label> }
      {html ? <p dangerouslySetInnerHTML={{__html: value}}></p> : <p>{value}</p>}
    </div>
  );
};

/* onClick events is not working due to https://github.com/openlayers/openlayers/issues/6948 */
const Popup = ({ title, fields, onClose }) => {
  return (
    <div>
      <h3>{title}</h3>
      <button
        onMouseUp={ () => onClose() }
        className="close-btn">
      </button>
      <div className="list">
        { fields.map((field, i) => <Field key={i} index={i} {...field} />) }
      </div>
    </div>
  )
};

export default Popup;
