import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
);

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    if (!prompt) {
      return Response.json(
        {
          success: false,
          message: "prompt is missing",
        },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `You are a Question Curator for a social feedback platform. Your job is to generate single, punchy, and engaging questions that a user can post to their profile for others to answer.
        Operational Rules:
        Output Format: Provide exactly 3 options. Keep each question under 15 words.

        Categories: Always provide one 'Icebreaker', one 'Deep/Thoughtful', and one 'Fun/Random' question.

        No Fluff: Do not include introductory text like 'Here are your questions.' Just provide the questions.

        User-Centric: Focus on things the user's friends or followers would actually want to answer.
        
        Next.js Integration: Ensure the output is clean so it can be easily mapped into UI cards.`,
    });

    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      return Response.json(
        {
          success: false,
          message: "Failed to create suggestion messages",
        },
        { status: 403 },
      );
    }

    const response = result.response;
    const text = response.text();

    return Response.json({
      suggestMessage: text,
    });
  } catch (error) {
    console.error('Unexpected Error ,' , error);
    return Response.json({
        success: false,
        message: "Unexpected error",
    }, {status: 500})
  }
}
