"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const utils_1 = require("./utils");
const variables = new Map();
let blockId = 0;
let DISABLE_EVAL = false;
const parseArg = (arg) => {
    // is javascript
    if (arg.startsWith("`") && arg.endsWith("`")) {
        if (DISABLE_EVAL) {
            console.log(chalk_1.default.red(`Javascript evaluation (${arg}) is disabled, because option '--no-eval' is set`));
            process.exit(1);
        }
        return eval(arg.slice(1, -1));
        // is string
    }
    else if (arg.startsWith('"') && arg.endsWith('"')) {
        return arg.slice(1, -1);
        // is variable
    }
    else if (variables.has(arg)) {
        return variables.get(arg);
        // raw string
    }
    else
        return arg;
};
const commands = [
    {
        name: "if",
        action: (args) => !!parseArg(args[0]),
        argsCount: 1,
    },
    {
        name: "ifeq",
        action: (args) => parseArg(args[0]) == parseArg(args[1]),
        argsCount: 2,
    },
    {
        name: "ifne",
        action: (args) => parseArg(args[0]) != parseArg(args[1]),
        argsCount: 2,
    },
    {
        name: "ifgt",
        action: (args) => parseArg(args[0]) > parseArg(args[1]),
        argsCount: 2,
    },
    {
        name: "iflt",
        action: (args) => parseArg(args[0]) < parseArg(args[1]),
        argsCount: 2,
    },
    {
        name: "ifge",
        action: (args) => parseArg(args[0]) >= parseArg(args[1]),
        argsCount: 2,
    },
    {
        name: "ifle",
        action: (args) => parseArg(args[0]) <= parseArg(args[1]),
        argsCount: 2,
    },
    // variant: set variable
    {
        name: "ifs",
        action: (args) => {
            const result = !!parseArg(args[0]);
            if (result)
                variables.set(args[1], parseArg(args[2]));
            return result;
        },
        argsCount: 3,
    },
    {
        name: "ifeqs",
        action: (args) => {
            const result = parseArg(args[0]) == parseArg(args[1]);
            if (result)
                variables.set(args[2], parseArg(args[3]));
            return result;
        },
        argsCount: 4,
    },
    {
        name: "ifnes",
        action: (args) => {
            const result = parseArg(args[0]) != parseArg(args[1]);
            if (result)
                variables.set(args[2], parseArg(args[3]));
            return result;
        },
        argsCount: 4,
    },
    {
        name: "ifgts",
        action: (args) => {
            const result = parseArg(args[0]) > parseArg(args[1]);
            if (result)
                variables.set(args[2], parseArg(args[3]));
            return result;
        },
        argsCount: 4,
    },
    {
        name: "iflts",
        action: (args) => {
            const result = parseArg(args[0]) < parseArg(args[1]);
            if (result)
                variables.set(args[2], parseArg(args[3]));
            return result;
        },
        argsCount: 4,
    },
    {
        name: "ifges",
        action: (args) => {
            const result = parseArg(args[0]) >= parseArg(args[1]);
            if (result)
                variables.set(args[2], parseArg(args[3]));
            return result;
        },
        argsCount: 4,
    },
    {
        name: "ifles",
        action: (args) => {
            const result = parseArg(args[0]) <= parseArg(args[1]);
            if (result)
                variables.set(args[2], parseArg(args[3]));
            return result;
        },
        argsCount: 4,
    },
    {
        name: "else",
        action: (args) => true,
        argsCount: 0,
    },
    {
        name: "end",
        action: (args) => false,
        argsCount: 0,
    },
];
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .scriptName("ufpp")
    .usage("Universal File Pre-Processor ('ufpp') is a tool for preprocessing any file")
    .epilogue("for more info and support visit https://github.com/adrianschubek/ufpp")
    .version("0.1.0")
    .example("ufpp -o out.txt input.txt", "runs the preprocessor on input.txt and write output to out.txt")
    .example('ufpp -o out.txt input.txt -m "<#" "#>"', "runs the preprocessor on input.txt and write output to out.txt with markers <# and #>")
    .example("ufpp -v input.txt", "validates the syntax of input.txt file")
    // .command("check <file>", "checks the preprocessor", (builder) => {})
    .command(["run <file>", "$0"], "runs the preprocessor", (builder) => {
    builder
        .positional("file", {
        alias: "f",
        describe: "the file to preprocess",
        type: "string",
        demandOption: true,
    })
        .option("output", {
        alias: "o",
        describe: "the output file",
        default: "stdout",
        type: "string",
    })
        .option("markers", {
        alias: "m",
        describe: "set markers for preprocessor",
        type: "array",
        default: ["$[", "]$"],
    })
        .option("check", {
        alias: "c",
        describe: "checks/validates the file only",
        type: "boolean",
        default: false,
    })
        .option("verbose", {
        alias: "v",
        describe: "makes the preprocessor verbose",
        type: "boolean",
        default: false,
    })
        .option("quiet", {
        alias: "q",
        describe: "makes the preprocessor quiet",
        type: "boolean",
        default: false,
    })
        .option("no-eval", {
        describe: "disables the eval function",
        type: "boolean",
        default: false,
    });
}, (argv) => {
    // log(argv);
    // stop(0);
    // default log
    const log = (message, ...optionalParams) => {
        if (!argv.quiet)
            console.log(message, ...optionalParams);
    };
    // error log (even if quiet)
    const err = (message, ...optionalParams) => {
        console.log(message, ...optionalParams);
    };
    // verbose log (uses default log)
    const vlog = (message, ...optionalParams) => {
        if (argv.verbose)
            log(message, ...optionalParams);
    };
    const stop = (exitCode = 0) => {
        if (exitCode !== 0 && !argv.verbose) {
            log(chalk_1.default.grey("Turn on verbose mode for more info (-v)"));
        }
        process.exit(exitCode);
    };
    if (argv.file === undefined) {
        err(chalk_1.default.red("No file specified."));
        stop(1);
    }
    if (!fs.existsSync(argv.file)) {
        err(chalk_1.default.red(`File '${argv.file}' does not exist.`));
        stop(1);
    }
    // raw file data
    let data = fs.readFileSync(argv.file, "utf-8").toString("utf-8");
    /*  .split("\n")
      .forEach((_l) => {
        const l = _l.trim();

        if (l.ma)

        log(">>> " + l);
      }); */
    // all: \$\[(.*?)\]\$
    // const matches = data.matchAll(/\$\[(.*?)\]\$/g);
    // besser: (\$\[(.*?)\]\$)([\w\W]*?\$\[end\]\$)
    const blockMatches = data.matchAll(/(\$\[(.*?)\]\$)([\w\W]*?)(\$\[end\]\$)/g) || [];
    let processCmds = 0;
    let processedBlockes = 0;
    for (const block of blockMatches) {
        processedBlockes++;
        blockId++;
        vlog(">> NEXT BLOCK ");
        const matches = block[0].matchAll(/\$\[(.*?)\]\$/g);
        // block index in main raw data
        const startIndexMain = data.indexOf(block[0]);
        const endIndexMain = startIndexMain + block[0].length;
        let templateText = block[0].replaceAll(/\$\[(.*?)\]\$/g, (() => {
            let number = 0;
            return () => {
                return "$$" + blockId + ":" + number++ + "$$";
            };
        })());
        vlog(templateText);
        /*  später dann $$1$$ bis $$2$$  replace 1...2 */
        // log(block);
        let numElse = 0, numEnd = 0, cmdId = -1, trueCmdId = -1;
        const blockCommands = [];
        // validate command matches
        for (const match of matches) {
            cmdId++;
            //  split by space or quotes [^\s"`]+|"([^"]*)"|`([^`]*)`
            // parse args
            const cmdArgs = [];
            for (const _m of match[1].trim().matchAll(/[^\s"`]+|"([^"]*)"|`([^`]*)`/g))
                cmdArgs.push(_m[0].trim());
            blockCommands.push(cmdArgs);
            vlog(cmdArgs);
            const command = commands.find((c) => c.name === cmdArgs[0].trim());
            if (!command) {
                err(chalk_1.default.red(`Command '${cmdArgs[0]}' does not exist.`));
                stop(1);
                process.exit(1); /* to fix typescirpt error incorrectly assuming command can still be undefined afterwards */
            }
            // check if command arguments count is correct
            if (command.argsCount !== cmdArgs.length - 1) {
                err(chalk_1.default.red(`Command '${command.name}' expects ${command.argsCount} arguments but got ${cmdArgs.length - 1}.`));
                stop(1);
            }
            if (command.name === "end")
                ++numEnd;
            if (command.name === "else")
                ++numElse;
            processCmds++;
            // evaluate command and return of first 'true' command
            const result = command.action(cmdArgs.slice(1));
            vlog(result);
            // save first true command
            if (result && trueCmdId === -1) {
                // replace template all 0..4 mit between  1..2 zB
                trueCmdId = cmdId;
                vlog("True command ID: " + cmdId);
            }
        }
        // check if end is used more than once
        if (numEnd > 1) {
            err(chalk_1.default.red(`Command 'end' can only be used once per block but found ${numEnd} times.`));
            stop(1);
        }
        // check if else is used more than once
        if (numElse > 1) {
            err(chalk_1.default.red(`Command 'else' can only be used once per block but found ${numElse} times.`));
            stop(1);
        }
        // check if else is used without if
        if (numElse !== 0 && !blockCommands.find((c) => c[0].startsWith("if"))) {
            err(chalk_1.default.red(`Command 'else' can only be used after 'if' command. Nested statements are not supported.`));
            stop(1);
        }
        // check if else is second last command
        if (blockCommands.find((c) => c[0] === "else") && blockCommands[blockCommands.length - 2][0] !== "else") {
            err(chalk_1.default.red(`Command 'else' must be the last command in a block before 'end'. Nested statements are not supported.`));
            stop(1);
        }
        // true command exist so set template text to content of true command (raw text between trueCmdId and trueCmdId+1)
        if (trueCmdId !== -1) {
            // Example: trueCmdId = 0
            // before  => $$0:0$$ foo $$0:1$$ bar $$0:2$$
            // after   => foo
            const startIndexLength = ("$$" + blockId + ":" + trueCmdId + "$$").length;
            const startIndex = templateText.indexOf("$$" + blockId + ":" + trueCmdId + "$$") + startIndexLength;
            const endIndex = templateText.indexOf("$$" + blockId + ":" + (trueCmdId + 1) + "$$");
            templateText = templateText.substring(startIndex, endIndex);
        }
        else {
            // no true command, so remove completly
            templateText = "";
        }
        // replace raw data with templated data
        data = (0, utils_1.replaceBetween)(data, startIndexMain, endIndexMain, templateText);
    }
    // check if there are still unmatched commands left
    const unmatchedCommands = data.matchAll(/\$\[(.*?)\]\$/g);
    let numUnmatched = 0;
    for (const match of unmatchedCommands) {
        numUnmatched++;
        err(chalk_1.default.red(`Command '${match[0]}' found but it is not part of any block.`));
    }
    if (numUnmatched > 0) {
        err(chalk_1.default.red(`Found ${numUnmatched} unmatched commands. Please check your syntax.`));
        stop(1);
    }
    // output validation result or data
    if (!argv.check) {
        if (argv.output === "stdout") {
            console.log(data);
        }
        else {
            fs.writeFileSync(argv.output, data);
        }
    }
    if (argv.check || argv.verbose) {
        // warn if there are no matches/blocks
        if (processedBlockes === 0) {
            log(chalk_1.default.yellow("No blocks found."));
        }
        else {
            // output processed blocks
            log(chalk_1.default.green(`Processed ${processCmds} commands in ${processedBlockes} blocks.`));
            vlog(chalk_1.default.green(`Syntax OK.`));
        }
    }
    stop(0);
})
    .demandCommand(1)
    .parse();
