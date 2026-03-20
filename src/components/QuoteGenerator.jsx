import React, { useState, useEffect } from "react";
import "./QuoteGenerator.css";

function QuoteGenerator() {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [likedQuotes, setLikedQuotes] = useState(() => {
    const saved = localStorage.getItem("likedQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Quote
  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://dummyjson.com/quotes/random"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data = await response.json();

      setQuoteData({
        quote: data.quote,
        author: data.author,
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  // Check if current quote is liked
  const isLiked = likedQuotes.some(
    (q) => q.quote === quoteData?.quote
  );

  // Like / Unlike Toggle
  const handleLikeToggle = () => {
    if (!quoteData) return;

    if (isLiked) {
      // Unlike
      setLikedQuotes((prev) =>
        prev.filter((q) => q.quote !== quoteData.quote)
      );
    } else {
      // Like
      setLikedQuotes((prev) => [...prev, quoteData]);
    }
  };

  const removeQuote = (quoteText) => {
    setLikedQuotes((prev) =>
      prev.filter((q) => q.quote !== quoteText)
    );
  };

  const clearAll = () => {
    setLikedQuotes([]);
  };

  const filteredQuotes = likedQuotes.filter((q) =>
    q.quote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = () => {
    if (!quoteData) return;
    navigator.clipboard.writeText(
      `"${quoteData.quote}" - ${quoteData.author}`
    );
    alert("Copied to clipboard!");
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Daily Motivation</h1>

        {loading && <p className="loading">Loading...</p>}

        {error && (
          <>
            <p className="error">{error}</p>
            <button onClick={fetchQuote}>Retry</button>
          </>
        )}

        {!loading && !error && quoteData && (
          <>
            <p className="quote">"{quoteData.quote}"</p>
            <p className="author">— {quoteData.author}</p>

            <div className="buttons">
              <button onClick={fetchQuote}>
                New Quote
              </button>

              <button
                className={isLiked ? "liked" : ""}
                onClick={handleLikeToggle}
              >
                {isLiked ? "❤️ Liked" : "🤍 Like"}
              </button>

              <button onClick={copyToClipboard}>
                📋 Copy
              </button>
            </div>

            <p className="count">
              Total Liked Quotes: {likedQuotes.length}
            </p>
          </>
        )}
      </div>

      <div className="liked-section">
        <h2>Liked Quotes</h2>

        <input
          type="text"
          placeholder="Search liked quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredQuotes.length === 0 ? (
          <p className="empty">No liked quotes found.</p>
        ) : (
          <ul>
            {filteredQuotes.map((q) => (
              <li key={q.quote}>
                <div>
                  <p>"{q.quote}"</p>
                  <small>— {q.author}</small>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeQuote(q.quote)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}

        {likedQuotes.length > 0 && (
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

export default QuoteGenerator;