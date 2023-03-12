import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import * as fs from "fs";

const log = console.log;

yargs(hideBin(process.argv))
  .scriptName("upp")
  .usage("Universal Pre-Processor ('upp') is a tool for preprocessing files.")
  .epilogue("for more info and support visit https://github.com/adrianschubek/upp")
  .version("0.1.0")
  // .command("check <file>", "checks the preprocessor", (builder) => {})
  .command(
    ["run <file>", "$0"],
    "runs the preprocessor",
    (builder) => {
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
    },
    (argv) => {
      log(argv);
      if (!fs.existsSync(argv.file)) log(chalk.red("File does not exist!"));
      if (argv.output === "stdout") {
        log(chalk.yellow("Outputting to stdout..."));
      }

      
    }
  )
  .option("verbose", {
    describe: "verbose output",
    type: "boolean",
    default: false,
  })
  .demandCommand(1)
  .parse();
