import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Category from './Category.react';
import './Category.scss';

import Backdrop from '../../Backdrop.react';
import DistrictsComparator from '../districts/DistrictsComparator.react';

class CategoriesMenu extends React.Component {

  render() {
    const categories = this.props.categories;
    const districtCategory = categories.get(6);
    return (
      <div className="categories-menu">
        {categories.toList().filter(c => c !== districtCategory).map(c => <Category key={c.id} {...c.toJS()} />)}
        <Category {...districtCategory.toJS()}>
          <Backdrop>
            <DistrictsComparator />
          </Backdrop>
        </Category>
      </div>
    )
  }
}

export default connect(state => ({
  categories: state.categories.categories
}), dispatch => bindActionCreators({
}, dispatch))(CategoriesMenu);