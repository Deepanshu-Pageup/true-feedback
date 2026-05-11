
import { createGoogleGenerativeAI} from "@ai-sdk/google";
import {streamText} from 'ai'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: google("gemini-2.5-flash"), 
      prompt: prompt,
      system:
        "You are a helpful assistant that suggests short, relevant follow-up messages.",
    });

    if (!result || !result.response) {
      return Response.json(
        {
          success: false,
          message: "Failed to create suggestion messages",
        },
        { status: 403 },
      );
    }

    const response = result.toTextStreamResponse();
    return Response.json({
      success: true,
      message: response
    })
  } catch (error) {
    console.error("Unexpected Error ,", error);
    return Response.json(
      {
        success: false,
        message: "Unexpected error",
      },
      { status: 500 },
    );
  }
}
