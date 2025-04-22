import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";

const deepseek = createDeepSeek({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export const fn = async () => {
  const { text } = await generateText({
    model: deepseek("deepseek-chat"),
    prompt: "Write a short story about the jackel and the camel",
  });
  console.log(text);
};
