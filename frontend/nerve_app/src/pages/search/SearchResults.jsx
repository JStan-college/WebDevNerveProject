import "./SearchResults.scss";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Posts from "../../components/posts/Posts";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    searchIn: "all", // all, title, content, username, challenge
    sortBy: "recent", // recent, oldest, popular
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:8080/api/posts/search?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch results");
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  useEffect(() => {
    let filtered = [...results];

    // Filter by search field
    if (filters.searchIn !== "all") {
      filtered = filtered.filter(post => {
        const queryLower = query.toLowerCase();
        switch (filters.searchIn) {
          case "title":
            return post.title.toLowerCase().includes(queryLower);
          case "content":
            return post.content.toLowerCase().includes(queryLower);
          case "username":
            // Would need to add username to post data or fetch it
            return true; // This would be handled by backend ideally
          case "challenge":
            // Check if post has a challenge and if it matches
            return post.challengeId ? true : false;
          default:
            return true;
        }
      });
    }

    // Sort results
    if (filters.sortBy === "popular") {
      filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (filters.sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // recent (default)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredResults(filtered);
  }, [results, filters, query]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchIn: "all",
      sortBy: "recent",
    });
  };

  return (
    <div className="searchResults">
      <div className="header">
        <h1>Search Results for "{query}"</h1>
        {!loading && (
          <p className="resultCount">
            {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"} found
          </p>
        )}
        <button 
          className="filterToggle" 
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="filterPanel">
          <div className="filterGroup">
            <label>Search In:</label>
            <select 
              value={filters.searchIn} 
              onChange={(e) => handleFilterChange("searchIn", e.target.value)}
            >
              <option value="all">All Fields</option>
              <option value="title">Title Only</option>
              <option value="content">Content Only</option>
              <option value="username">Creator Username</option>
              <option value="challenge">Challenge Title/Genre</option>
            </select>
          </div>

          <div className="filterGroup">
            <label>Sort By:</label>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <button className="resetBtn" onClick={resetFilters}>Reset Filters</button>
        </div>
      )}

      {loading && <div className="loading">Loading results...</div>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && filteredResults.length > 0 ? (
        <Posts posts={filteredResults} />
      ) : (
        !loading && <div className="noResults">No posts found matching your criteria</div>
      )}
    </div>
  );
};

export default SearchResults;
