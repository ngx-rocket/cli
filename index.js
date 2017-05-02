'use strict';

const pkg = require('./package.json');
const env = require('yeoman-environment').createEnv();
const chalk = require('chalk');
const os = require('os');
const path = require('path');
const fs = require('fs');

const asciiArt =
  `          ${chalk.red(`__   __`)}\n` +
  ` ${chalk.red(`_ _  __ _\\ \\./ /`)}\n` +
  `${chalk.red(`| ' \\/ _\` |>   <`)}    ENTERPRISE-GRADE\n` +
  `${chalk.red(`|_||_\\__, /_/°\\_\\`)}      ANGULAR TOOLS\n` +
  `     ${chalk.red('|___/')} v${chalk.green(pkg.version)}\n`;

const appName = path.basename(process.argv[1]);
// const configPath = path.join(os.homedir(), '.ngx-cli');
const help =
`Usage: ${appName} [new|update|install|setup]
`;
// Commands:
//   setup            Configure hue bridge or show current config
//     -l, --list     List bridges on the network
//     -i, --ip       Set bridge ip (use first bridge if not specified)
//     --force        Force setup if already configured
//
//   s, scene <name>  Activate scene starting with <name>
//     -l, --list     List scenes, using <name> as optional filter
//     -m, --max <n>  Show at most <n> scenes when listing (10 by default)
//     -c, --create   Create scene <name> using current lights state
//
//   i, on            Switch all lights on
//   o, off           Switch all lights off
// `;

class NgxCli {

  constructor(args) {
    this._args = args;
    this._config = {};
    // this._loadConfig();
    this._runCommand();
  }

  init(args) {
    this._run(args, { update: false });
  }

  update(args) {
    this._run(args, { update: true });
  }

  _run(args, options) {
    const mergedOptions = Object.assign({ 'skip-welcome': true }, options);
    env.lookup(() => {
      env.run(`ngx-app ${args.join(' ')}`, mergedOptions);
    });
  }

  _loadConfig() {
    let config;
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      this._config = config || {};
    } catch (e) {
      // Do nothing
    }
  }

  _showLogo() {
    console.log(asciiArt);
  }

  _saveConfig() {
    fs.writeFileSync(configPath, JSON.stringify(this._config))
  }

  _help() {
    this._exit(help);
  }

  _exit(error, code = 1) {
    console.error(error);
    process.exit(code);
  }

  _runCommand() {
    this._showLogo();
    switch (this._args[0]) {
      case 'n':
      case 'new':
        return this.init(this._args.slice(1));
      default:
        this._help();
    }
  }

}

new NgxCli(process.argv.slice(2));

exports = NgxCli;
