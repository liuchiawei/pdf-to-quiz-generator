"use client";

import { useState, useEffect } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { questionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import { Link } from "@/components/ui/link";
import { generateQuizTitle } from "./actions";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  const [questionsLength, setQuestionsLength] = useState<number>(4);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker."
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
    );
    console.log(validFiles);

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      }))
    );
    submit({ files: encodedFiles, questionsLength });
    const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
    setTitle(generatedTitle);
  };

  console.log("partialQuestions", JSON.stringify(partialQuestions, null, 2));

  const clearPDF = () => {
    setFiles([]);
  };

  // クイズの進行度を計算する
  const progress = partialQuestions
    ? (partialQuestions.length / questionsLength) * 100
    : 0;

  // 生成問題数チェック
  const isQuestionsComplete = (
    partial: typeof partialQuestions
  ): partial is z.infer<typeof questionsSchema> => {
    return (
      partial !== undefined &&
      partial.length === questionsLength &&
      partial.every((q) => q && q.question && q.options && q.answer)
    );
  };

  // 問題数がユーザー選んだ数になったらクイズを表示
  if (isQuestionsComplete(partialQuestions)) {
    return (
      <Quiz
        title={title ?? "Quiz"}
        questions={partialQuestions}
        clearPDF={clearPDF}
      />
    );
  }

  return (
    <div
      className="h-full min-h-screen w-full flex justify-center items-center text-foreground overflow-hidden"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        console.log(e.dataTransfer.files);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(PDFs only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-md h-fit md:h-full border-none mt-12 bg-stone-50 dark:bg-emerald-800 shadow-xl">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground">
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: "45deg", scale: 0.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              transition={{ type: "spring" }}
              className="rounded-full bg-emerald-500 dark:bg-emerald-700 text-amber-200 p-4 shadow-md"
            >
              <FileUp strokeWidth={1.4} className="size-8" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl text-emerald-800 dark:text-amber-200 uppercase font-black tracking-wide">
              PDF Quiz Generator
            </CardTitle>
            <CardDescription className="text-base text-justify text-stone-500 dark:text-stone-300">
              5MB以下のPDFをアップロードすると、その内容に基づいたインタラクティブなクイズを
              <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
                Claude 4 Sonnet
              </Link>{" "}
              を使用して生成します。
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitWithFiles} className="space-y-4">
            <div
              className={`relative flex flex-col items-center justify-center border border-dashed border-stone-400 rounded-lg p-6 transition-colors hover:bg-stone-200/70 dark:hover:bg-emerald-700/30`}
            >
              <input
                title="Upload PDF"
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp
                strokeWidth={1}
                className="size-8 mb-2 text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground text-center">
                {files.length > 0 ? (
                  <span className="font-medium text-foreground">
                    {files[0].name}
                  </span>
                ) : (
                  <span>Drop your PDF here or click to browse.</span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions-length">問題數量</Label>
              {mounted ? (
                <Select
                  value={questionsLength.toString()}
                  onValueChange={(value: string) =>
                    setQuestionsLength(parseInt(value))
                  }
                >
                  <SelectTrigger
                    id="questions-length"
                    className="border-stone-400 dark:border-stone-400/50"
                  >
                    <SelectValue placeholder="問題数を選択" />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-50 dark:bg-emerald-900">
                    <SelectItem
                      value="3"
                      className="hover:bg-stone-200 dark:hover:bg-emerald-950"
                    >
                      4 問
                    </SelectItem>
                    <SelectItem value="5" className="hover:bg-stone-200 dark:hover:bg-emerald-950">5 問</SelectItem>
                    <SelectItem value="6" className="hover:bg-stone-200 dark:hover:bg-emerald-950">6 問</SelectItem>
                    <SelectItem value="8" className="hover:bg-stone-200 dark:hover:bg-emerald-950">8 問</SelectItem>
                    <SelectItem value="10" className="hover:bg-stone-200 dark:hover:bg-emerald-950">10 問</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex h-9 w-full items-center justify-between rounded-md bg-transparent px-3 py-2 text-sm">
                  {questionsLength} 問
                </div>
              )}
            </div>

            <Button
              type="submit"
              className={`w-full cursor-pointer ${
                mounted && isLoading ? "animate-pulse" : ""
              }`}
              disabled={files.length === 0}
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>クイズを生成中...</span>
                </span>
              ) : (
                "クイズを生成"
              )}
            </Button>
          </form>
        </CardContent>
        {isLoading && (
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="w-full space-y-2">
              <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isLoading ? "bg-yellow-500/50 animate-pulse" : "bg-muted"
                  }`}
                />
                <span className="text-muted-foreground text-center col-span-4 sm:col-span-2">
                  {partialQuestions
                    ? `Generating question ${
                        partialQuestions.length + 1
                      } of ${questionsLength}`
                    : "Analyzing PDF content"}
                </span>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
