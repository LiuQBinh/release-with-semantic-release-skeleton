#! /usr/bin/env node
'use strict'
const path = require('path')



/**
 * Functions defined to separate the alias and regex matching
 */

const INCORRECT_USAGE_CODE = 255
const MISSING_COMMAND_CODE = 254

/**
 * This package can only be executed from within the npm script execution context
 */
if (!process.env['npm_config_argv'] && !process.env['npm_lifecycle_event']) {
  console.log(
    'This is meant to be run from within npm script. See https://github.com/charlesguse/run-script-os')
  process.exit(INCORRECT_USAGE_CODE)
}

/**
 * Executor process to match the script without blocking
 */
const spawn = require('child_process').spawn

/**
 * Switch to linux platform if cygwin/gitbash detected (fixes #7)
 * Allow overriding this behavior (fixes #11)
 */
let platform = process.platform
if (process.env.RUN_OS_WINBASH_IS_LINUX) {
  let shell = process.env.SHELL || process.env.TERM
  shell = shell && shell.match('bash.exe') ? 'bash.exe' : shell
  platform = shell && ['bash.exe', 'cygwin'].includes(shell)
    ? 'linux'
    : process.platform
}

/**
 * Scripts as found on the user's package.json
 */
const scripts = require(path.join(process.cwd(), 'package.json')).scripts

/**
 * The script being executed can come from either lifecycle events or command arguments
 */
let options
if (process.env['npm_config_argv']) {
  let npmArgs = JSON.parse(process.env['npm_config_argv'])
  options = npmArgs.original
} else {
  options =
    [process.env['npm_command'], process.env['npm_lifecycle_event']]
}
if (!(options[0] === 'run' || options[0] === 'run-script')) {
  options.unshift('run')
}

/**
 * Expand shorthand command descriptors
 */
options[1] = expandShorthand(options[1])

// Check for yarn without install command; fixes #13
const isPnpm = (process.env.npm_config_user_agent &&
  process.env.npm_config_user_agent.includes('pnpm')) ? true : false
if (isPnpm && !options[1]) options[1] = 'install'

let osCommand = `${options[1]}:${platform}`

let argument = options[1]
let event = process.env['npm_lifecycle_event']

/**
 * Yarn support
 * Check for yarn without install command; fixes #13
 */
if (isPnpm && !argument) {
  argument = 'install'
}

/**
 * More in-depth match
 * Execute the regular expression to help identify missing scripts
 * It also tests for different aliases
 */
osCommand = matchScript(event || argument, platform, scripts)

/**
 * Test again, this time to end the process gracefully
 */
if (!osCommand) {
  console.log(
    `run-script-os was unable to execute the script '${event || argument}'`)
  process.exit(MISSING_COMMAND_CODE)
}

/**
 * If it hasn't already, we set the command to be executed via npm run or npm run-script
 */
if (!(options[0] === 'run' || options[0] === 'run-script')) {
  options.unshift('run')
}

/**
 * Lastly, set the script to be executed
 */
options[1] = osCommand

const supportedArgs = ['--no-arguments']
let args = process.argv.slice(2).map((a) => a.toLowerCase())

let argsCount = 0
for (let i = 0; i < args.length; i += 1) {
  if (supportedArgs.includes(args[i])) {
    argsCount = i
  }
}
args = args.slice(0, argsCount)

/**
 * Append arguments passed to the run-script-os
 * Check if we should be passing the original arguments to the new script
 * Fix for #23
 */
options = options.slice(0, 2)
if (!args.includes('--no-arguments')) {
  options = options.concat(process.argv.slice(2 + argsCount))
}

/**
 * Spawn new process to run the required script
 *
 * Open either the cmd file or the cmd command, if we're in windows
 */
let packageManagerCommand

packageManagerCommand = isPnpm ? 'pnpm' : 'npm'
if (platform === 'win32') {
  packageManagerCommand = packageManagerCommand + '.cmd'
}
const childProcess = spawn(packageManagerCommand, options,
  { shell: true, stdio: 'inherit' })

/**
 * Finish the execution
 */
childProcess.on('exit', (code) => {
  process.exit(code)
})

/**
 * Match script to the list of available scripts, or check for aliases
 *
 * The order for checking matches should be direct-platform and then aliases
 *
 * @param {string} script   - name of the script to be matched paired to the platform or alias
 * @param {string} platform - name of the platform to be paired with the script
 * @param {array}  scripts  - list of available scripts defined in package.json
 */
function matchScript(script, platform, scripts) {
  /**
   * Save the result so we can determine if there was a match
   * First check for a basic match before we have to go through each script with a regex
   */
  let result = (`${script}:${platform}` in scripts)
    ? `${script}:${platform}`
    : false
  if (result) return result

  /**
   * Regular expresion match
   * it helps when the "in" operator can't determine if there's a real match or not,
   * due to the properties changing
   */
  let regex = new RegExp(`^(${script}):([a-zA-Z0-9-]*:)*(${platform})(:[a-zA-Z0-9-]*)*$`,
    'g')
  for (let command in scripts) {
    if (command.match(regex)) return command
  }

  /**
   * Alias match, allows for a more verbose description of the platform
   * it also helps to group similar platforms on a single execution
   */
  switch (platform) {
  case 'win32':
    result = (`${script}:windows` in scripts) ? `${script}:windows` : false
    break

  case 'aix':
  case 'linux':
  case 'sunos':
  case 'openbsd':
  case 'freebsd':
  case 'android':
    result = (`${script}:nix` in scripts) ? `${script}:nix` : false
    break

  case 'darwin':
  case 'macos':
    /**
       * macOS specific scripts (e.g. brew)
       */
    result = (`${script}:macos` in scripts) ? `${script}:macos` : false

    /**
       * nix compatible scripts (cp, rm...)
       */
    if (!result) result = (`${script}:nix` in scripts)
      ? `${script}:nix`
      : false

    break
  default:
    result = false
  }

  /**
   * Successful finding of a given script by platform, present it.
   */
  if (result) return result

  /**
   * Fall to default if it's given, otherwise fail
   */
  return (`${script}:default` in scripts) ? `${script}:default` : false
}

/**
 * Expand the shorthand description for npm commands
 *
 * i.e. npm i -> npm install
 *
 * @param  String shorthand   Shorthand command to be expanded
 * @return String             Actual command
 */
function expandShorthand(shorthand) {
  switch (shorthand) {
  case 'i':
    return 'install'

  case 't':
  case 'tst':
    return 'test'

    /**
     * Expansion is not possible
     * @type {[type]}
     */
  default:
    return shorthand
  }
}
