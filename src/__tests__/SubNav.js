import React from 'react'
import {SubNav} from '..'
import {mount, render, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('SubNav', () => {
  behavesAsComponent(SubNav, [COMMON])

  checkExports('SubNav', {
    default: SubNav
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SubNav />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders a <nav>', () => {
    expect(render(<SubNav />).type).toEqual('nav')
  })

  it('adds the SubNav class', () => {
    expect(rendersClass(<SubNav />, 'SubNav')).toEqual(true)
  })

  it('sets aria-label to the "label" prop', () => {
    expect(render(<SubNav label="foo" />).props['aria-label']).toEqual('foo')
  })

  it('wraps its children in an "SubNav-body" div', () => {
    const children = <b>yo</b>
    const wrapper = mount(<SubNav>{children}</SubNav>)
    const body = wrapper.find('.SubNav-body')
    expect(body.exists()).toEqual(true)
    expect(body.childAt(0).type()).toEqual('b')
  })

  it('respects the "actions" prop', () => {
    const content = <h1>hi!</h1>
    const wrapper = mount(<SubNav actions={content} />)
    const actions = wrapper.find('.SubNav-actions')
    expect(actions.exists()).toEqual(true)
    expect(actions.text()).toEqual('hi!')
  })
})
