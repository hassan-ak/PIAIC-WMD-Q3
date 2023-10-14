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

const text = `
In a charming village, siblings Jack and Jill set out on \ 
a quest to fetch water from a hilltop \ 
well. As they climbed, singing joyfully, misfortune \ 
struck—Jack tripped on a stone and tumbled \ 
down the hill, with Jill following suit. \ 
Though slightly battered, the pair returned home to \ 
comforting embraces. Despite the mishap, \ 
their adventurous spirits remained undimmed, and they \ 
continued exploring with delight.
`

const prompt = `
Perform the following actions: 
1 - Summarize the following text delimited by triple \
quotes with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the following \
keys: french_summary, num_names.

Separate your answers with line breaks.

Text:
"""${text}"""
`

main(prompt);

