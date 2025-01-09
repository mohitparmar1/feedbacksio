import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function POST(request: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Missing API key",
            }),
            { status: 500 }
        );
    }

    const prompt =
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    try {
        // Generate text using the generative model
        const response = await generateText({
            model: google('gemini-1.0-pro'),
            prompt: prompt,
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Suggestions generated successfully",
                data: response.text,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error generating suggestions:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error generating suggestions",
            }),
            { status: 500 }
        );
    }
}
