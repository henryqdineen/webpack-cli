"use strict";

const path = require("path");
// eslint-disable-next-line node/no-unpublished-require
const getPort = require("get-port");
const {
  runWatch,
  isWebpack5,
  normalizeStderr,
  normalizeStdout,
  isDevServer4,
} = require("../../utils/test-utils");

const testPath = path.resolve(__dirname);

describe("basic serve usage", () => {
  let port;

  beforeEach(async () => {
    port = await getPort();
  });

  it("should work", async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--config" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "serve.config.js",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--config" and "--env" options', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "function-with-env.config.js",
      "--env",
      "foo=bar",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("WEBPACK_SERVE: true");
    expect(stdout).toContain("foo: 'bar'");
    expect(stdout).toContain("development");
  });

  it('should work with the "--config" and "--env" options and expose dev server options', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "function-with-argv.config.js",
      "--env",
      "foo=bar",
      "--hot",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("hot: true");
    expect(stdout).toContain("WEBPACK_SERVE: true");
    expect(stdout).toContain("foo: 'bar'");
    expect(stdout).toContain("development");
  });

  it("should work in multi compiler mode", async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "multi.config.js",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("one");
    expect(stdout).toContain("first-output/main.js");
    expect(stdout).toContain("two");
    expect(stdout).toContain("second-output/main.js");
  });

  // TODO need fix in future, edge case
  it.skip("should work in multi compiler mode with multiple dev servers", async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "multi-dev-server.config.js",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("one");
    expect(stdout).toContain("first-output/main.js");
    expect(stdout).toContain("two");
    expect(stdout).toContain("second-output/main.js");
  });

  it('should work with the "--mode" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("development");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--stats" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--stats"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain(isWebpack5 ? "compiled successfully" : "Version: webpack");
  });

  it('should work with the "--stats verbose" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--stats", "verbose"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    const isMacOS = process.platform === "darwin";

    if (!isMacOS) {
      expect(stdout).toContain(
        isWebpack5 ? "from webpack.Compiler" : "webpack.buildChunkGraph.visitModules",
      );
    }
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--mode" option #2', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--mode", "production"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("production");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--mode" option #3', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--mode", "development"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("development");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--progress" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--progress"]);

    expect(stderr).toContain("webpack.Progress");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--progress" option using the "profile" value', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--progress", "profile"]);

    expect(stderr).toContain("webpack.Progress");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--client-log-level" option', async () => {
    const { stdout, stderr } = await runWatch(testPath, [
      "serve",
      isDevServer4 ? "--client-logging" : "--client-log-level",
      "info",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--port" option', async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve", "--port", port]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--hot" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--hot"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--no-hot" option', async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve", "--port", port, "--no-hot"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).not.toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--hot" option using the "only" value', async () => {
    const { stdout, stderr } = await runWatch(testPath, [
      "serve",
      "--port",
      port,
      isDevServer4 ? "--hot=only" : "--hot-only",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with "--hot" and "--port" options', async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve", "--port", port, "--hot"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--hot" and "--progress" options', async () => {
    const { stdout, stderr } = await runWatch(testPath, [
      "serve",
      "--port",
      port,
      "--hot",
      "--progress",
    ]);

    expect(stderr).toContain("webpack.Progress");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the default "publicPath" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--output-public-path" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--output-public-path",
      "/my-public-path/",
      "--stats",
      "verbose",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isWebpack5) {
      expect(stdout).toContain("/my-public-path/");

      if (isDevServer4) {
        expect(stdout).toContain("HotModuleReplacementPlugin");
      } else {
        expect(stdout).not.toContain("HotModuleReplacementPlugin");
      }

      expect(stdout).toContain("main.js");
    } else {
      expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    }
  });

  it('should respect the "publicPath" option from configuration', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "output-public-path.config.js",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
    expect(stdout).toContain("/my-public-path/");
  });

  it('should respect the "publicPath" option from configuration using multi compiler mode', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "multi-output-public-path.config.js",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("one");
    expect(stdout).toContain("first-output/main.js");
    expect(stdout).toContain("two");
    expect(stdout).toContain("second-output/main.js");
    expect(stdout).toContain("/my-public-path/");
  });

  it('should respect the "publicPath" option from configuration (from the "devServer" options)', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "dev-server-output-public-path.config.js",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should work with the "--open" option', async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve", "--open", "--port", port]);

    if (isDevServer4) {
      let normalizedStderr = normalizeStderr(stderr);

      if (/wait until bundle finished/.test(normalizedStderr)) {
        normalizedStderr = normalizedStderr.split("\n");

        const waitIndex = normalizedStderr.findIndex((item) =>
          /wait until bundle finished/.test(item),
        );

        if (waitIndex !== -1) {
          normalizedStderr.splice(waitIndex, 1);
        }

        normalizedStderr = normalizedStderr.join("\n");
      }

      expect(normalizedStderr).toMatchSnapshot("stderr");
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("main.js");
  });

  it('should respect the "publicPath" option from configuration using multi compiler mode (from the "devServer" options)', async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "multi-dev-server-output-public-path.config.js",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("one");
    expect(stdout).toContain("first-output/main.js");
    expect(stdout).toContain("two");
    expect(stdout).toContain("second-output/main.js");
  });

  it("should work with entries syntax", async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "./src/entry.js",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("development");
  });

  it("should work and log warning on the `watch option in a configuration", async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "./watch.config.js",
      "--port",
      port,
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
    }

    expect(stdout).toContain("development");
  });

  it("should log used supplied config with serve", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "log.config.js", "--port", port],
      {
        killString: /Compiler is watching files for updates\.\.\./,
      },
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toBeTruthy();
  });

  it("should log error on using '--watch' flag with serve", async () => {
    const { exitCode, stdout, stderr } = await runWatch(testPath, ["serve", "--watch"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log error on using '-w' alias with serve", async () => {
    const { exitCode, stdout, stderr } = await runWatch(testPath, ["serve", "-w"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log an error on unknown flag", async () => {
    const { exitCode, stdout, stderr } = await runWatch(testPath, [
      "serve",
      "--port",
      port,
      "--unknown-flag",
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it('should work with the "stats" option in config', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--config", "stats.config.js"], {
      killString: /Compiled successfully|modules/i,
    });

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain(isWebpack5 ? "compiled successfully" : "modules");
    expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
  });

  it("should throw error when same ports in multicompiler", async () => {
    const { stderr, stdout } = await runWatch(__dirname, [
      "serve",
      "--config",
      "same-ports-dev-serever.config.js",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });
});
