<div align="center" style="padding: 40px;">
    <img alt="playgrounds" src="https://raw.githubusercontent.com/k15a/playgrounds/master/assets/Logo.png" width="160px"/>
</div>

# First steps

```sh
# Install playgrounds on your machine
npm install -g playgrounds

# Create your first playground
playgrounds
```

> You can use `npx playgrounds` to try out playgrounds without installing it globally.

# Features

## JSX

We support JSX for both react and preact. We decide which JSX pragma we use based on the imports of the file. If you import from `react` we will transform JSX to `React.createElement`. If you import from `preact` we tranform JSX to `h`. Otherwise we will disable all JSX transforms.

## Automatic Node package installation

As soon as you import a package from NPM we will download it for you so you don't have to care about this. We also install peer dependencies so nothing is missing.

## Babel macros

We support babel-macros out of the box. Feel free to use them.

# Templates

We currently have templates for React, Preact and styled-components. We try to keep the templates as simple as possible because nobody wants to delete code they don't need.

You can override the existing templates or create a new template in your `~/.playgrounds/templates` directory. Create a new directory with the template name and put everything there you want. Then you can use the template with `playgorunds --template <template-name>`.

🦄
