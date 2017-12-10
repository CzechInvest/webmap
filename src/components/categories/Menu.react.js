import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Category from './Category.react';
import ScrollArea from 'react-scrollbar';
import './Category.scss';

import Backdrop from '../backdrop/Backdrop.react';
import DistrictsComparator from '../districts/DistrictsComparator.react';

class CategoriesMenu extends React.Component {

  render() {
    const categories = this.props.categories;
    const districtCategory = categories.get('socioeconomic');
    return (
      <ScrollArea
        horizontal={true}
        vertical={false}
        className="categories-menu"
      >
        {categories.toList().filter(c => c !== districtCategory).map(c => <Category key={c.id} {...c.toJS()} />)}
        <Category {...districtCategory.toJS()}>
          <Backdrop>
            <DistrictsComparator />
          </Backdrop>
        </Category>
      </ScrollArea>
    )
  }
}

export default connect(state => ({
  categories: state.categories.categories
}), dispatch => bindActionCreators({
}, dispatch))(CategoriesMenu);
