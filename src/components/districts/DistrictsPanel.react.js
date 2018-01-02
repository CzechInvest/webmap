import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { Scrollbars } from 'react-custom-scrollbars';

import messages from '../lang/messages/attributes';
import formatValue from '../identification/format';
import { getColor } from './styles';
import { cssColor } from '../map/styles';
import './DistrictsPanel.scss';


const graphOpts = {
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  plugins: {
    datalabels: {
      color: '#222',
      font: {
        family: 'Soleil',
        weight: 500,
        size: 12
      },
      formatter (value, chart) {
        return chart.dataset.label[chart.dataIndex];
      },
      align: 'end',
      anchor: 'end',
      offset: -4
    }
  },
  scales: {
    xAxes: [{
      barPercentage: 0.45
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        callback: (value) => {
          return Intl.NumberFormat('cs-CZ', {style: 'decimal'}).format(value);
        }
      }
    }]
  },
  responsive: true,
  layout: {
    padding: {
      top: 12
    }
  }
};

const GraphLegend = ({labels, colors}) => {
  return (
    <div className="legend">
      {labels.map((label, index) => (
        <label key={index} style={{color: colors[index]}}>
          {label}
        </label>
      ))}
    </div>
  );
};

class DistrictsPanel extends React.Component {

  render() {
    const { districts, dataset, lang } = this.props;

    const attribs = dataset.attributes.filter(attr => attr.type === 'number');
    const ids = Array.from(districts.keys());
    const colors =  ids.map(id => cssColor(getColor(id, 0.75)));
    const borders = ids.map(id => cssColor(getColor(id, 1)));
    const districtsArray = districts.toList().toJS();
    const dataArray = attribs.map(attr => {
      const values = districtsArray.map(properties => properties[attr.property]);
      const labels = districtsArray.map(properties => properties['Nazev']);
      const formattedValues = values.map(val => formatValue(val, attr));
      return {
        labels: values.map(val => ''),
        legendLabels: labels,
        tooltipLabels: labels,
        datasets: [{
          label: formattedValues,
          backgroundColor: colors,
          borderColor: borders,
          borderWidth: 1,
          data: values
        }]
      };
    });
    return (
      <div className="districts-panel">
        <Scrollbars className="scroll-area">
          <div className="content">
          {attribs.map((field, index) => (
            <div key={index}>
              <h3>{messages[field.property][lang]}</h3>
              <Bar height={80} data={dataArray[index]} options={graphOpts} />
              <GraphLegend labels={dataArray[index].legendLabels} colors={borders} />
            </div>
          ))}
          </div>
        </Scrollbars>
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
  dataset: state.layers.datasets.get('kraje'),
  lang: state.lang.selectedLanguage
}), dispatch => bindActionCreators({
}, dispatch))(DistrictsPanel);
