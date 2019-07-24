module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier/flowtype",
    "prettier/react",
    "prettier/standard"
  ],
  plugins: ["@typescript-eslint", "react", "prettier"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/member-delimiter-style": ["off"],
    "@typescript-eslint/explicit-member-accessibility": ["off"],
    "@typescript-eslint/no-explicit-any": ["warn"],
    "@typescript-eslint/no-parameter-properties": ["off"],
    "@typescript-eslint/no-use-before-define": ["off"],
    "@typescript-eslint/camelcase": ["warn"],
    "@typescript-eslint/no-empty-interface": ["warn"],
    "@typescript-eslint/no-object-literal-type-assertion": ["warn"],
    "@typescript-eslint/no-var-requires": ["warn"],
    "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
    "linebreak-style": ["error", "unix"],
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: ["block-like"], next: ["*"] },
      { blankLine: "always", prev: ["*"], next: ["function", "class"] }
    ],
    quotes: ["error", "double"],
    semi: ["error", "never"],
    "prettier/prettier": [
      "error",
      {
        semi: false,
        printWidth: 120,
        endOfLine: "lf"
      }
    ]
  }
}
