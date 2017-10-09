# :rocket: ngx-rocket/cli

[![NPM version](https://img.shields.io/npm/v/@ngx-rocket/cli.svg)](https://www.npmjs.com/package/@ngx-rocket/cli)
[![Build status](https://img.shields.io/travis/ngx-rocket/cli/master.svg)](https://travis-ci.org/ngx-rocket/cli)
[![Windows build status](https://ci.appveyor.com/api/projects/status/github/ngx-rocket/cli?svg=true&branch=master)](https://ci.appveyor.com/project/sinedied/cli/branch/master)
![Node version](https://img.shields.io/badge/node-%3E%3D6.0.0-brightgreen.svg)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> CLI for creating Angular apps with ngX-Rocket generators.

Leverage [ngX-Rocket generator](https://github.com/ngx-rocket/generator-ngx-rocket) with community
[add-ons](https://www.npmjs.com/search?q=ngx-rocket-addon) and improve your **developer experience**.
From scaffolding to deployment, use this CLI to accelerate your workflow.
You can also [make your very own add-on](https://github.com/ngx-rocket/generator-ngx-rocket-addon) directly from the
CLI, to make your next project even faster! 

## Installation

```sh
npm install -g @ngx-rocket/cli
```

## Usage

```sh
ngx --help
          __   __
 _ _  __ _\ \./ / ____ ____ ____ _  _ ____ ___
| ' \/ _` |>   <  |--< [__] |___ |-:_ |===  |
|_||_\__, /_/°\_\ ENTERPRISE APP STARTER -~*=>
     |___/

Usage: ngx [new|update|config|list|<script>] [options]

n, new [name]
  Creates a new app.
  -a, --addon  Creates an add-on instead.

u, update
  Updates an existing app or add-on.

c, config
  Configures add-ons to use for new apps.
  All available add-ons are used by default.

l, list
  Lists available add-ons.
  -n, --npm    Show installable add-ons on NPM
  
<script>
  Runs specified script from your package.json.
  Works just like npm run <script>
```

## Generating and serving a project via a development server

```sh
ngx new
npm start
```

Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

To get more information about generated project, see
[ngX-Rocket generator](https://github.com/ngx-rocket/generator-ngx-rocket).

## Updating an existing project

Make you have no uncommited changes in your project folder, then:
```sh
ngx update
```

The simplest and safest way is then to overwrite everything in case of conflict, then use your SCM to revert/merge
changes one file at once.

## Managing add-ons

ngX-Rocket add-ons are additional generators running on top of
[ngX-Rocket generator](https://github.com/ngx-rocket/generator-ngx-rocket) that complement or modify the project
template.

### Listing available add-ons

Use `ngx list` to show currently installed add-ons on the system.

To show add-ons available for installation, use `npm list --npm`.

### Disabling specific add-ons

By default all installed add-ons are used for new projects.
However, you selectively enable or disable add-ons using `ngx config`.

### Creating a new add-on

You can use the command `ngx new --addon` to create a new ngX-Rocket add-on.
See [ngx-rocket/core](https://github.com/ngx-rocket/core) for the complete documentation about add-on creation.

## Running scripts from `package.json`

In a generated project folder, you can use the command `ngx <script>` to run any `package.json` script.
This is only a convenience shortcut, it works exactly like `npm run <script>`, except that you do need to add `--` to
pass arguments to the underlying command.

For example in a ngX-Rocket project you can use these commands:
```sh
ngx start --env=prod
ngx generate component myComponent --module myModule
ngx build --build-optimizer
```

Instead of typing the full script name, you can also type only the first letters:
```sh
ngx s --env=prod
ngx g component myComponent --module myModule
ngx b --build-optimizer
```

If there is more than one script matching, the first one will be used.
You can then use any number of additional letters to discriminate the script you want to run.

# License

[MIT](LICENSE)
