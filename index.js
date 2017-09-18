'use strict';

const path = require('path');
const fs = require('fs');
const child = require('child_process');
const Conf = require('conf');
const inquirer = require('inquirer');
const env = require('yeoman-environment').createEnv();
const chalk = require('chalk');
const figures = require('figures');
const minimist = require('minimist');
const updateNotifier = require('update-notifier');
const asciiLogo = require('@ngx-rocket/ascii-logo');
const pkg = require('./package.json');

const isWin = /^win/.test(process.platform);
const addonKey = 'ngx-rocket-addon';
const disabledAddons = 'disabled-addons';
const appName = path.basename(process.argv[1]);
const help = `${chalk.bold(`Usage:`)} ${appName} ${chalk.blue(`[new|update|config|list|<script>]`)} [options]\n`;
const detailedHelp = `
${chalk.blue('n, new')} [name]
  Creates a new app.
  -a, --addon  Creates an add-on instead.

${chalk.blue('u, update')}
  Updates an existing app or add-on.

${chalk.blue('c, config')}
  Configures add-ons to use for new apps.
  All available add-ons are used by default.

${chalk.blue('l, list')}
  Lists available add-ons.
  -n, --npm    Show installable add-ons on NPM
  
${chalk.blue('<script>')}
  Runs specified script from your ${chalk.bold(`package.json`)}.
  Works just like ${chalk.bold(`npm run <script>`)}
`;

class NgxCli {
  constructor(args) {
    this._args = args;
    this._options = minimist(args, {
      boolean: ['help', 'npm', 'addon'],
      alias: {
        n: 'npm',
        a: 'addon'
      }
    });
    this._config = new Conf({
      defaults: {
        disabledAddons: {}
      }
    });

    env.register(require.resolve('generator-ngx-rocket'), 'ngx-rocket');
    env.register(require.resolve('generator-ngx-rocket-addon'), 'ngx-rocket-addon');
  }

  run() {
    updateNotifier({pkg}).notify();

    if (this._options.help) {
      return this._help(true);
    }
    switch (this._args[0]) {
      case 'n':
      case 'new':
        return this.generate(false, this._args.slice(1), this._options.addon);
      case 'u':
      case 'update':
        return this.generate(true, this._args.slice(1), this._options.addon);
      case 'c':
      case 'config':
        return this.configure();
      case 'l':
      case 'list':
        return this.list(this._options.npm);
      default:
        this.runScript(this._args);
    }
  }

  runScript(args) {
    const name = args[0];
    const packageFile = this._findPackageJson(process.cwd());
    const projectPackage = packageFile ? require(packageFile) : null;
    if (!projectPackage || !projectPackage.scripts[name]) {
      this._help();
    }

    child.spawnSync('npm', ['run'].concat(args), {
      stdio: 'inherit',
      shell: isWin
    });
  }

  generate(update, args, addon) {
    if (!update) {
      console.log(asciiLogo(pkg.version));
    } else if (fs.existsSync('.yo-rc.json')) {
      const rc = JSON.parse(fs.readFileSync('.yo-rc.json'));
      addon = Boolean(rc['generator-ngx-rocket-addon']);
    } else {
      this._exit(`No existing app found, use ${chalk.blue('ngx new')} instead`);
    }
    if (addon) {
      args = args.filter(arg => arg !== '--addon' && arg !== '-a');
      env.lookup(() => env.run(['ngx-rocket-addon'].concat(args), {
        update,
        'skip-welcome': true
      }));
    } else {
      const disabled = this._config.get(disabledAddons);
      return this._findAddons()
        .then(addons => addons.filter(addon => !disabled[addon]))
        .then(addons => {
          return new Promise(resolve => env.lookup(() => env.run(['ngx-rocket'].concat(args), {
              update,
              addons: addons.join(' '),
              'skip-welcome': true
            }, resolve)));
        })
        .then(() => console.log());
    }
  }

  configure() {
    this._findAddons().then(addons => {
      const disabled = this._config.get(disabledAddons);
      inquirer
        .prompt({
          type: 'checkbox',
          name: 'addons',
          message: 'Choose add-ons to use for new apps',
          choices: addons.map(addon => ({
            name: addon,
            checked: !disabled[addon]
          }))
        })
        .then(answers => {
          this._config.set(disabledAddons, addons
            .filter(addon => !answers.addons.includes(addon))
            .reduce((r, addon) => {
              r[addon] = true;
              return r;
            }, {}));
          console.log('Configuration saved.');
        });
    });
  }

  list(npm) {
    let promise;
    if (npm) {
      promise = Promise
        .resolve(child.execSync(`npm search ${addonKey} --json`, {stdio: [0, null, 2]}))
        .then(addons => addons ? JSON.parse(addons) : [])
        .then(addons => addons.filter(addon => addon.name !== 'generator-ngx-rocket-addon'));
    } else {
      promise = this._findAddons();
    }
    promise.then(addons => {
      const disabled = this._config.get(disabledAddons);
      console.log(chalk.blue(`Available add-ons${npm ? ' on NPM' : ''}:`));

      if (!addons.length) {
        console.log('  No add-ons found.');
      } else if (npm) {
        addons.forEach(addon => console.log(`  ${addon.name}@${addon.version} - ${addon.description}`));
      } else {
        addons.forEach(addon => console.log(`${chalk.green(disabled[addon] ? ' ' : figures.tick)} ${addon}`));
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
          })
          .map(generator => generator.namespace.replace(/(.*?):app$/, '$1'));
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

  _help(details) {
    console.log(asciiLogo(pkg.version));
    this._exit(help + (details ? detailedHelp : `Use ${chalk.white(`--help`)} for more info.\n`));
  }

  _exit(error, code = 1) {
    console.error(error);
    process.exit(code);
  }
}

module.exports = NgxCli;
