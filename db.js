const os = require('os')
const path = require("path");
const fs = require("fs");
const home = process.env.HOME || os.homedir()
const _dbPath = path.join(home, ".todo")

const db = {
  read(dbPath = _dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(dbPath, {flag: 'a+'}, ((err, data) => {
        if (err) {
          reject(err)
        } else {
          let list
          try {
            list = JSON.parse(data.toString())
          } catch(e) {
            list = []
          }
          resolve(list)
        }
      }))
    })
  },
  write(list, dbPath = _dbPath) {
    return new Promise((resolve, reject) =>  {
      fs.writeFile(dbPath, JSON.stringify(list), (err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }))
    })
  }
}
module.exports = db