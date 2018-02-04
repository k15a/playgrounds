<br />
<div align="center" style="padding: 40px;">
    <img alt="Playgrounds" src="https://raw.githubusercontent.com/k15a/playgrounds/master/assets/Logo.png" width="160px" />
</div>

# What is Playgrounds?

Playgrounds is an alternative to Codesandbox or webpackbin with the difference that it's running locally on your computer. This gives you the advantage that you can use your own editor which is already configured like you want. Playgrounds is build to quickly prototype new ideas or try out libraries but not for production ready applications.

# Getting Started

```sh
# Install playgrounds on your machine
npm install -g playgrounds

# Create your first playground
playgrounds
```

> You can use `npx playgrounds` to try out playgrounds without installing it globally.

<div align="center" style="padding: 40px;">
    <img alt="Getting started" src="https://raw.githubusercontent.com/k15a/playgrounds/master/assets/GettingStarted.gif" width="800px" />
</div>

# Features

## JSX

We support JSX for React, Preact and Inferno. We decide which transform we use based on the imports of the file. If you import from `react` we will transform JSX to `React.createElement`. If you import from `preact` we transform JSX to `h`. If you import from `inferno` we transform JSX to `Inferno.createVNode`. Otherwise we will disable all JSX transforms.

## Automatic Node Package Installation

As soon as you import a package from NPM we will download it for you so you don't have to care about this. We also install peer dependencies so nothing is missing.

<div align="center" style="padding: 40px;">
    <img alt="Getting started" src="https://raw.githubusercontent.com/k15a/playgrounds/master/assets/PackageInstallation.gif" width="800px" />
</div>

## Babel Macros

We support babel-macros out of the box. Feel free to use them.

# Templates

We currently have templates for React, Preact and styled-components. We try to keep the templates as simple as possible because nobody wants to delete code they don't need.

You can override the existing templates or create a new template in your `~/.playgrounds/templates` directory. Create a new directory with the template name and put everything there you want. Then you can use the template with `playgrounds --template <template-name>`.

🦄
