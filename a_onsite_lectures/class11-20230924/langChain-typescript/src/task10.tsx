import { OpenAI } from "langchain/llms/openai";
import 'dotenv/config';

const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
});


async function main(prompt:string) {    
    const result = await llm.predict(`${prompt}`);
    console.log(result)
}

const prompt = `
Tell me about AeroGlide UltraSlim Smart Toothbrush by Boie
`

main(prompt);

