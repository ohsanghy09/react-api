import axios from "axios";

// 이름값 바꾼 axios 복사본 생성
const tmdbApi = axios.create({

  // 기본 URL값
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  
  // TMDB API를 사용하기 위해서 인증토큰을 헤더에 넣어서 보냄 -> TMDB쪽 서버에서 인증 후 결과값 반환
  headers: {
    
    // Authorization은 인증 정보를 담는 것, 인증 방식이 Bearer
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },

  // 한국어로 응답값 받아오기 위한 설정
  params: {
    language: "ko-KR",
  },
});

// 파일에서 tmdApi를 기본값으로 import할 수 있도록 설정
export default tmdbApi;