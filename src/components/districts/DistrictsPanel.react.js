import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';

import formatValue from '../identification/format';
import { Colors } from './styles';
import { cssColor } from '../map/styles';
import './DistrictsPanel.scss';


const graphOpts = {
  legend: {
    display: false
  },
  tooltips: {
    // enabled: false
    callbacks: {
      label: (item, data) => {
        return data.tooltipLabels[item.index];
      }
    }
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        callback: (value) => {
          return Intl.NumberFormat('cs-CZ', {style: 'decimal'}).format(value);
        }
      }
    }]
  }
};

class DistrictsPanel extends React.Component {

  render() {
    const { districts, dataset } = this.props;

    const attribs = dataset.attributes.filter(attr => attr.type === 'number');
    const ids = Array.from(districts.keys());
    const colors =  ids.map(id => cssColor(Colors[id]));
    const borders = ids.map(id => cssColor(Colors[id].slice(0, 3).concat(1)));
    const districtsArray = districts.toList().toJS();
    const dataArray = attribs.map(attr => {
      const values = districtsArray.map(properties => properties[attr.property]);
      const labels = districtsArray.map(properties => properties['Nazev']);
      return {
        labels: values.map(val => formatValue(val, attr)),
        tooltipLabels: labels,
        datasets: [{
          backgroundColor: colors,
          borderColor: borders,
          borderWidth: 1,
          data: values
        }]
      };
    });
    return (
      <div className="districts-panel">
        {attribs.map((field, index) => (
          <div key={index}>
            <h3>{field.label}</h3>
            <Bar height={80} data={dataArray[index]} options={graphOpts} />
          </div>
        ))}
      </div>
    );
  }
}

DistrictsPanel.propTypes = {
  districts: PropTypes.object,
  dataset: PropTypes.object
}

export default connect(state => ({
  districts: state.districts.districts,
  dataset: state.layers.datasets.get('kraje')
}), dispatch => bindActionCreators({
}, dispatch))(DistrictsPanel);
