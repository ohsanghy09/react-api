import { useEffect, useState } from "react";
import tmdbApi from "./api/tmdb";
import "./App.css";

function App() {
  const [keyword, setKeyword] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 화면이 처음 열릴 때 인기 영화 목록 가져오기
  useEffect(() => {
    async function getPopularMovies() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await tmdbApi.get("/movie/popular", {
          params: {
            page: 1,
          },
        });

        setMovies(response.data.results);
      } catch (error) {
        setErrorMessage("인기 영화 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }

    getPopularMovies();
  }, []);

  // 검색 버튼 클릭 시 영화 검색
  async function searchMovies() {
    if (keyword.trim() === "") {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setMovies([]);

      const response = await tmdbApi.get("/search/movie", {
        params: {
          query: keyword,
          page: 1,
        },
      });

      setMovies(response.data.results);
    } catch (error) {
      setErrorMessage("영화 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Option A — 영화 검색 앱 (TMDB API)</h1>

      <section className="card">
        <div className="search-box">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="영화 제목 입력"
          />

          <button onClick={searchMovies}>검색</button>
        </div>

        {loading && <p>로딩 중...</p>}

        {errorMessage && <p className="error">{errorMessage}</p>}

        <div className="movie-list">
          {movies.map((movie) => (
            <article key={movie.id} className="movie-card">
              {movie.poster_path ? (
                <img
                  src={`${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-image">이미지 없음</div>
              )}

              <div>
                <h2>{movie.title}</h2>
                <p>{movie.overview || "줄거리 정보가 없습니다."}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;