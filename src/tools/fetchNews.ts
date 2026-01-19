import axios from "axios";

const NEWS_API_KEY = process.env.NEWS_API_KEY!;
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

// Cache for storing fetched news
let newsCache: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface NewsArticle {
    title: string;
    source: string;
    publishedAt: string;
    description?: string;
    url?: string;
    author?: string;
}

/**
 * Fetch top 10 US news headlines
 */
export async function fetchTopHeadlines(
    category?: string,
): Promise<NewsArticle[]> {
    try {
        // Check cache
        const now = Date.now();
        if (newsCache.length > 0 && now - lastFetchTime < CACHE_DURATION) {
            console.error("Returning cached news");
            return newsCache.map((article) => ({
                title: article.title,
                source: article.source.name,
                publishedAt: article.publishedAt,
            }));
        }

        // Fetch fresh news
        console.error("Fetching fresh news from API");
        const params: any = {
            country: "us",
            pageSize: 10,
            apiKey: NEWS_API_KEY,
        };

        if (category) {
            params.category = category;
        }

        const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
            params,
        });

        if (response.data.status !== "ok") {
            throw new Error(
                `News API error: ${response.data.message || "Unknown error"}`,
            );
        }

        // Update cache
        newsCache = response.data.articles;
        lastFetchTime = now;

        // Return simplified headlines
        return newsCache.map((article) => ({
            title: article.title,
            source: article.source.name,
            publishedAt: article.publishedAt,
        }));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to fetch news: ${error.message}`);
        }
        throw error;
    }
}

/**
 * Get detailed information about a specific news article
 */
export async function getNewsDetails(
    title: string,
): Promise<NewsArticle | null> {
    try {
        // First check cache
        if (newsCache.length > 0) {
            const article = newsCache.find(
                (a) => a.title.toLowerCase() === title.toLowerCase(),
            );
            if (article) {
                return {
                    title: article.title,
                    source: article.source.name,
                    publishedAt: article.publishedAt,
                    description:
                        article.description || "No description available",
                    url: article.url,
                    author: article.author || "Unknown",
                };
            }
        }

        // If not in cache, search for it
        console.error(`Searching for article: ${title}`);
        const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
            params: {
                q: title,
                pageSize: 1,
                language: "en",
                sortBy: "relevancy",
                apiKey: NEWS_API_KEY,
            },
        });

        if (
            response.data.status !== "ok" ||
            response.data.articles.length === 0
        ) {
            return null;
        }

        const article = response.data.articles[0];
        return {
            title: article.title,
            source: article.source.name,
            publishedAt: article.publishedAt,
            description: article.description || "No description available",
            url: article.url,
            author: article.author || "Unknown",
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to fetch news details: ${error.message}`);
        }
        throw error;
    }
}
