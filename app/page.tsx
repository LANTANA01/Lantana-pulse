"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

// Define the shape of a NewsAPI article
interface Article {
  title: string;
  url: string;
  publishedAt: string;
  [key: string]: any;
}

export default function Home() {
  const [topic, setTopic] = useState<string>("");
  const [news, setNews] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Track client-side mount

  // Ensure this runs only on the client after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchNews = async () => {
    if (!topic) {
      alert("Please enter a topic!");
      return;
    }

    setError(null);
    try {
      const apiKey = process.env.NEWS_API_KEY || "53ba405be0c54878a0180c5989732008";
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}&sortBy=publishedAt`,
        {
          params: {
            _t: new Date().getTime(), // Cache-busting, safe on client
          },
        }
      );

      const articles: Article[] = response.data.articles;
      if (articles.length === 0) {
        setError("No articles found for this topic.");
      } else {
        setNews(articles);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
      setError("Failed to fetch news. Please try again later.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  // Render nothing or a loading state until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">🌸</span>
          <h1 className="text-4xl font-bold text-gray-800">Lantana Pulse</h1>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">🌸</span>
        <h1 className="text-4xl font-bold text-gray-800">Lantana Pulse</h1>
      </div>

      <div className="flex w-full max-w-lg mb-6">
        <input
          type="text"
          value={topic}
          onChange={handleInputChange}
          placeholder="Enter a topic (e.g., technology)"
          className="flex-grow p-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <button
          onClick={fetchNews}
          className="p-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="w-full max-w-lg">
        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : news.length > 0 ? (
          <ul className="space-y-4">
            {news.map((article, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-lg font-medium"
                >
                  {article.title}
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  Published: {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">
            No news yet. Enter a topic and click Search!
          </p>
        )}
      </div>
    </div>
  );
}
