const fse = require('fs-extra')
const { execSync } = require('child_process')
const path = require('path')

const dirs = ['api', 'central']

dirs.forEach((d) => {
  fse.copySync('../' + d + '/src', 'dist/' + d + '/src')
})

execSync(
  'node "' +
    path.join(__dirname, "..", "node_modules", "typescript", "lib", "tsc.js") +
    '" -p "' +
    path.join(__dirname, "..") +
    '"',
  {
    cwd: path.join(__dirname, ".."),
    shell: true,
    env: process.env,
    encoding: "utf8"
  }
)

console.log('Compiled files')
