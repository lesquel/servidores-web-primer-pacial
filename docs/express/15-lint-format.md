# 15 · Lint y Formato (ESLint + Prettier)

Instala:

```powershell
npm i -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-import
```

`.eslintrc.cjs` ejemplo:

```js
module.exports = {
  env: { node: true, es2021: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: { "import/order": ["warn", { "newlines-between": "always" }] },
  ignorePatterns: ["dist", "node_modules"],
};
```

`.prettierrc` ejemplo:

```json
{ "singleQuote": true, "semi": true, "printWidth": 100 }
```

Scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts",
    "format": "prettier --write ."
  }
}
```
