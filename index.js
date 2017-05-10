'use strict';

const path = require('path');
const child = require('child_process');
const env = require('yeoman-environment').createEnv();
const chalk = require('chalk');
const minimist = require('minimist');
const pkg = require('./package.json');

const appName = path.basename(process.argv[1]);
const logo =
  `          ${chalk.red(`__   __`)}\n` +
  ` ${chalk.red(`_ _  __ _\\ \\./ /`)} ${chalk.blue(`____ ____ ____ _  _ ____ ___`)}\n` +
  `${chalk.red(`| ' \\/ _\` |>   <`)}  ${chalk.blue(`|--< [__] |___ |-:_ |===  |`)}\n` +
  `${chalk.red(`|_||_\\__, /_/°\\_\\`)} ${chalk.gray(`ENTERPRISE-GRADE TOOLS`)} ${chalk.yellow(`-~`)}${chalk.red(`*`)}${chalk.blue(`=>`)}\n` +
  `     ${chalk.red('|___/')} v${pkg.version}\n`;

const help = `Usage: ${appName} ${chalk.cyan(`[new|update|install|setup|list]`)} [options]\n`;
const detailedHelp = `
${chalk.cyan('n, new')} [name]
  Creates a new project in the current folder.

${chalk.cyan('u, update')}
  Updates an existing project.

${chalk.cyan('l, list')}
  Lists available add-ons.
  -o, --online   Show installable add-ons
`;

class NgxCli {

  constructor(args) {
    env.alias(/^([a-zA-Z0-9:\*]+)$/, 'ngx-rocket-addon-$1');

    this._args = args;
    this._options = minimist(args, {
      boolean: ['help']
    });
    this._config = {};
    // this._loadConfig();
    this._runCommand();
  }

  init(args) {
    this._showLogo();
    this._run(args, { update: false });
  }

  update(args) {
    this._run(args, { update: true });
  }

  list(args) {
    child.execSync(`npm search ngx-rocket`, { stdio: 'inherit' });
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
      this._config = config || {};
    } catch (e) {
      // Do nothing
    }
  }

  _showLogo() {
    console.log(logo);
  }

  _saveConfig() {
  }

  _help(details) {
    this._showLogo();
    this._exit(help + (details ? detailedHelp : ''));
  }

  _exit(error, code = 1) {
    console.error(error);
    process.exit(code);
  }

  _runCommand() {
    if (this._options.help) {
      return this._help(true);
    }

    switch (this._args[0]) {
      case 'n':
      case 'new':
        return this.init(this._args.slice(1));
      case 'u':
      case 'update':
        return this.update(this._args.slice(1));
      case 'l':
      case 'list':
        return this.list(this._args.slice(1));
      default:
        this._help();
    }
  }

}

new NgxCli(process.argv.slice(2));

exports = NgxCli;
