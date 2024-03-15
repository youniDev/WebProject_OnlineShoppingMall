import axios from "axios";

export const AuthApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 로그인 요청을 처리하는 함수
 * @param {Object} param0 로그인에 필요한 이메일(email)과 비밀번호(password)
 * @returns {Promise<Object>} 로그인 요청에 대한 응답 데이터
 */
export const login = async ({ email, password }) => {
    const data = { email, password };
    const response = await AuthApi.post(`/api/signin`, data);

    return response.data;
}

/*
* 네이버 로그인, 허가된 이메일만 로그인 가능
* 네이버로부터 인증 코드를 얻기 위한 함수
*/
export const getCodeByNaver = () => {
    const NAVER_AUTH_URL = `http://localhost:8080/oauth/naver`;

    goToUrl(NAVER_AUTH_URL);
}


/**
 * 네이버로부터 액세스 토큰을 얻기 위한 함수
 * @param {string} code 네이버로부터 받은 코드
 * @returns {Promise<any>} 네이버로부터 받은 토큰 데이터
 */
export const getAccessTokenByNaver = async (code) => {
    const response = await axios.get(`http://localhost:8080/oauth/login/naver?code=${code}`);

    return response.data;
}

/**
 * 네이버 OAuth 인증 로그인
 */
export const NaverApi = axios.create({
    baseURL: 'https://nid.naver.com/oauth2.0/authorize',
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
* 카카오 로그인, 허가된 이메일만 로그인 가능
* 카카오로부터 인증 코드를 얻기 위한 함수
*/
export const getCodeByKakao = () => {
    const KAKAO_AUTH_URL = `http://localhost:8080/oauth/kakao`;

    goToUrl(KAKAO_AUTH_URL);
}

/**
 * 
 * @param {string} code 카카오로부터 받은 인증 코드
 * @returns 카카오로부터 받은 토큰 데이터
 */
export const getAccessTokenByKakao = async (code) => {
    const response = await axios.get(`http://localhost:8080/oauth/login/kakao?code=${code}`);

    return response.data;
}

/*
* 구글 로그인, 허가된 이메일만 로그인 가능
* 구글로부터 인증 코드를 얻기 위한 함수
*/
export const getCodeByGoogle = () => {
    const GOOGLE_AUTH_URL = `http://localhost:8080/oauth/google`;

    goToUrl(GOOGLE_AUTH_URL);
}

/**
 * 
 * @param {string} code 구글로부터 받은 인증 코드
 * @returns 구글로부터 받은 토큰 데이터
 */
export const getAccessTokenByGoogle = async (code) => {
    const response = await axios.get(`http://localhost:8080/oauth/login/google?code=${code}`);

    return response.data;
}

const goToUrl = (url) => {
    window.location.href = url;
}