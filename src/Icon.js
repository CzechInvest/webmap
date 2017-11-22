import React, {PureComponent} from 'react';

export default class Icon extends PureComponent {
  render() {
    const {className, glyph, ...restProps} = this.props;

    return (
      <svg className={className} {...restProps}>
        <use xlinkHref={`#${glyph}`} />
      </svg>
    );
  }
}

Icon.defaultProps = {
  glyph: '',
  className: 'icon'
};


const svgIcons = require.context('../icons', false, /.*\.svg$/)

function requireAll (requireContext) {
  return requireContext.keys().map(requireContext)
}

requireAll(svgIcons)
