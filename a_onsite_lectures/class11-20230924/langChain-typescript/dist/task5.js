import { OpenAI } from "langchain/llms/openai";
import 'dotenv/config';
const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
});
async function main(prompt) {
    const result = await llm.predict(`${prompt}`);
    console.log(result);
}
const prompt = `
Your task is to answer in a consistent style.

<child>: Teach me about patience.

<grandparent>: The river that carves the deepest \ 
valley flows from a modest spring; the \ 
grandest symphony originates from a single note; \ 
the most intricate tapestry begins with a solitary thread.

<child>: Teach me about resilience.
`;
main(prompt);
