# Contribution guidelines

1. [Roadmap](#roadmap)
2. [Before Getting Started](#before-getting-started)
2. [Developing Components](#developing-components)
    * [Tools we use](#tools-we-use)
    * [Component patterns](#component-patterns)
    * [Adding default theme](#adding-default-theme)
    * [Adding system props](#adding-system-props)
    * [Adding the sx prop](#adding-the-sx-prop)
    * [Linting](#linting)
    * [Testing](#testing)
    * [TypeScript support](#typescript-support)
    * [Additional resources](#additional-resources)
3. [Writing documentation](#writing-documentation)
4. [Creating a pull request](#creating-a-pull-request)
    * [What to expect after opening a pull request](#what-to-expect-after-opening-a-pull-request)
    * [What we look for in reviews](#what-we-look-for-in-reviews)
5. [Deploying & publishing](#deploying-and-publishing)
    * [Deploying](#deploying)
    * [Path aliasing](#path-aliasing)
    * [Publishing](#publishing)
6. [Troubleshooting](#troubleshooting)
7. [Glossary](#glossary)
    * [System Props](#system-props)

## Roadmap

If you're looking for something to work on, a great place to start is our issues labeled [up for grabs](https://github.com/primer/components/issues?q=is%3Aopen+is%3Aissue+label%3A%22up+for+grabs%22)! If you've got a feature that you'd like to implement, be sure to check out our [Primer Components Roadmap](https://github.com/primer/components/projects/3) to make sure it hasn't already been started on.

## Before Getting Started

A common question asked about Primer Components is how to know what should be added to Primer Components and what is best left as a local component in a consuming applcation. Though there are no hard & fast rules about what can and cannot be added to Primer Components, here are a few things we take into consideration:

- Is the new feature an existing pattern in Primer CSS or related to UI built at GitHub? Primer Components is first and foremost a library for building UI at GitHub - patterns that aren't currently being used in GitHub UI (either on github.com or in a GitHub owned project outside of github.com) probably shouldn't be added to Primer Components. Exceptions to this could be helper components that don't necessarily render UI but help with the development process (like `Flex`, `Grid`, or `Box`).

- Does the proposed component get used in more than one or two places across GitHub UI? A component that's only meant to be used in one place and doesn't have potential to be reused in many places probably should exist as a local component. An example of something like this might be a component that renders content specific to a single GitHub product.

**In general, we tend to be pretty excited about 99% of feature proposals and contributions,** but if you'd like to double check before starting work, feel free to leave open an issue in our repo!


## Developing components

We primarily use our documentation site as a workspace to develop new components or make changes to existing components (stay tuned for a better development environment coming soon!).

To get the documentation site running locally run the following in your terminal:

```sh
yarn start
```

Navigate to http://localhost:8000/ to see the site in your browser ✨

### Tools we use

1. We use [styled-components](https://www.styled-components.com/) to style our components.
2. We use style functions from [styled-system](https://styled-system.com/) whenever possible, and styled-systems' `style()` function to create new ones.

### Component patterns

With a couple of exceptions, all components should be created with the `styled` function from [styled-components] and should have the appropriate groups of system props attached.

Default values for system props can be set in `Component.defaultProps`.

Prop Types from system props such as `COMMON` or `TYPOGRAPHY` as well as styled-system functions can be spread in the component's prop types declaration (see example below). These need to go *after* any built-in styles that you want to be overridable.

 ⚠️ **Make sure to always set the default `theme` prop to our [theme](https://github.com/primer/components/blob/master/src/theme-preval.js)! This allows consumers of our components to access our theme values without a ThemeProvider.**

Additionally, every component should support [the `sx` prop](https://primer.style/components/overriding-styles); remember to add `${sx}` to the style literal and `...sx.propTypes` to the component's `propTypes`.

Here's an example of a basic component written in the style of Primer Components:

```jsx
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'
import sx from './sx

const Component = styled.div`
  // additional styles here

  ${COMMON};
  ${TYPOGRAPHY};
  ${sx};
`

Component.defaultProps = {
  theme, // make sure to always set the default theme!
  m: 0,
  fontSize: 5,
}

Component.propTypes = {
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes,
  ...sx.propTypes
}

export default Component
```

### Adding default theme

Each component needs access to our default Primer Theme, so that users of the component can access theme values easily in their consuming applications.

To add the default theme to a component, import the theme and assign it to the component's defaultProps object:

```jsx
import theme from './theme'

Component.defaultProps = {
  theme, // make sure to always set the default theme!
}

```

### Adding system props

Each component should have access to the appropriate system props. Every component has access to `COMMON`. For **most** components added, you'll only need to give the component to `COMMON`. If you are unsure, ping a DS team member on your PR.

Categories of system props are exported from `src/constants.js`:

* `COMMON` includes color and spacing (margin and padding) props
* `TYPOGRAPHY` includes font family, font weight, and line-height props
* `POSITION` includes positioning props
* `FLEX` includes flexbox props
* `BORDER` includes border and box-shadow props
* `GRID` includes grid props

To give the component access to a group of system props, import the system prop function from `./constants` and include the system prop function in your styled-component like so:

```jsx
import {COMMON} from './constants'

const Component = styled.div`
  // additional styles here
  ${COMMON};
`

// don't forget to also add it to your prop type declaration!

Component.propTypes = {
   ...COMMON.propTypes
}
```

Remember that the system prop function inside your style declaration needs to go *after* any built-in styles you want to be overridable.

### Adding the `sx` prop

Each component should provide access to a prop called `sx` that allows for setting theme-aware ad-hoc styles. See the [overriding styles](https://primer.style/components/overriding-styles) doc for more information on using the prop.

Adding the `sx` prop is similar to adding system props; import the default export from the `sx` module, add it to your style definition, and add the appropriate prop types. **The `sx` prop should go at the *very end* of your style definition.**

```jsx
import {COMMON} from './constants'
import sx from './sx'

const Component = styled.div`
  // additional styles here
  ${COMMON};
  ${sx};
`

// don't forget to also add it to your prop type declaration!

Component.propTypes = {
   ...COMMON.propTypes,
   ...sx.propTypes
}
```

### Linting

We use the [React configuration](https://github.com/github/eslint-plugin-github/blob/master/lib/configs/react.js) from [GitHub's eslint plugin](https://github.com/github/eslint-plugin-github) to lint our JavaScript. To check your work before pushing, run:

```sh
yarn run lint
```

Or, you can use [npx] to run eslint on one or more specific files:

```sh
# lint the component and the tests in src/__tests__
npx eslint src/**/MyComponent.js
```

**Protip:** The [eslint `--fix` flag](https://eslint.org/docs/user-guide/command-line-interface#--fix) can automatically fix most linting errors, such as those involving whitespace or incorrect ordering of object keys and imports. You can fix those issues across the entire project with:

```sh
yarn run lint -- --fix
```

**Protip:** `yarn run lint -- --quiet` (or `npx eslint --quiet ...`) will suppress warnings so that you can focus on fixing errors.

### Testing

We test our components with [Jest](https://facebook.github.io/jest/) and [react-test-renderer](https://reactjs.org/docs/test-renderer.html). You can run the tests locally with `yarn test`. To run the tests as you work, run Jest in watch mode with:

```sh
yarn test -- --watch
```

See [`src/__tests__/example.js`](src/__tests__/example.js) for examples of ways that we test our components.

### TypeScript support

Several of the projects that consume Primer Components are written in TypeScript. Though Primer Components is not currently written in TS, we do export type definitions in order to make Primer Components compatible with other TS projects.

Whenever adding new components or modifying the props of an existing component, **please make sure to update the type definition** in `index.d.ts`! This is super important to make sure we don't break compatibility :)

### Additional resources

* [Primer Components Philosophy](https://primer.style/components/philosophy)
* [Primer Components Core Concepts](https://primer.style/components/core-concepts)
* [Primer Components System Props](https://primer.style/components/system-props)
* [Styled Components docs](https://styled-components.com/)
* [Styled System docs](https://styled-system.com/)

## Writing documentation

We use [Doctocat](https://github.com/primer/doctocat) to power our documentation site at [https://primer.style/components](https://primer.style/components/).

To add a new component to our documentation site, create a new file with the `.md` extension for your component in `docs/content` (e.g. `docs/content/Button.md`).

## Creating a pull request

When creating a new pull request, please follow the guidelines in the auto-populated pull request template. Be sure to add screenshots of any relevant work and a thoughtful description.

### What to expect after opening a pull request

After opening a pull request, a member of the design systems team will add the appropriate labels (major, minor, patch release labels) and update the base branch to the correct release branch. Usually, you'll receive a response from the design systems team within a day or two. The design systems team member will review the pull request keeping the following items in mind:

### What we look for in reviews

* If it's a new component, does the component make sense to add to Primer Components? (Ideally this is discussed before the pull request stage, please reach out to a DS member if you aren't sure if a component should be added to Primer Components!)
* Does the component follow our [Primer Components code style](#component-patterns)?
* Does the component use theme values for most CSS values?
* Does the component have access to the [default theme](#adding-default-theme)?
* Does the component have the [correct system props implemented](#adding-system-props)?
* Is the component API intuitive?
* Does the component have the appropriate [type definitions in `index.d.ts`](#typescript-support)?
* Is the component documented accurately?
* Does the component have appropriate tests?
* Does the pull request increase the bundle size significantly?

If everything looks great, the design systems team member will approve the pull request and merge when appropriate. Minor and patch changes are released frequently, and we try to bundle up breaking changes and avoid shipping major versions too often. If your pull request is time-sensitive, please let a design systems team member know. You do not need to worry about merging pull requests on your own, we'll take care of that for you :)

## Deploying and publishing

### Deploying

All of our documentation sites use the [Now integration](https://github.com/organizations/primer/settings/installations/1007619) to deploy documentation changes whenever code is merged into master. The integration also creates a preview site every time you commit code to a branch. To view the preview site, navigate to the PR and find the comment from the `now` bot. This will include a link to the preview site for your branch.

Once you merge your branch into master, any changes to the docs will automatically deploy. No further action is necessary.

### Path aliasing

This site is served as a subdirectory of [primer.style] using a [path alias](https://zeit.co/docs/features/path-aliases) configured in that repo's [`rules.json`](https://github.com/primer/primer.style/tree/master/rules.json). If you change the production deployment URL for this app, you will also need to change it there and re-deploy that app; otherwise, Now will automatically route requests from [primer.style/components](https://primer.style/components/) to the new deployment whenever you alias this one to `primer-components.now.sh`.

### Publishing

We use a custom GitHub Actions to handle all of our processes relating to publishing to NPM. This includes release candidates, canary releases, and publishing the final release.

The [publish GitHub Action](https://github.com/primer/publish) will automatically publish a canary release for each commit to a branch. If the branch is prefixed with `release-` it will publish a release candidate. To find the canary release or release candidate, navigate to the PR and find the `publish` check in the merge box. Clicking on the `details` link for the check will navigate you to the unpkg page for that canary release/release candidate. For more documentation on our publish GitHub Action and workflows, please refer to the [`@primer/publish` repo](https://github.com/primer/publish).

## Troubleshooting

**`yarn start` fails with an error like `gatsby: command not found`**

Make sure to run `yarn` from inside the `docs/` subfolder *as well as* the root folder.

** `yarn start` fails with a different error**

Ensure you are using the latest minor of Node.js for the major version specified in the `.nvmrc` file. For example, if `.nvmrc` contains `8`, make sure you're using the latest version of Node.js with the major version of 8.

## Glossary

### System props

System props are style functions that provide one or more props, and can be passed directly the return value of [styled-components]'s `styled()` function:

```jsx
import {styled} from 'styled-components'
import {space} from 'styled-system'
const SpaceDiv = styled.div`
  ${space}
`
```

System props come with `propTypes` that can be mixed into your own with ES6 [spread syntax]:

```jsx
SpaceDiv.propTypes = {
  stellar: PropTypes.bool,
  ...space.propTypes
}
```

[classnames]: https://www.npmjs.com/package/classnames
[spread syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
[styled-system]: https://styled-system.com
[table]: https://jxnblk.com/styled-system/table
[npx]: https://www.npmjs.com/package/npx
[Now]: https://zeit.co/now
[primer.style]: https://primer.style
