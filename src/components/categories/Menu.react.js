import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Category from './Category.react';
import './Category.scss';
import { CSSTransition } from 'react-transition-group';

import Backdrop from '../backdrop/Backdrop.react';
import DistrictsComparator from '../districts/DistrictsComparator.react';
import logo from '../../assets/img/logo_CI.svg';


class CategoriesMenu extends React.Component {

  render() {
    const categories = this.props.categories;
    const districtCategory = categories.get('socioeconomic');
    return (
      <div className="main-menu" style={{zIndex: this.props.activeId ? 100 : 80}}>
        <img className="logo" src={logo} alt="CzechInvest" />
        <div className="categories-menu">
          {categories.toList().filter(c => c !== districtCategory).map(c => <Category key={c.id} {...c.toJS()} />)}
          <Category {...districtCategory.toJS()}>
            <CSSTransition classNames="slide-left" timeout={{ enter: 300, exit: 300 }}>
              <Backdrop>
                <DistrictsComparator />
              </Backdrop>
            </CSSTransition>
          </Category>
        </div>
        <div className="flex-space" />
      </div>
    )
  }
}

export default connect(state => ({
  activeId: state.categories.activeId,
  categories: state.categories.categories
}), dispatch => bindActionCreators({
}, dispatch))(CategoriesMenu);
