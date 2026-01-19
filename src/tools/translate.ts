import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Translate English text to Korean using OpenAI GPT
 * Provides high-quality, natural Korean translation
 */
export async function translateToKorean(text: string): Promise<string> {
    try {
        const prompt = `Translate the following English text to Korean. Provide a natural, high-quality translation that reads fluently in Korean:\n\n${text}`;

        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional translator specializing in English to Korean translation. Provide accurate, natural, and culturally appropriate translations.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 2000,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            },
        );

        const translation = response.data.choices[0].message.content.trim();
        return translation;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.error?.message || error.message;
            throw new Error(`Failed to translate text: ${errorMessage}`);
        }
        throw error;
    }
}
