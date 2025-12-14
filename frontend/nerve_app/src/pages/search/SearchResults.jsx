import "./SearchResults.scss";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Posts from "../../components/posts/Posts";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const initialFilterParam = searchParams.get("filter") || "all";

  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [challengeMap, setChallengeMap] = useState({});
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  const [showFilters, setShowFilters] = useState(initialFilterParam === "challenge");

  const [filters, setFilters] = useState(() => ({
    searchIn: initialFilterParam, // all, title, content, username, challenge
    sortBy: "recent",
  }));

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

  // Batch-fetch challenges referenced by results
  useEffect(() => {
    const ids = Array.from(new Set(results.map(p => p.challengeId).filter(Boolean)));
    if (ids.length === 0) {
      setChallengeMap({});
      setLoadingChallenges(false);
      return;
    }
    let mounted = true;
    setLoadingChallenges(true);
    (async () => {
      try {
        const entries = await Promise.all(ids.map(async id => {
          try {
            const res = await fetch(`http://localhost:8080/api/challenges/${id}`);
            if (!res.ok) return [id, null];
            const data = await res.json();
            return [id, data];
          } catch (err) {
            return [id, null];
          }
        }));
        if (!mounted) return;
        const map = {};
        for (const [id, data] of entries) {
          if (data) map[id] = data;
        }
        setChallengeMap(map);
      } catch (err) {
        if (mounted) setChallengeMap({});
      } finally {
        if (mounted) setLoadingChallenges(false);
      }
    })();
    return () => { mounted = false; };
  }, [results]);

  // Apply filters and sorting. When filtering by challenge, use challengeMap (title/genre)
  useEffect(() => {
    const queryLower = query.toLowerCase();
    const filtered = results.filter(post => {
      switch (filters.searchIn) {
        case "title":
          return (post.title || "").toLowerCase().includes(queryLower);
        case "content":
          return (post.content || "").toLowerCase().includes(queryLower);
        case "username":
          // username not present on post; backend should handle this ideally
          return true;
        case "challenge":
          if (!post.challengeId) return false;
          const ch = challengeMap[post.challengeId];
          if (!ch) return false;
          return ((ch.title || "").toLowerCase().includes(queryLower) || (ch.genre || "").toLowerCase().includes(queryLower));
        default:
          return true;
      }
    });

    if (filters.sortBy === "popular") {
      filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (filters.sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredResults(filtered);
  }, [results, filters, query, challengeMap]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({ searchIn: "all", sortBy: "recent" });
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
        <button className="filterToggle" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="filterPanel">
          <div className="filterGroup">
            <label>Search In:</label>
            <select value={filters.searchIn} onChange={(e) => handleFilterChange('searchIn', e.target.value)}>
              <option value="all">All Fields</option>
              <option value="title">Title Only</option>
              <option value="content">Content Only</option>
              <option value="username">Creator Username</option>
              <option value="challenge">Challenge Title/Genre</option>
            </select>
          </div>

          <div className="filterGroup">
            <label>Sort By:</label>
            <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
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
