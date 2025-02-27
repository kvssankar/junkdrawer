// utils/urlMetadata.ts
import axios from "axios";

export async function fetchUrlMetadata(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    });

    const html = response.data;

    // Extract metadata using regex patterns
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
    const ogTitleMatch = html.match(
      /<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/
    );
    const descriptionMatch = html.match(
      /<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/
    );
    const ogDescriptionMatch = html.match(
      /<meta[^>]*property="og:description"[^>]*content="([^"]+)"[^>]*>/
    );
    const ogImageMatch = html.match(
      /<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/
    );

    return {
      title: ogTitleMatch?.[1] || titleMatch?.[1] || "",
      description: ogDescriptionMatch?.[1] || descriptionMatch?.[1] || "",
      image: ogImageMatch?.[1] || "",
      url: url,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);

    // Fallback to URL data if fetching fails
    try {
      const urlObj = new URL(url);
      return {
        title: urlObj.hostname,
        description: url,
        image: "",
        url: url,
      };
    } catch {
      return {
        title: "",
        description: "",
        image: "",
        url: url,
      };
    }
  }
}
