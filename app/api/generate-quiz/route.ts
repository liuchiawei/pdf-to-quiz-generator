import { questionSchema, questionsSchema } from "@/lib/schemas";
import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from "ai";

export const maxDuration = 60;
// ユーザーが選んだ問題数でクイズを生成する
export async function POST(req: Request) {
  const { files, questionsLength = 4 } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: anthropic("claude-4-sonnet-20250514"),
    messages: [
      {
        role: "system",
        content: `You are a teacher. Your job is to take a document, and create a multiple choice test (with ${questionsLength} questions) based on the content of the document. Each option should be roughly equal in length. Respond to the language of the document.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a multiple choice test based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: questionSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
