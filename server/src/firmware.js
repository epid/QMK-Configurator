const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const buildConfig = require('./buildConfig')
const buildRules = require('./buildRules')
const buildProductC = require('./buildProductC')
const buildKeyboardHeader = require('./buildKeyboardHeader')
const buildKeymap = require('./buildKeymap')
const log = require('electron-log')

let FIRMWARE_BASE
let FIRMWARE_BUILD_DIR
if (process.versions['electron']) {
  FIRMWARE_BUILD_DIR = path.resolve(__dirname, '..', '..', '..', '..', 'server', 'qmk_firmware')
  FIRMWARE_BASE = path.resolve(FIRMWARE_BUILD_DIR, 'keyboards')
} else {
  FIRMWARE_BUILD_DIR = path.resolve(__dirname, '..', 'qmk_firmware')
  FIRMWARE_BASE = path.resolve(FIRMWARE_BUILD_DIR, 'keyboards')
}

const makefileContent = (
`ifndef MAKEFILE_INCLUDED
include ../../Makefile
endif`)

exports.setupFirmware = (config, rules, configKeymap, keymap, indicators) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString().replace(/[-T:]*/g, '').split('.')[0]
    const fd = `${config.product.replace(/ /, '')}${now}`
    let filesToWrite = 6
    const done = () => {
      filesToWrite--
      if (!filesToWrite) {
        return resolve(fd)
      }
    }

    fs.mkdir(path.resolve(FIRMWARE_BASE, fd, 'keymaps/default'), {recursive: true}, (err) => {
      if (err) return reject(err)
      fs.writeFile(`${FIRMWARE_BASE}/${fd}/config.h`, buildConfig(config), done)
      fs.writeFile(`${FIRMWARE_BASE}/${fd}/makefile`, makefileContent, done)
      fs.writeFile(`${FIRMWARE_BASE}/${fd}/rules.mk`, buildRules(rules), done)
      fs.writeFile(`${FIRMWARE_BASE}/${fd}/${fd}.h`, buildKeyboardHeader(configKeymap, fd), done)
      fs.writeFile(`${FIRMWARE_BASE}/${fd}/${fd}.c`, buildProductC(fd), done)
      fs.writeFile(`${FIRMWARE_BASE}/${fd}/keymaps/default/keymap.c`, buildKeymap(keymap, indicators, fd), done)
    })
  })
}

exports.buildFirmware = firmwareDirectory => {
  log.info(firmwareDirectory)
  log.info(FIRMWARE_BUILD_DIR)
  return new Promise((resolve, reject) => {
    child_process.exec(`make ${firmwareDirectory}`, {cwd: FIRMWARE_BUILD_DIR}, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr)
      }
      return resolve()
    })
  })
}
