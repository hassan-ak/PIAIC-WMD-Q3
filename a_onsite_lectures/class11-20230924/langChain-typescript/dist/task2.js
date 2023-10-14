import { OpenAI } from "langchain/llms/openai";
import "dotenv/config";
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
});
async function main(prompt) {
    const result = await llm.predict(`${prompt}`);
    console.log(result);
}
const prompt = `Generate a list of three made-up book titles along \ 
with their authors and genres. 
Provide them in JSON format with the following keys: 
book_id, title, author, genre.`;
main(prompt);
