import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Category from './Category.react';
import './Category.scss';


class CategoriesMenu extends React.Component {

  render() {
    return (
      <div className="categories-menu">
        {this.props.categories.toList().map(c => <Category key={c.id} {...c.toJS()} />)}
      </div>
    )
  }
}

export default connect(state => ({
  categories: state.categories.categories
}), dispatch => bindActionCreators({
}, dispatch))(CategoriesMenu);