import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import classnames from 'classnames'
import {COMMON, get} from './constants'
import theme from './theme'
import Link from './Link'
import BorderBox from './BorderBox'
import sx from './sx'

function SideNavBase({variant, className, bordered, children, ...props}) {
  const variantClassName = variant === 'lightweight' ? 'lightweight' : 'normal'
  const newClassName = classnames(className, `variant-${variantClassName}`)

  if (!bordered) {
    props = {...props, borderWidth: 0}
  }

  return (
    <BorderBox as="nav" className={newClassName} {...props}>
      {children}
    </BorderBox>
  )
}

const SideNav = styled(SideNavBase)`
  background-color: ${get('colors.white')};

  ${props =>
    props.bordered &&
    css`
      // Remove duplicate borders from nested SideNavs
      & > & {
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    `}

  ${COMMON};
  ${sx};
`

SideNav.Link = styled(Link).attrs(props => {
  const isReactRouter = typeof props.to === 'string'
  if (isReactRouter || props.selected) {
    // according to their docs, NavLink supports aria-current:
    // https://reacttraining.com/react-router/web/api/NavLink/aria-current-string
    return {'aria-current': 'page'}
  } else {
    return {}
  }
})`
  position: relative;
  display: block;
  ${props =>
    props.variant === 'full' &&
    css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `}
  width: 100%;
  text-align: left;
  font-size: ${get('fontSizes.1')};

  & > ${SideNav} {
    border-bottom: none;
  }

  &:first-child {
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
  }

  &:last-child {
    border-bottom-right-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
  }

  ${SideNav}.variant-normal > & {
    color: ${get('colors.gray.6')};
    padding: ${get('space.3')};
    border: 0;
    border-top: ${get('borderWidths.1')} solid ${get('colors.gray.2')};

    &:first-child {
      border-top: 0;
    }

    // Bar on the left
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 3px;
      pointer-events: none;
      content: '';
    }

    &:hover,
    &:focus {
      color: ${get('colors.gray.9')};
      text-decoration: none;
      background-color: ${get('colors.gray.1')};
      outline: none;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      font-weight: ${get('fontWeights.semibold')};
      color: ${get('colors.gray.9')};

      // Bar on the left
      &::before {
        background-color: ${get('colors.accent')};
      }
    }
  }

  ${SideNav}.variant-lightweight > & {
    padding: ${get('space.1')} 0;
    color: ${get('colors.blue.5')};

    &:hover,
    &:focus {
      color: ${get('colors.gray.9')};
      text-decoration: none;
      outline: none;
    }

    &[aria-current='page'],
    &[aria-selected='true'] {
      color: ${get('colors.gray.9')};
      font-weight: ${get('fontWeights.semibold')};
    }
  }

  ${sx};
`

SideNav.defaultProps = {
  theme,
  variant: 'normal'
}

SideNav.propTypes = {
  as: PropTypes.elementType,
  bordered: PropTypes.bool,
  children: PropTypes.node,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['normal', 'lightweight']),
  ...BorderBox.propTypes
}

SideNav.Link.defaultProps = {
  theme,
  variant: 'normal'
}

SideNav.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool,
  theme: PropTypes.object,
  variant: PropTypes.oneOf(['normal', 'full']),
  ...Link.propTypes
}

SideNav.Link.displayName = 'SideNav.Link'

export default SideNav
