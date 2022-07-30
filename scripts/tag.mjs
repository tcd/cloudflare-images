import { join } from "path";
import { readFileSync } from "fs";
// var inquirer = require("inquirer");
import inquirer from "inquirer";
import shell from "shelljs";
// import packageJson from "../package.json";
// const packageJson = require("../package.json")

const packageJsonPath = join(process.cwd(), "package.json");
const packageJson     = JSON.parse(readFileSync(packageJsonPath).toString());
const version         = `v${packageJson.version}`;

// =============================================================================
// Inquirer.js
// =============================================================================

const promptAddTag = () => {
    inquirer
        .prompt([
            {
                name: "confirmation",
                type: "confirm",
                message: `add tag '${version}'? `,
            },
            {
                name: "message",
                type: "input",
                message: "tag message: ",
            },
        ])
        .then((answers) => {
            if (answers.confirmation !== true) {
                console.log(`please update version in ${packageJsonPath}`);
                process.exit(0);
            } else {
                addTag(version, answers.message);
                console.log("git tag added");
                promptPushTags();
            }
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
};

const promptPushTags = () => {

    const lastTag = getLastTag();
    console.log(lastTag);

    inquirer
        .prompt([{
            name: "confirmation",
            type: "confirm",
            message: `push tag '${lastTag}'? `,
        }])
        .then((answers) => {
            if (answers.confirmation !== true) {
                console.log(`not pushing`);
                process.exit(0);
            } else {
                if(pushTag(version)) {
                    console.log("git tag pushed");
                    process.exit(0);
                } else {
                    console.error("unable to push tag");
                    process.exit(1);
                }
            }
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
};

// =============================================================================
// ShellJS
// =============================================================================

const addTag = (version, message) => {
    const { _stdout, stderr, code } = shell.exec(`git tag -a ${version} -m "${message}"`, { silent: true });
    if (code !== 0) {
        console.error("Error: failed to add git tag");
        console.error(stderr);
        return false;
    }
    return true;
};

const getLastTag = () => {
    const { stdout, stderr, code } = shell.exec("git tag -l -n9", { silent: true });
    if (code !== 0) {
        console.error("Error: failed to list git tags");
        console.error(stderr);
        return null;
    }
    const lastTag = stdout.trim().split("\n").at(-1);
    return lastTag;
};

// const getTag = (tagName) => {
//     const { stdout, stderr, code } = shell.exec(`git show -s --format=%B ${tagName}`, { silent: true })
//     if (code !== 0) {
//         console.error(`Error: failed to read git tag ${tagName}`)
//         console.error(stderr)
//         return null
//     }
//     return stdout
// }

const pushTag = (tagName) => {
    const { _stdout, stderr, code } = shell.exec(`git push origin ${tagName}`, { silent: false });
    if (code !== 0) {
        console.error("Error: failed to push git tags");
        console.error(stderr);
        return false;
    }
    return true;
};

const main = () => {
    promptAddTag();
};

main();
