import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Category from './Category.react';
import './Category.scss';
import logo from '../../assets/img/logo_CI.svg';


class CategoriesMenu extends React.Component {

  render() {
    const { categories, activeId } = this.props;

    return (
      <div className="main-menu" style={{zIndex: activeId ? 100 : 80}}>
        <img className="logo" src={logo} alt="CzechInvest" />
        <div className="categories-menu">
          {categories.toList().map(c => <Category key={c.id} {...c.toJS()} />)}
        </div>
        <div className="flex-space" />
      </div>
    );
  }
}

export default connect(state => ({
  activeId: state.categories.activeId,
  categories: state.categories.categories
}), dispatch => bindActionCreators({
}, dispatch))(CategoriesMenu);
