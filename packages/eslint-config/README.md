# @nubbix/eslint-config

Configuração compartilhada do ESLint para o monorepo Nubbix.

## Uso

### Base (TypeScript)

Para pacotes/apps TypeScript sem React:

```js
// eslint.config.mjs
import baseConfig from "@nubbix/eslint-config/base";

export default baseConfig();
```

Com opções customizadas:

```js
import { createBaseConfig } from "@nubbix/eslint-config/base";

export default createBaseConfig({
  ignores: ["custom/**"],
  tsconfigPath: "./tsconfig.json",
  files: ["**/*.ts"],
});
```

### React

Para pacotes/apps com React:

```js
// eslint.config.mjs
import reactConfig from "@nubbix/eslint-config/react";

export default reactConfig();
```

Com opções customizadas:

```js
import { createReactConfig } from "@nubbix/eslint-config/react";

export default createReactConfig({
  ignores: ["custom/**"],
  tsconfigPath: "./tsconfig.json",
  files: ["**/*.ts", "**/*.tsx"],
});
```

## Regras

- TypeScript strict mode
- Variáveis não utilizadas (com suporte a prefixo `_`)
- Console warnings
- React JSX (apenas na config React)
