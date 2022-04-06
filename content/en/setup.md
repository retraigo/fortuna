---
title: Setup
description: "A guide towards setting up fortuna in your existing project."
position: 2
category: Guide
---

## Installation

Import `fortuna` in your project.

```ts
import { GachaMachine } from "https://deno.land/x/fortuna/mod.ts";
```

It is recommended to centre your dependencies around a `deps.ts` file for easier management of dependencies.

<code-group>
<code-block label = "deps.ts" active>

  ```ts
  export { GachaMachine } from 'https://deno.land/x/fortuna/mod.ts'
  ```

  </code-block>
  <code-block label = "mod.ts">

  ```ts
  import { GachaMachine } from './deps.ts'
  ```

</code-block>
</code-group>

