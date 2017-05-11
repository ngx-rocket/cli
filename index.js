'use strict';

const path = require('path');
const fs = require('fs');
const child = require('child_process');
const env = require('yeoman-environment').createEnv();
const chalk = require('chalk');
const minimist = require('minimist');
const pkg = require('./package.json');

const addonKey = 'ngx-rocket-addon';
const appName = path.basename(process.argv[1]);
const logo =
  `          ${chalk.red(`__   __`)}\n` +
  ` ${chalk.red(`_ _  __ _\\ \\./ /`)} ${chalk.blue(`____ ____ ____ _  _ ____ ___`)}\n` +
  `${chalk.red(`| ' \\/ _\` |>   <`)}  ${chalk.blue(`|--< [__] |___ |-:_ |===  |`)}\n` +
  `${chalk.red(`|_||_\\__, /_/°\\_\\`)} ENTERPRISE-GRADE TOOLS ${chalk.yellow(`-~`)}${chalk.red(`*`)}${chalk.blue(`=>`)}\n` +
  `     ${chalk.red('|___/')} v${pkg.version}\n`;

const help = `${chalk.bold(`Usage:`)} ${appName} ${chalk.blue(`[new|update|install|setup|list]`)} [options]\n`;
const detailedHelp = `
${chalk.blue('n, new')} [name]
  Creates a new project in the current folder.

${chalk.blue('u, update')}
  Updates an existing project.

${chalk.blue('l, list')}
  Lists available add-ons.
  -n, --npm   Show installable add-ons on NPM
`;

class NgxCli {

  constructor(args) {
    this._args = args;
    this._options = minimist(args, {
      boolean: ['help', 'npm'],
      alias: {
        n: 'npm'
      }
    });
  }

  run() {
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
        return this.list(this._options.npm);
      default:
        this._help();
    }
  }

  init(args) {
    this._showLogo();
    this._generate(args, {update: false});
  }

  update(args) {
    this._generate(args, {update: true});
  }

  list(npm) {
    let promise;
    if (npm) {
      promise = Promise
        .resolve(child.execSync(`npm search ${addonKey} --json`, {stdio: [0, null, 2]}))
        .then(addons => addons ? JSON.parse(addons) : []);
    } else {
      promise = this._findAddons();
    }
    promise.then(addons => {
      console.log(chalk.blue(`Available add-ons${npm ? ' on NPM' : ''}:`));

      if (!addons.length) {
        console.log('  No add-ons found.');
      } else if (npm) {
        addons.forEach(addon => console.log(`  ${addon.name}@${addon.version} - ${addon.description}`));
      } else {
        addons.forEach(addon => console.log(`  ${addon.namespace.replace(/(.*?):app$/, '$1')}`));
      }
    });
  }

  _findAddons() {
    return new Promise(resolve => {
      env.lookup(() => {
        const generators = env.getGeneratorsMeta();
        const addons = Object.keys(generators)
          .map(alias => generators[alias])
          .filter(generator => {
            const packagePath = this._findPackageJson(generator.resolved);
            const keywords = require(packagePath).keywords || [];
            return keywords.includes(addonKey);
          });
        resolve(addons);
      });
    });
  }

  _findPackageJson(basePath) {
    const find = components => {
      if (!components.length) {
        return null;
      }
      const dir = path.join.apply(path, components);
      const packageFile = path.join(dir, 'package.json');
      return fs.existsSync(packageFile) ? packageFile : find(components.slice(0, -1));
    };

    const components = basePath.split(/[/\\]/);
    if (components.length && !components[0].length) {
      // When path starts with a slash, the first path component is empty string
      components[0] = path.sep;
    }
    return find(components);
  }

  _generate(args, options) {
    const mergedOptions = Object.assign({'skip-welcome': true}, options);
    env.lookup(() => {
      env.run(`ngx-app ${args.join(' ')}`, mergedOptions);
    });
  }

  _showLogo() {
    console.log(logo);
  }

  _help(details) {
    this._showLogo();
    this._exit(help + (details ? detailedHelp : `Use ${chalk.white(`--help`)} for more info.\n`));
  }

  _exit(error, code = 1) {
    console.error(error);
    process.exit(code);
  }

}

const cli = new NgxCli(process.argv.slice(2));
cli.run();

exports = NgxCli;
