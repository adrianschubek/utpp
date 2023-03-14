import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import * as fs from "fs";
import path from "path";

(async () =>
  await yargs(hideBin(process.argv))
    .scriptName("utpp")
    .usage("Universal Text Pre-Processor ('utpp') is a tool for preprocessing any file\n")
    .usage("Usage: $0 [options] <file> [variables]")
    .epilogue("for more info and support visit https://github.com/adrianschubek/utpp")
    .version()
    .example("utpp -o out.txt input.txt", "runs the preprocessor on input.txt and write output to out.txt")
    .example("utpp input.txt foo=bar", "runs the preprocessor on input.txt and sets variable foo to bar")
    .example('utpp input.txt -m "<#" "#>"', "runs the preprocessor on input.txt and write output to out.txt with markers <# and #>")
    .example("utpp -c input.txt", "validates the syntax of input.txt file")
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
          })
          /*    .option("markers", {
          alias: "m",
          describe: "set markers for preprocessor",
          type: "array",
          default: ["$[", "]$"],
        }) */
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
          .option("eval", {
            type: "boolean",
            default: true,
            hidden: true,
          })
          .option("no-eval", {
            describe: "disables eval function",
            type: "boolean",
          })
          .option("files", {
            type: "boolean",
            default: true,
            hidden: true,
          })
          .option("no-files", {
            describe: "disables inclusion from files",
            type: "boolean",
          })
          .option("urls", {
            type: "boolean",
            default: true,
            hidden: true,
          })
          .option("no-urls", {
            describe: "disables inclusion from urls",
            type: "boolean",
          })
          .option("template", {
            type: "boolean",
            default: true,
            hidden: true,
          })
          .option("no-template", {
            describe: "disables template replacement",
            type: "boolean",
          })
          .option("vars", {
            type: "boolean",
            default: true,
            hidden: true,
          })
          .option("no-vars", {
            describe: "disables variables replacement",
            type: "boolean",
          });
      },
      async (argv: any) => {
        const replaceBetween = (str: string, start: number, end: number, what: string) => {
          return str.substring(0, start) + what + str.substring(end);
        };

        const variables = new Map<string, string>();

        let blockId = 0;

        type RetType = boolean /* | "pass" */;

        const parseArg = async (arg: string, failOnNotFound: boolean = false): Promise<string> => {
          return new Promise(async (resolve) => {
            if (arg.startsWith("env:")) {
              // is env variable
              const envVar = await parseArg(arg.slice(4));
              if (process.env[envVar] === undefined) {
                err(chalk.red(`Environment variable '${envVar}' does not exist.`));
                return stop(1);
              }
              return resolve(process.env[envVar]!);
            } else if (arg.startsWith("file:")) {
              // is file import
              const relativePath = await parseArg(arg.slice(5));

              if (!argv.files) {
                console.log(chalk.red(`Unable to import file '${relativePath}' because option '--no-files' is set`));
                stop(1);
              }

              const fullPath = path.resolve(path.dirname(argv.file) + path.sep + relativePath);
              if (!fs.existsSync(fullPath)) {
                err(
                  chalk.red(`File '${fullPath}' does not exist. Make sure that '${relativePath}' is relative to '${path.dirname(argv.file)}' folder.`)
                );
                stop(1);
              }

              return resolve(fs.readFileSync(fullPath, "utf-8"));
            } else if (arg.startsWith("url:")) {
              // is url import
              const url = await parseArg(arg.slice(4));

              if (!argv.urls) {
                console.log(chalk.red(`Unable to import URL '${url}' because option '--no-urls' is set`));
                stop(1);
              }
              try {
                const response = await fetch(await url);
                if (response.status !== 200) {
                  err(chalk.red(`Unable to import URL '${url}' because it returned status code ${response.status}.`));
                  stop(1);
                }
                return resolve(await response.text());
              } catch (e: any) {
                err(chalk.red(`Unable to import URL '${url}' because of error: ${e.message}`));
                stop(1);
              }
            } else if (arg.startsWith("`") && arg.endsWith("`")) {
              // is javascript
              if (!argv.eval) {
                console.log(chalk.red(`JavaScript evaluation \`${arg}\` is disabled, because option '--no-eval' is set`));
                process.exit(1);
              }
              return resolve(eval(arg.slice(1, -1)));
              // is string
            } else if (arg.startsWith('"') && arg.endsWith('"')) {
              return resolve(arg.slice(1, -1));
              // is variable
            } else if (variables.has(arg)) {
              return resolve(variables.get(arg)!);
              // raw string
            } else {
              if (failOnNotFound) {
                console.log(chalk.red(`Variable '${arg}' is not defined`));
                return stop(1);
              } else return resolve(arg);
            }
          });
        };

        type Command = {
          name: string;
          action: (args: string[]) => Promise<RetType>;
          argsCount: number;
        };

        const commands: Command[] = [
          {
            name: "if",
            action: async (args: string[]): Promise<RetType> => !!(await parseArg(args[0])),
            argsCount: 1,
          },
          {
            name: "ifdef",
            action: async (args: string[]): Promise<RetType> => Promise.resolve(variables.has(args[0])),
            argsCount: 1,
          },
          {
            name: "ifndef",
            action: async (args: string[]): Promise<RetType> => Promise.resolve(!variables.has(args[0])),
            argsCount: 1,
          },
          {
            name: "ifeq",
            action: async (args: string[]): Promise<boolean> => (await parseArg(args[0])) == (await parseArg(args[1])),
            argsCount: 2,
          },
          {
            name: "ifne",
            action: async (args: string[]): Promise<boolean> => (await parseArg(args[0])) != (await parseArg(args[1])),
            argsCount: 2,
          },
          {
            name: "ifgt",
            action: async (args: string[]): Promise<boolean> => (await parseArg(args[0])) > (await parseArg(args[1])),
            argsCount: 2,
          },
          {
            name: "iflt",
            action: async (args: string[]): Promise<boolean> => (await parseArg(args[0])) < (await parseArg(args[1])),
            argsCount: 2,
          },
          {
            name: "ifge",
            action: async (args: string[]): Promise<boolean> => (await parseArg(args[0])) >= (await parseArg(args[1])),
            argsCount: 2,
          },
          {
            name: "ifle",
            action: async (args: string[]): Promise<boolean> => (await parseArg(args[0])) <= (await parseArg(args[1])),
            argsCount: 2,
          },
          // variant: set variable
          {
            name: "ifs",
            action: async (args: string[]): Promise<RetType> => {
              const result = !!(await parseArg(args[0]));
              if (result) variables.set(args[1], await parseArg(args[2]));
              return result;
            },
            argsCount: 3,
          },
          {
            name: "ifdefs",
            action: async (args: string[]): Promise<RetType> => {
              const result = variables.has(args[0]);
              if (result) variables.set(args[1], await parseArg(args[2]));
              return result;
            },
            argsCount: 3,
          },
          {
            name: "ifeqs",
            action: async (args: string[]): Promise<RetType> => {
              const result = (await parseArg(args[0])) == (await parseArg(args[1]));
              if (result) variables.set(args[2], await parseArg(args[3]));
              return result;
            },
            argsCount: 4,
          },
          {
            name: "ifnes",
            action: async (args: string[]): Promise<RetType> => {
              const result = (await parseArg(args[0])) != (await parseArg(args[1]));
              if (result) variables.set(args[2], await parseArg(args[3]));
              return result;
            },
            argsCount: 4,
          },
          {
            name: "ifgts",
            action: async (args: string[]): Promise<RetType> => {
              const result = (await parseArg(args[0])) > (await parseArg(args[1]));
              if (result) variables.set(args[2], await parseArg(args[3]));
              return result;
            },
            argsCount: 4,
          },
          {
            name: "iflts",
            action: async (args: string[]): Promise<RetType> => {
              const result = (await parseArg(args[0])) < (await parseArg(args[1]));
              if (result) variables.set(args[2], await parseArg(args[3]));
              return result;
            },
            argsCount: 4,
          },
          {
            name: "ifges",
            action: async (args: string[]): Promise<RetType> => {
              const result = (await parseArg(args[0])) >= (await parseArg(args[1]));
              if (result) variables.set(args[2], await parseArg(args[3]));
              return result;
            },
            argsCount: 4,
          },
          {
            name: "ifles",
            action: async (args: string[]): Promise<RetType> => {
              const result = (await parseArg(args[0])) <= (await parseArg(args[1]));
              if (result) variables.set(args[2], await parseArg(args[3]));
              return result;
            },
            argsCount: 4,
          },

          {
            name: "else",
            action: async (args: string[]): Promise<boolean> => true,
            argsCount: 0,
          },
          {
            name: "end",
            action: async (args: string[]): Promise<boolean> => false,
            argsCount: 0,
          },
        ];

        // default log
        const log = (message?: any, ...optionalParams: any[]) => {
          if (!argv.quiet) console.log(message, ...optionalParams);
        };

        // error log (even if quiet)
        const err = (message?: any, ...optionalParams: any[]) => {
          console.log(message, ...optionalParams);
        };

        // verbose log (uses default log)
        const vlog = (message?: any, ...optionalParams: any[]) => {
          if (argv.verbose) log(message, ...optionalParams);
        };

        const stop = (exitCode: number = 0): never => {
          if (exitCode !== 0 && !argv.verbose) {
            log(chalk.grey("Turn on verbose mode for more info (-v)"));
          }
          process.exit(exitCode);
        };

        // parse variables from cli
        for (const arg of argv._) {
          const [key, value] = arg.toString().split(/=(.*)/s);
          vlog(`Setting variable '${key}' to '${value}'`);
          variables.set(key, value ?? "");
        }

        if (argv.file === undefined) {
          err(chalk.red("No file specified."));
          stop(1);
        }

        if (!fs.existsSync(argv.file)) {
          err(chalk.red(`File '${argv.file}' does not exist.`));
          stop(1);
        }

        // raw file data
        let data = fs.readFileSync(argv.file, "utf-8").toString();

        let processCmds = 0;
        let processedBlocks = 0;

        if (argv.template) {
          const blockMatches = data.matchAll(/(\$\[(.*?)\]\$)([\w\W]*?)(\$\[end\]\$)/g) || [];

          for (const block of blockMatches) {
            processedBlocks++;
            blockId++;
            vlog(">> NEXT BLOCK ");
            const matches = block[0].matchAll(/\$\[(.*?)\]\$/g);

            // block index in main raw data
            const startIndexMain = data.indexOf(block[0]);
            const endIndexMain = startIndexMain + block[0].length;

            let templateText = block[0].replaceAll(
              /\$\[(.*?)\]\$/g,
              (() => {
                let number = 0;
                return () => {
                  return "$$" + blockId + ":" + number++ + "$$";
                };
              })()
            );
            vlog(templateText);

            /*  später dann $$1$$ bis $$2$$  replace 1...2 */

            // log(block);

            let numElse = 0,
              numEnd = 0,
              cmdId = -1,
              trueCmdId = -1;
            const blockCommands = [];
            // validate command matches
            for (const match of matches) {
              cmdId++;
              //  split by space or quotes [^\s"`]+|"([^"]*)"|`([^`]*)`
              // parse args
              const cmdArgs: string[] = [];
              for (const _m of match[1].trim().matchAll(/[^\s"`]+|"([^"]*)"|`([^`]*)`/g)) cmdArgs.push(_m[0].trim());
              blockCommands.push(cmdArgs);
              vlog(cmdArgs);

              const command = commands.find((c) => c.name === cmdArgs[0].trim());
              if (!command) {
                err(chalk.red(`Command '${cmdArgs[0]}' does not exist.`));
                stop(1);
                process.exit(1); /* to fix typescirpt error incorrectly assuming command can still be undefined afterwards */
              }

              // check if command arguments count is correct
              if (command.argsCount !== cmdArgs.length - 1) {
                err(chalk.red(`Command '${command.name}' expects ${command.argsCount} arguments but got ${cmdArgs.length - 1}.`));
                stop(1);
              }

              if (command.name === "end") ++numEnd;
              if (command.name === "else") ++numElse;
              processCmds++;

              // evaluate command and return of first 'true' command
              const result = await command.action(cmdArgs.slice(1));
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
              err(chalk.red(`Command 'end' can only be used once per block but found ${numEnd} times.`));
              stop(1);
            }

            // check if else is used more than once
            if (numElse > 1) {
              err(chalk.red(`Command 'else' can only be used once per block but found ${numElse} times.`));
              stop(1);
            }

            // check if else is used without if
            if (numElse !== 0 && !blockCommands.find((c) => c[0].startsWith("if"))) {
              err(chalk.red(`Command 'else' can only be used after 'if' command. Nested statements are not supported.`));
              stop(1);
            }

            // check if else is second last command
            if (blockCommands.find((c) => c[0] === "else") && blockCommands[blockCommands.length - 2][0] !== "else") {
              err(chalk.red(`Command 'else' must be the last command in a block before 'end'. Nested statements are not supported.`));
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
            } else {
              // no true command, so remove completly
              templateText = "";
            }
            // replace raw data with templated data
            data = replaceBetween(data, startIndexMain, endIndexMain, templateText);
          }

          // check if there are still unmatched commands left
          const unmatchedCommands = data.matchAll(/\$\[(.*?)\]\$/g);
          let numUnmatched = 0;
          for (const match of unmatchedCommands) {
            numUnmatched++;
            err(chalk.red(`Command '${match[0]}' found but it is not part of any block.`));
          }
          if (numUnmatched > 0) {
            err(chalk.red(`Found ${numUnmatched} unmatched commands. Please check your syntax.`));
            stop(1);
          }
        }

        // replace variables ${}$ with their values
        if (argv.vars) {
          // save all variables matches in array
          const variables: string[] = [];
          for (const _m of data.matchAll(/\$\{(.*?)\}\$/g)) variables.push(_m[0].trim());

          log("Matches: ");
          log(variables);

          // replace all variables in raw data with placeholder
          data = data.replaceAll(
            /\$\{(.*?)\}\$/g,
            (() => {
              processCmds++;
              processedBlocks++;

              let number = 0;
              return () => {
                return "$$var:" + number++ + "$$";
              };
            })()
          );

          // foreach variable match: parse
          for (let i = 0; i < variables.length; i++) {
            variables[i] = await parseArg(variables[i].slice(2, -2), true);
          }

          // replace all placeholders with variable values
          let varCtr = 0;
          data = data.replaceAll(/\$\$(.*?)\$\$/g, () => {
            return variables[varCtr++];
          });
        }

        // output validation result or data
        if (!argv.check) {
          if (argv.output === "stdout") {
            console.log(data);
          } else {
            fs.writeFileSync(argv.output, data);
          }
        }

        if (argv.check || argv.verbose) {
          // warn if there are no matches/blocks
          if (processedBlocks === 0) {
            log(chalk.yellow("No blocks found."));
          } else {
            // output processed blocks
            log(chalk.green(`Processed ${processCmds} commands in ${processedBlocks} blocks.`));
            log(chalk.green(`Syntax OK.`));
          }
        }

        stop(0);
      }
    )
    .demandCommand(1)
    .parse())();
