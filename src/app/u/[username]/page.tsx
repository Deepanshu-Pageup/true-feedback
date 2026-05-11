"use client";

import React, { useState , useEffect} from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
// import {useCompletion} from '@ai-sdk/react';
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Joyride , Step } from "react-joyride";


const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [runTour , setRunTour] = useState(false);
  const [completion , setCompletion] = useState(initialMessageString)
  const [isSuggestLoading , setIsSuggestLoading] = useState(false)
  const [suggestError , setSuggestError] = useState<string | null>(null)

  const steps: Step[] = [
    {
      target: '.input-message',
      content: `write your anonymous message here to share it with ${username}!`,
      placement: 'bottom',
    },
    {
      target: '.suggest-message',
      content: 'Use this suggestion if you are currently not getting questions.',
    },
    {
      target: '.create-account',
      content: 'click here to enter a world of anonymous messages.',
    }
  ];

  // const {
  //   complete,
  //   completion,
  //   isLoading: isSuggestLoading,
  //   error,
  // } = useCompletion({
  //   api: "/api/suggest-messages",
  //   initialCompletion: initialMessageString,
  // });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message.trim(), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      setIsSuggestLoading(true);
      setSuggestError(null)
     const response = await fetch("/api/suggest-messages" , {
      method: "POST",
      headers: {
        "Content-type": "application-json"
      },
      body: JSON.stringify({prompt: ''})
     });

     if(!response.ok) throw new Error('Failed to get the Suggestion messages');
     if(!response.body) throw new Error('No response body');

     const reader = response.body.getReader();
     const decoder = new TextDecoder();

     let result = "";

     while(true) {
      const {done , value} = await reader.read();
      if(done) break;
      result += decoder.decode(value , {stream: true});
      setCompletion(result);
     }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setSuggestError("Failed to fetch suggestions");
      toast.error("Failed to fetch suggestions");
    }finally {
      setIsSuggestLoading(false)
    }
  };

  useEffect(() => {
    if(username) {
      setRunTour(true)
    }
  }, [username])
  

  return (
    <div className="container mx-auto my-8 p-6 bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] dark:shadow-[8px_8px_0px_0px_var(--primary)] max-w-4xl">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-center">
        Public Profile Link
      </h1>
       <Joyride
        steps={steps}
        run={runTour}
        continuous  
        options={{
          buttons: ["skip" , "primary" , "back"]
        }}
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 input-message">
        <FieldGroup>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Send Anonymous Message to @{username}</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Send you Anonymous Message Here..."
                  autoComplete="off"
                  // value={}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex justify-center">
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !messageContent}>
              Send It
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4 my-8 suggest-message">
        <div className="space-y-2 ">
          <Button
            type="button"
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestError ? (
              <p className="text-red-500">{suggestError}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  type="button"
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4 ">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button className='create-account'>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
