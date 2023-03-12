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
const log = console.log;
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .scriptName("upp")
    .usage("Universal Pre-Processor ('upp') is a tool for preprocessing files.")
    .epilogue("for more info and support visit https://github.com/adrianschubek/upp")
    .version("0.1.0")
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
    });
}, (argv) => {
    log(argv);
    if (!fs.existsSync(argv.file))
        log(chalk_1.default.red("File does not exist!"));
    if (argv.output === "stdout") {
        log(chalk_1.default.yellow("Outputting to stdout..."));
    }
})
    .option("verbose", {
    describe: "verbose output",
    type: "boolean",
    default: false,
})
    .demandCommand(1)
    .parse();
