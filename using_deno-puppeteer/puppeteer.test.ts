/// <reference lib="dom" />

import puppeteer, {
  Browser,
  Page,
} from "https://deno.land/x/puppeteer@14.1.1/mod.ts";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.151.0/testing/bdd.ts";
import {
  assert,
  assertEquals,
  fail,
} from "https://deno.land/std@0.151.0/testing/asserts.ts";
import { readLines } from "https://deno.land/std@0.151.0/io/mod.ts";

/**
 * Run the Fresh server locally.
 *
 * @returns {{close: () => void}}: A handle to the server allowing closing of the server sub-process and
 * stdout/stderr within that.
 */
export async function startAppServer(): Promise<{ close: () => void }> {
  const serverProcess = Deno.run({
    // Fresh command line without the wait flag
    cmd: [Deno.execPath(), "run", "-A", "dev.ts"],
    cwd: Deno.cwd(),
    stdout: "piped",
    stderr: "piped",
  });
  console.log("Waiting for server to start...");
  //  Consume stdout and display some msgs.
  for await (const line of readLines(serverProcess.stdout)) {
    if (line.includes("Listening on http")) {
      console.log(line);
      break;
    }
  }

  return {
    async close() {
      await serverProcess.stdout.close();
      await serverProcess.stderr.close();
      await serverProcess.close();
    },
  };
}

/**
 * Start the puppeteer browser in headless mode
 *
 * @returns {Promise<Browser>}: Resolves to a puppeteer Browser instance
 */
export async function startBrowser(): Promise<Browser> {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  return browser;
}

describe("Puppeteer e2e testing... ", () => {
  let server: { close: () => void };
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await startAppServer();
  });

  afterAll(async () => {
    await server?.close();
  });

  beforeEach(async () => {
    browser = await startBrowser();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page?.close();
    await browser?.close();
  });

  it({
    name: "should display welcome message",
    fn: async () => {
      await page.setViewport({ width: 400, height: 200 });
      await page.goto("http://localhost:8000/", {
        waitUntil: "networkidle2",
      });
      const selection = await page.waitForSelector("body > div > p");
      if (selection) {
        const text = await page?.evaluate(
          (element: HTMLElement) => element.textContent,
          selection,
        );
        assert(text?.startsWith("Welcome"));
      } else {
        fail(`ERROR: Selector not found`);
      }
    },
  });

  it({
    name: "should decrement counter",
    fn: async () => {
      await page.setViewport({ width: 400, height: 200 });
      await page.goto("http://localhost:8000/", {
        waitUntil: "networkidle2",
      });
      // TODO: Get counter text for later decrement comparison
      // click -1 button
      await page.click("body > div > div > button:nth-child(2)");
      // check to see if counter has decremented
      const selection = await page.waitForSelector("body > div > div > p");
      if (selection) {
        const text = await page.evaluate(
          (element: HTMLElement) => element.textContent,
          selection,
        );
        // counter should be 2 now
        assertEquals(text, "2");
      } else {
        fail(`ERROR: Selector not found`);
      }
    },
  });

  it({
    name: "should increment counter",
    fn: async () => {
      await page.setViewport({ width: 400, height: 200 });
      await page.goto("http://localhost:8000/", {
        waitUntil: "networkidle2",
      });
      // TODO: Get counter text for later increment comparison
      // click +1 button
      await page.click("body > div > div > button:nth-child(3)");
      // check to see if counter has decremented
      const selection = await page.waitForSelector("body > div > div > p");
      if (selection) {
        const text = await page.evaluate(
          (element: HTMLElement) => element.textContent,
          selection,
        );
        // counter should be 4 now
        assertEquals(text, "4");
      } else {
        fail(`ERROR: Selector not found`);
      }
    },
  });
});
