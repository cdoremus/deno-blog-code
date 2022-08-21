# Using deno-puppeteer with a Deno Fresh webapp

This folder holds the code for the blog post
[End-to-end test a Deno webapp using deno-puppeteer](https://deno-blog.deno.dev/End-to-end_test_a_Deno_webapp_using_deno-puppeteer.2022-08-21)

The [Fresh](https://fresh.deno.dev) app was created with the command:

```
deno run -A -r https://fresh.deno.dev using_deno-puppeteer
cd using_deno-puppeteer
```

### Usage

Launch the webapp:

```
deno task start
```

Run the Puppeteer tests:

```
deno task test
```
