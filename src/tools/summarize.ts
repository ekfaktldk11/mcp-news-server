import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Summarize news text using OpenAI GPT
 */
export async function summarizeNews(
    text: string,
    maxLength: number = 100,
): Promise<string> {
    try {
        const prompt = `Please provide a concise summary of the following news article in approximately ${maxLength} words. Focus on the key facts and main points:\n\n${text}`;

        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional news summarizer. Provide clear, concise, and factual summaries.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: Math.ceil(maxLength * 1.5), // Allow some buffer
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            },
        );

        const summary = response.data.choices[0].message.content.trim();
        return summary;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.error?.message || error.message;
            throw new Error(`Failed to summarize news: ${errorMessage}`);
        }
        throw error;
    }
}
