#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import { fetchTopHeadlines, getNewsDetails } from "./tools/fetchNews.js";
import { summarizeNews } from "./tools/summarize.js";
import { translateToKorean } from "./tools/translate.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is required in .env file");
}
if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required in .env file");
}

// Create MCP server instance
const server = new Server(
    {
        name: "mcp-news-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    },
);

// Define available tools
const tools: Tool[] = [
    {
        name: "get_top_headlines",
        description:
            "Fetch the top 10 US news headlines from today. Returns headline, source, and publication time.",
        inputSchema: {
            type: "object",
            properties: {
                category: {
                    type: "string",
                    description:
                        "News category (optional): business, entertainment, general, health, science, sports, technology",
                    enum: [
                        "business",
                        "entertainment",
                        "general",
                        "health",
                        "science",
                        "sports",
                        "technology",
                    ],
                },
            },
        },
    },
    {
        name: "get_news_details",
        description:
            "Get detailed information about a specific news article including full description and URL.",
        inputSchema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "The exact title of the news article",
                },
            },
            required: ["title"],
        },
    },
    {
        name: "summarize_news",
        description:
            "Summarize a news article using AI. Provides a concise summary of the content.",
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "The news text to summarize",
                },
                maxLength: {
                    type: "number",
                    description:
                        "Maximum length of summary in words (default: 100)",
                },
            },
            required: ["text"],
        },
    },
    {
        name: "translate_to_korean",
        description:
            "Translate English news text to Korean with high quality translation.",
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "The English text to translate",
                },
            },
            required: ["text"],
        },
    },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "get_top_headlines": {
                const category = args?.category as string | undefined;
                const headlines = await fetchTopHeadlines(category);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(headlines, null, 2),
                        },
                    ],
                };
            }

            case "get_news_details": {
                const title = args?.title as string;
                if (!title) {
                    throw new Error("Title is required");
                }
                const details = await getNewsDetails(title);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(details, null, 2),
                        },
                    ],
                };
            }

            case "summarize_news": {
                const text = args?.text as string;
                const maxLength = (args?.maxLength as number) || 100;
                if (!text) {
                    throw new Error("Text is required");
                }
                const summary = await summarizeNews(text, maxLength);
                return {
                    content: [
                        {
                            type: "text",
                            text: summary,
                        },
                    ],
                };
            }

            case "translate_to_korean": {
                const text = args?.text as string;
                if (!text) {
                    throw new Error("Text is required");
                }
                const translation = await translateToKorean(text);
                return {
                    content: [
                        {
                            type: "text",
                            text: translation,
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP News Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
