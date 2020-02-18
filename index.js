#!/usr/bin/env node
const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const program = require('caporal')
const fs = require('fs')
const {spawn} = require('child_process')
const chalk = require('chalk')

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({
        filename = 'index.js'
    })=>{ 

        // make sure file exist
        try {
            await fs.promises.access(filename);
        } catch (error) {
            throw new Error(`Could not find the file: ${filename}`)
        }
        
        let proc;

        // wait to restart the program every 100 ms on change
        const start = debounce(() =>{

            // kill current running process
            if(proc) {
                proc.kill();
            };
            console.log(chalk.blue('>>>> Starting process'))
            // start a child process with node with displaying the process's io
            // equal to "node xxx.js"
            proc = spawn('node', [filename], {stdio: 'inherit'})
        }, 100)
        
        chokidar.watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start)
        
    })

program.parse(process.argv);


