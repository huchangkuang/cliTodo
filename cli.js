#!/usr/bin/env node

const {Command} = require('commander')
const todoApi =  require('./index')
const pkg = require('./package.json')

const program = new Command()

program
  .version(pkg.version)

if (process.argv.length === 2) {
  todoApi.showAll()
} else {

  program.command('add')
    .description('add a task')
    .action((_, options) => {
      todoApi.add(options.args.join(' '))
    })

  program.command('clear')
    .description('clear tasks')
    .action(() => {
      todoApi.clear()
    })
  program.command('update')
    .description('add a task')
    .option('-t', 'update title')
    .option('-s', 'update status')
    .action(() => {
      const [op, index, content] = process.argv.slice(2)
      if (op === '-t') {
        todoApi.update({
          index,
          title: content
        })
      }
      if (op === '-s') {
        todoApi.update({
          index,
          done: content
        })
      }
    });
}

program.parse(process.argv);
