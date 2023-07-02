## Code for Craig's Deno Diary blog post:

## [A Comprehensive Guide to Deno KV](https://deno-blog-stage.deno.dev/A_Comprehensive_Guide_to_Deno_KV.2023-06-30)

## Deno tasks to run the code example files

- **crud**: shows how to do CRUD operations using KV

`deno run --unstable crud.ts`

- **lists**: shows how to list objects in KV using `list()`

`deno run --unstable lists.ts`

- **get-many**: Shows how to call `getMany()` in KV

`deno run --unstable get-many.ts`

- **atomic**: Shows how to do transactions using the KV `atomic()` method

`deno run --unstable atomic.ts`

- **sec-index**: shows how to create secondary indexes in KV

`deno run --unstable secondary-index.ts`

- **page**: shows how to do pagination in KV

`deno run --unstable pagination.ts`

- **sort**: shows how to do sorting in KV

`deno run --unstable sort.ts`

- **sort-dup**: shows how to avoid misses when sorting in KV

`deno run --unstable sort-dup.ts`

- **history**: shows how to display the history of record version in KV

`deno run --unstable record-history.ts`

- **key-order**: Shows how keys are ordered

`deno run --unstable key-order.ts`

- **min-max-sum**: shows how to use `min`, `max` and `sum` methods that are
  chained to the `atomic` function.

`deno run --unstable min-max-sum.ts`

- **queue**: shows KV queue functionality

`deno run --unstable queue.ts`
