#!/usr/bin/env node
'use strict';

const program = require('commander');
const fs = require('fs');
const util = require('util');
let readFile = util.promisify(fs.readFile)

program
  .command('owner <pattern>')
  .description('list the owners for pattern')
  .action(async function(pattern, cmdObj) {
    console.log(await loadOwners('CODEOWNERS', pattern));
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);

function parse(str, matchPattern) {
    let entries = [];
    let lines = str.split("\n");
    for (let line of lines) {
        let [content, comment] = line.split("#");
        let trimmed = content.trim();
        if (trimmed === "")
            continue;
        let [pattern, ...owners] = trimmed.split(/\s+/);
        if(pattern == matchPattern){
          entries = entries.concat(owners);
        }
    }
    return entries.reverse();
}

async function loadOwners(cwd, matchPattern) {
    let contents = await readFile(cwd, "utf-8");
    let entries = parse(contents, matchPattern);
    return '' + entries;
}
