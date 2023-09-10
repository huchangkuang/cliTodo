const db = require('./db')
const inquirer = require("inquirer");

const todoApi = {
  async add(word) {
    const list = await db.read()
    list.push({name: word, done: false})
    await db.write(list)
  },

  async del(index) {
    const list = await db.read()
    list.splice(index, 1)
    await db.write(list)
  },

  async update(option) {
    const {index, title, done} = option
    const list = await db.read()
    const item = list.find((_, i) => i === index)
    if (item) {
      if (done !== undefined) {
        item.done = done
      }
      if (title !== undefined) {
        item.title = title
      }
      await db.write(list)
    }
  },

  clear() {
    db.write([])
  },

  async showAll() {
    const list = await db.read()

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'index',
          message: '请选择你想操作的任务',
          choices: ['1', ' 2', '3']
        }

      ])
      .then((answers) => {
        // Use user feedback for... whatever!!
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
  }
}
module.exports = todoApi