import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

export default [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    name: "prettier",
    rules: prettierConfig.rules,
  },
];
