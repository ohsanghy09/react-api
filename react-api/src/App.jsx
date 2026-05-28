import { useEffect, useState } from "react";
import tmdbApi from "./api/tmdb";
import "./App.css";

function App() {

  // 검색 키워드
  const [keyword, setKeyword] = useState("");

  // 영화 배열
  const [movies, setMovies] = useState([]);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState("");

  // 화면이 처음 열릴 때 인기 영화 목록 가져오기
  useEffect(() => {

    // 다른 부분에서 사용하지 않으므로 처음 화면이 실행됐을 때만 함수를 사용하기 위해서 useEffect 안에서 함수 선언
    async function getPopularMovies() {

      try {
        
        // 로딩 true -> 로딩 중으로 표시
        setLoading(true);

        // 에러메시지 "" 값 할당 -> 화면에 표시 x
        setErrorMessage("");

        // 기본 baseURL에서 tmdb api의 엔드포인트 /movie/popular로 요청을 보내고 응답값을 받음.
        const response = await tmdbApi.get("/movie/popular", {

          // page 1번으로 설정해서
          params: {
            page: 1,
          },
        });

        // setMovies함수에 받아온 결과 배열 넣기
        setMovies(response.data.results);

        // 에러 발생 시 에러 메시지 상태 변화 함수에 메시지 넣기
      } catch (error) {
        setErrorMessage("인기 영화 목록을 불러오지 못했습니다.");
      
        // 에러가 나든 말든, 무조건 실행
      } finally {
        // 로딩 상태변화 함수에 false 넣기
        setLoading(false);
      }
    }


    // 함수 실행
    getPopularMovies();
  }, []);


  // 검색 버튼 클릭 시 영화 검색
  async function searchMovies() {

    // 현재 입력된 부분에서 공백을 제거하고 값이 없으면 경고창 나오게하고 함수 종료
    if (keyword.trim() === "") {
      alert("검색어를 입력해주세요.");
      return;
    }


    try {

      // 로딩 부분 상태변환 함수 true -> 로딩 태그 실행
      setLoading(true);

      // 에러메시지 상태 변환함수 초기화
      setErrorMessage("");

      // 영화 목록 배열 상태변환 함수 초기화
      setMovies([]);

      // search/movie 엔드포인트로 쿼리(검색값을 주고) 쿼리값으로 된 곳의 page 1을 가져오는 걸로
      const response = await tmdbApi.get("/search/movie", {
        params: {
          query: keyword,
          page: 1,
        },
      });

      console.log(response.data.results)

      // 검색 관련 데이터 배열형태로 가져옴
      setMovies(response.data.results);


      // 에러 발생 시 set함수에 메시지 적용 -> set함수는 변경되었고, 값이 있으므로 true이기 때문에 화면에 태그 표시
    } catch (error) {
      setErrorMessage("영화 검색 중 오류가 발생했습니다.");
    
    // 무조건 실행
    } finally {

      // 로딩 상태변화 함수에 false로 설정하여 로딩 중 태그 화면에서 제거
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Option A — 영화 검색 앱 (TMDB API)</h1>

      <section className="card">


        {/* input, button */}
        <div className="search-box">


          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="영화 제목 입력"
          />

          <button onClick={searchMovies}>검색</button>
        </div>


        {/* loading이 True면 태그 화면에 출력 */}
        {loading && <p>로딩 중...</p>}

        {/* errorMessage가 True면 화면에 p 태그 화면에 출력 */}
        {errorMessage && <p className="error">{errorMessage}</p>}


        <div className="movie-list">


          {/* movies의 배열에서 하나의 객체를 map으로 펼쳐서 하나의 객체를 movie로 설정*/}
          {movies.map((movie) => (

            // article : 하나의 독립적인 콘텐츠 묶음, 영화 카드 목록 하나
            <article key={movie.id} className="movie-card">

              {/* 만약 포스터 패스가 존재하면 */}
              {movie.poster_path ? (

                // src를 통해 해당 포스터 그림을 참조하여 화면에 띄움, alt를 사용하여 나오지 렌더링 실패 시 타이틀이름만 나오게.
                <img
                  src={`${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                />


                // 만약 포스터 패스가 존재하지 않으면 div 태그 나오게 함.
              ) : (
                <div className="no-image">이미지 없음</div>
              )}

              {/* 화면에 해당 객체의 타이틀, 줄 */}
              <div>
                <h2>{movie.title}</h2>
                
                {/* movie.overview가 있으면 그걸 출력 아니면 우측 문구 출력 */}
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