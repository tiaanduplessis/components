import React from 'react'
import {Heading} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {TYPOGRAPHY, COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const theme = {
  breakpoints: ['400px', '640px', '960px', '1280px'],
  colors: {
    green: ['#010', '#020', '#030', '#040', '#050', '#060']
  },
  fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px'],
  fonts: {
    normal: 'Helvetica,sans-serif',
    mono: 'Consolas,monospace'
  },
  lineHeights: {
    normal: 1.5,
    condensed: 1.25,
    condensedUltra: 1
  },
  fontWeights: {
    light: '300',
    normal: '400',
    semibold: '500',
    bold: '600'
  }
}

describe('Heading', () => {
  behavesAsComponent(Heading, [COMMON, TYPOGRAPHY])

  checkExports('Heading', {
    default: Heading
  })

  it('renders <h2> by default', () => {
    expect(render(<Heading />).type).toEqual('h2')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Heading>Hello</Heading>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects fontWeight', () => {
    expect(render(<Heading fontWeight="bold" theme={theme} />)).toHaveStyleRule('font-weight', theme.fontWeights.bold)
    expect(render(<Heading fontWeight="normal" theme={theme} />)).toHaveStyleRule(
      'font-weight',
      theme.fontWeights.normal
    )
    expect(render(<Heading fontWeight="semibold" theme={theme} />)).toHaveStyleRule(
      'font-weight',
      theme.fontWeights.semibold
    )
    expect(render(<Heading fontWeight="light" theme={theme} />)).toHaveStyleRule('font-weight', theme.fontWeights.light)
  })

  it('respects lineHeight', () => {
    expect(render(<Heading lineHeight="normal" theme={theme} />)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.normal)
    )
    expect(render(<Heading lineHeight="condensed" theme={theme} />)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.condensed)
    )
    expect(render(<Heading lineHeight="condensedUltra" theme={theme} />)).toHaveStyleRule(
      'line-height',
      String(theme.lineHeights.condensedUltra)
    )
  })

  it('respects fontFamily="mono"', () => {
    expect(render(<Heading fontFamily="mono" theme={theme} />)).toHaveStyleRule('font-family', theme.fonts.mono)
  })

  it.skip('respects nowrap', () => {
    expect(render(<Heading nowrap theme={theme} />)).toEqual(render(<span className="no-wrap" />))
  })

  it('renders fontSize', () => {
    for (const fontSize of theme.fontSizes) {
      expect(render(<Heading fontSize={fontSize} theme={theme} />)).toHaveStyleRule('font-size', `${fontSize}`)
    }
  })

  it('respects the "fontStyle" prop', () => {
    expect(render(<Heading fontStyle="italic" />)).toHaveStyleRule('font-style', 'italic')
  })

  it.skip('renders fontSize with f* classes using inverse scale', () => {
    expect(render(<Heading fontSize={0} theme={theme} />)).toEqual(render(<span className="f6" />))
    expect(render(<Heading fontSize={1} theme={theme} />)).toEqual(render(<span className="f5" />))
    expect(render(<Heading fontSize={2} theme={theme} />)).toEqual(render(<span className="f4" />))
    expect(render(<Heading fontSize={3} theme={theme} />)).toEqual(render(<span className="f3" />))
    expect(render(<Heading fontSize={4} theme={theme} />)).toEqual(render(<span className="f2" />))
    expect(render(<Heading fontSize={5} theme={theme} />)).toEqual(render(<span className="f1" />))
    expect(render(<Heading fontSize={6} theme={theme} />)).toEqual(render(<span className="f0" />))
  })

  it.skip('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<Heading />)
    expect(render(<Heading bugs="bar" />)).toEqual(defaultOutput)
    expect(render(<Heading hidden />)).toEqual(defaultOutput)
  })

  it.skip('respects other values for fontSize', () => {
    expect(render(<Heading fontSize="2em" theme={theme} />)).toHaveStyleRule('font-size', '2em')
    expect(render(<Heading fontSize={100} theme={theme} />)).toHaveStyleRule('font-size', '100px')
  })
})
