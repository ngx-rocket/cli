# :rocket: ngx-rocket/cli

[![NPM version](https://img.shields.io/npm/v/@ngx-rocket/cli.svg)](https://www.npmjs.com/package/@ngx-rocket/cli)
[![Build status](https://img.shields.io/travis/ngx-rocket/cli/master.svg)](https://travis-ci.org/ngx-rocket/cli)
![Node version](https://img.shields.io/badge/node-%3E%3D6.0.0-brightgreen.svg)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> CLI for creating Angular apps with ngX-Rocket generators.

## Installation

```bash
npm install -g @ngx-rocket/cli
```

### Usage

```bash
ngx --help
          __   __
 _ _  __ _\ \./ / ____ ____ ____ _  _ ____ ___
| ' \/ _` |>   <  |--< [__] |___ |-:_ |===  |
|_||_\__, /_/°\_\ ENTERPRISE APP STARTER -~*=>
     |___/ v1.0.3

Usage: ngx [new|update|config|list] [options]

n, new [name]
  Creates a new app.

u, update
  Updates an existing app.

c, config
  Configures add-ons to use for new apps.
  All available add-ons are used by default.

l, list
  Lists available add-ons.
  -n, --npm   Show installable add-ons on NPM
```

# Generating and serving an Angular project via a development server

```bash
ngx new <project-name>
cd <project-name>
npm start
```

Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

To get more information about generated project, see
[ngX-Rocket generator](https://github.com/ngx-rocket/generator-ngx-rocket).

# Updating an existing project

Make you have no uncommited changes in your project folder, then:
```bash
ngx update
```

The simplest and safest way is then to overwrite everything in case of conflict, then use your SCM to revert/merge
changes one file at once.

# Managing add-ons

## Listing available add-ons

Use `ngx list` to show currently installed add-ons on the system.

To show add-ons available for installation, use `npm list --npm`.

## Disabling specific add-ons

By default all installed add-ons are used for new projects.
However, you selectively enable or disable add-ons using `ngx config`.

# License

[MIT](LICENSE)
