"use server";

import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

// 問題集タイトル生成関数
export const generateQuizTitle = async (file: string) => {
  const result = await generateObject({
    model: anthropic("claude-4-sonnet-20250514"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the file provided as context, and the language of the file"
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " +
      file,
  });
  return result.object.title;
};
