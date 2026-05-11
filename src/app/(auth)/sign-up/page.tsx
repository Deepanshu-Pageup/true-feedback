"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { signUpValidation } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";

function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const debouncedSetUsername = useDebounceCallback(setUsername, 300);
  useEffect(() => {
    console.log("Form state:", {
      usernameValue: form.watch("username"),
      fieldState: form.formState.errors.username,
      isCheckingUsername,
      usernameMessage,
    });
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${encodeURIComponent(username)}`,
          );

          setUsername(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          const message = axiosError.response?.data?.message;

          // Handle both string and array responses
          if (Array.isArray(message) && message.length > 0) {
            setUsernameMessage(message[0]?.message || "Invalid username");
          } else if (typeof message === "string") {
            setUsernameMessage(message);
          } else {
            setUsernameMessage("Error checking username");
          }
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage("");
      }
    };
    checkUsernameUnique();
  }, [username]);

  console.log(usernameMessage);

  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response) {
        toast("You submitted the following values:", {
          description: (
            <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground text-black">
              <code>{JSON.stringify(data.username, null, 2)}</code>
            </pre>
          ),
          position: "bottom-right",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        });
        router.replace(`/verify/${encodeURIComponent(data.username)}`);
      }
    } catch (error) {
      console.error("Error in signUp of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
              Join Mystry Message
            </h1>
            <p className="text-muted-foreground font-bold">
              Sign up to start your anonymous adventure
            </p>
          </CardHeader>
          <CardContent>
            <form
              id="sign-up"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="username">
                        Enter your User name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="username"
                        aria-invalid={fieldState.invalid}
                        placeholder="eg. user1234"
                        autoComplete="off"
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedSetUsername(e.target.value);
                        }}
                      />
                      {!isCheckingUsername && fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      {isCheckingUsername && (
                        <p className="text-sm text-muted-foreground">
                          Checking username...
                        </p>
                      )}
                      {!isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-sm ${
                            usernameMessage === "Username is unique"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Enter your Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="eg. user@example"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">
                        Enter your password
                      </FieldLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="pr-10" // Add padding so text doesn't overlap the icon
                        />
                        <InputGroupAddon align="inline-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="h-full px-3 py-2 hover:bg-transparent"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button type="submit" form="sign-up" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please
                    wait
                  </>
                ) : (
                  "signup"
                )}
              </Button>
            </Field>
            <div className="text-center text-sm w-full mt-4">
              <p className="text-muted-foreground">
                Already a member?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default page;
