# Husky and esLint

Follow the step wise guide to use `husky` and `eslint` for better development experience

1. Install `pnpm` globally

   ```cmd
   npm i -g pnpm
   ```

2. Create a next app and navigate to the newly created app directory

   ```cmd
   npx create-next-app@latest
   ```

3. Install and configure `husky` in the project.

   ```
   pnpm dlx husky-init && pnpm install
   ```

   this will create `.husky` folder in the app. Now update `.husky/pre-commit` and on the last line replace `npm test` with `pnpm test`.

4. Install and configure prettier for tailwind

   ```cmd
   pnpm add -D prettier
   pnpm add -D prettier-plugin-tailwindcss
   pnpm add -D eslint-config-prettier
   ```

   this will create a `.prettierrc.json`. If file not created create one

   ```json
   {
     "trailingComma": "es5",
     "semi": true,
     "tabWidth": 2,
     "singleQuote": true,
     "jsxSingleQuote": true,
     "plugins": ["prettier-plugin-tailwindcss"]
   }
   ```

5. Install eslint in the application

   ```cmd
   pnpm add -D @typescript-eslint/eslint-plugin
   pnpm add -D @typescript-eslint/parser
   ```

6. Update `.eslintrc.json` with the following to define eslint rules

   ```json
   {
     "extends": [
       "next/core-web-vitals",
       "next",
       "prettier",
       "plugin:@typescript-eslint/recommended"
     ],
     "overrides": [],
     "parser": "@typescript-eslint/parser",
     "parserOptions": {
       "ecmaVersion": "latest",
       "sourceType": "module"
     },
     "plugins": ["@typescript-eslint"],
     "rules": {
       "prefer-const": "error",
       "@typescript-eslint/no-unused-vars": [
         "warn",
         {
           "ignoreRestSiblings": true
         }
       ],
       "@typescript-eslint/no-explicit-any": "warn"
     }
   }
   ```

7. Update `package.json` and add following line in the `scripts` object

   ```json
   "prettier": "npx prettier --write .",
   "lint:dev": "eslint ./src -c .eslintrc.json --max-warnings=0",
   "test": "pnpm prettier && pnpm lint:dev && pnpm build"
   ```

8. Now when ever any commit is made the sequence of operation will be as follows
   - format the files according to prettier rules
   - check the files for eslint rules
   - build the app
   - if above three operations are performed successfully, commit the changes

