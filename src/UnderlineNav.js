import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import sx from './sx'

const ITEM_CLASS = 'UnderlineNav-item'
const SELECTED_CLASS = 'selected'

function UnderlineNavBase({actions, className, align, children, full, label, theme, ...rest}) {
  const classes = classnames(className, 'UnderlineNav', align && `UnderlineNav--${align}`, full && 'UnderlineNav--full')
  return (
    <nav className={classes} aria-label={label} {...rest}>
      <div className="UnderlineNav-body">{children}</div>
      {actions && <div className="UnderlineNav-actions">{actions}</div>}
    </nav>
  )
}

const UnderlineNav = styled(UnderlineNavBase)`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eaecef;
  &.UnderlineNav--right {
    justify-content: flex-end;

    .UnderlineNav-item {
      margin-right: 0;
      margin-left: ${get('space.3')};
    }

    .UnderlineNav-actions {
      flex: 1 1 auto;
    }
  }
  &.UnderlineNav--full {
    display: block;
  }

  .UnderlineNav-body {
    display: flex;
    margin-bottom: -1px;
  }

  .UnderlineNav-actions {
    align-self: center;
  }

  ${COMMON};
  ${sx};
`

UnderlineNav.Link = styled.a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))`
  padding: ${get('space.3')} ${get('space.2')};
  margin-right: ${get('space.3')};
  font-size: ${get('fontSizes.1')};
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.gray.6')};
  text-align: center;
  border-bottom: 2px solid transparent;
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${get('colors.gray.9')};
    text-decoration: none;
    border-bottom-color: ${get('colors.gray.2')};
    transition: 0.2s ease;

    .UnderlineNav-octicon {
      color: ${get('colors.gray.5')};
    }
  }

  &.selected {
    color: ${get('colors.gray.9')};
    border-bottom-color: ${get('colors.accent')};

    .UnderlineNav-octicon {
      color: ${get('colors.gray.5')};
    }
  }

  ${COMMON};
  ${sx};
`

UnderlineNav.defaultProps = {
  theme
}

UnderlineNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...sx.propTypes
}

UnderlineNav.Link.defaultProps = {
  theme
}

UnderlineNav.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...COMMON.propTypes,
  ...sx.propTypes
}

UnderlineNav.Link.displayName = 'UnderlineNav.Link'

export default UnderlineNav
