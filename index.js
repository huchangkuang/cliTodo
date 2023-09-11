const db = require('./db')
const inquirer = require('inquirer');

const inquireTitle = () => {
  return new Promise((resolve) => {
    inquirer
      .prompt({
        type: 'input',
        name: 'title',
        message: '请输入任务名称',
      })
      .then((answers) => {
        resolve(answers.title)
      });
  })
}

const inquireChoices = (choices, message) => {
  return new Promise(((resolve) => {
    inquirer
      .prompt({
        type: 'list',
        name: 'index',
        message,
        choices: choices
      }).then(async (answers) => {
        resolve(answers.index)
    })
  }))
}

const inquireInit = async (list) => {
  const choices = [{name: '退出', value: -3},{name: '创建任务', value: -2},{name: '清空', value: -1},...list.map((i, index) => ({name: `[${i.done ? '√' : ''}] ${index + 1}: ${i.name}`, value: index}))]
  const index = await inquireChoices(choices, '请选择你想操作的任务')
  if (index >= 0) {
    const choices2 = [{name: '退出', value: -1},{name: '完成', value: 0},{name: '未完成', value: 1},{name: '删除', value: 2},{name: '修改标题', value: 3}]
    const index2 = await inquireChoices(choices2, '请选择你的操作')
    const actionMap = {
      0: () => {
        todoApi.update({
          index, done: true
        })
      },
      1: () => {
        todoApi.update({
          index, done: false
        })
      },
      2: () => {
        todoApi.del(index)
      },
      3: async () => {
        const title = await inquireTitle(list)
        todoApi.update({index, title})
      },
    }
    actionMap[index2]?.()
  } else if (index === -2) {
    const title = await inquireTitle(list)
    todoApi.add(title)
  } else if (index === -1) {
    todoApi.clear()
  }
}

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
    const item = list.find((_, i) => i === Number(index))
    if (item) {
      if (done !== undefined) {
        item.done = done
      }
      if (title !== undefined) {
        item.name = title
      }
      await db.write(list)
    }
  },

  clear() {
    db.write([])
  },

  async showAll() {
    const list = await db.read()
    inquireInit(list)
  }
}
module.exports = todoApi