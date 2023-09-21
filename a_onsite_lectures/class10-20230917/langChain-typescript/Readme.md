# LangChain with Typescript

1. Create and navigate to new directory

   ```cmd
   mkdir langChain-typescript
   cd langChain-typescript
   ```

2. Initiate a node project in the directory

   ```cmd
   npm init -y
   ```

3. Install required packages

   ```cmd
   npm install -S langchain
   npm i dotenv
   npm i --save-dev @types/node
   ```

4. Initiate typescript in the project

   ```cmd
   tsc --init
   ```

5. Update `tsconfig.json` by changing properties as follows

   ```json
   {
     "compilerOptions": {
        ...
       "target": "ES2020", // or higher
       "module": "nodenext"
     }
   }
   ```

6. Update `package.json` and following to it before `scripts`

   ```json
   "type": "module",
   ```

7. Create API key from `open AI`

   1. Login to [Open AI](https://openai.com/)
   2. Navigate to API page
   3. Click your `profile` on the top right corner
   4. Check your free limit from `Usage` tab, if limit expired buy credits or use some different account
   5. Click `View API Keys`
   6. From the left sidebar open `Api Keys`
   7. Create new secret key
   8. Save your generated key

8. Create `.env` file

   ```env
   OPENAI_API_KEY="<OPEN_KEYS_PASTE_HERE>"
   ```

9. Create `.gitignore` file

   ```gitignore
   node_modules
   .env
   ```

10. Create `index.ts` file

    ```ts
    import { OpenAI } from "langchain/llms/openai";
    import "dotenv/config";
    const llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.9,
    });
    async function main() {
      const result = await llm.predict(
        `What would be a good company name for a company that makes colorful socks?`
      );
      console.log(result);
    }
    main();
    ```

11. Transforms TypeScript code into JavaScript code

    ```cmd
    tsc index.ts
    ```

12. Run the app

    ```cmd
    node index.js
    ```

13. Running this code will respond with some answer. In my case I got the following response

    ```cmd
    Socktastik.
    ```
