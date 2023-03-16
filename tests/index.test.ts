describe("utpp cli", () => {
  let originalArgv: string[];
  let mockExit: jest.SpyInstance;

  beforeEach(() => {
    // Remove all cached modules. The cache needs to be cleared before running
    // each command, otherwise you will see the same results from the command
    // run in your first test in subsequent tests.
    jest.resetModules();

    // Each test overwrites process arguments so store the original arguments
    originalArgv = process.argv;
    // @ts-ignore
    mockExit = jest.spyOn(process, "exit").mockImplementation((code?: number | undefined) => {});
  });

  afterEach(() => {
    jest.resetAllMocks();

    // Set process arguments back to the original value
    process.argv = originalArgv;
  });

  it("should print version", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    await runCommand("--version");

    expect(consoleSpy).toBeCalledWith("0.3.0");
    expect(mockExit).toBeCalledWith(0);
  });

  it("should print help", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    await runCommand("--help");

    expect(consoleSpy).toBeCalledWith(expect.stringContaining("Usage:"));
    expect(mockExit).toBeCalledWith(0);
  });
});

/**
 * Programmatically set arguments and execute the CLI script
 *
 * @param {...string} args - positional and option arguments for the command to run
 */
async function runCommand(...args: string[]) {
  process.argv = [
    "node", // Not used but a value is required at this index in the array
    "cli.js", // Not used but a value is required at this index in the array
    ...args,
  ];

  // Require the yargs CLI script
  return require("../src/index");
}
