import axios from "axios";

let ACCESS_TOKEN = localStorage.getItem("accessToken");

export const UserApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
    },
});

// 토큰 갱신
/*
const refreshAccessToken = async () => {
    const response = await UserApi.get(`/api/v1/auth/refresh`);
    ACCESS_TOKEN = response.data;
    localStorage.setItem('accessToken', ACCESS_TOKEN);
    UserApi.defaults.headers.common['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
}

// 토큰 유효성 검사
UserApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
        await refreshAccessToken();
        return UserApi(originalRequest);
    }
    return Promise.reject(error);
});
*/

/**
 * 회원 등록
 * @param {Object} formData - 등록할 사용자의 정보를 포함하는 객체
 */
export const addUser = async (formData) => {
    const response = await UserApi.post(`/api/send/user-data`, formData);
    return response.data;
}

/**
 * 이메일 중복 검사
 * @param {string} email - 확인할 이메일 주소
 * @returns - 이메일 중복 여부를 나타내는 객체
 */
export const checkEmail = async (email) => {
    const response = await UserApi.post(`/api/check/dup-email`, email);
    return response.data;
}

/**
 * 회원 아이디 정보 조회
 * @returns - 회원 아이디 정보를 담은 객체
 */
export const fetchUser = async () => {
    const response = await UserApi.get(`/api/user/id`);
    return response.data;
}

/**
 * 사용자 ID를 기반으로 회원 주소 조회
 * @param {string} userId - 사용자 ID
 * @returns 회원의 주소 정보를 담은 객체
 */
export const fetchUserByUserId = async (userId) => {
    const response = await UserApi.post(`/api/fetch/purchase/user`, userId);
    return response.data;
}

/**
 * 회원 정보 조회
 * @param {string} userId - 사용자 ID
 * @returns 회원 정보를 담은 객체
 */
export const fetchUserInfo = async (userId) => {
    const response = await UserApi.post(`/api/user`, userId);
    return response.data;
}

/** 회원수정 API */
export const updateUser = async (data) => {
    const response = await UserApi.put(`/api/update/user`, data);
    return response.data;
}

/** 회원탈퇴 API */
export const deleteUser = async () => {
    await UserApi.delete(`/api/v1/user`);
}

/**
 * 사용자의 위시리스트에 선택한 제품 추가
 * @param {string} userId - 사용자 ID
 * @param {string} productId - 등록할 제품 ID
 */
export const addWishListByUserId = async (userId, productId) => {
    const response = await UserApi.post(`/api/add/wishList`, { userId, productId });

    return response.data;
}

/**
 * 사용자의 위시리스트에서 선택한 제품을 삭제
 * @param {string} userId - 사용자 ID
 * @param {string} productId - 삭제할 제품 ID
 */
export const deleteWishListByUserId = async (userId, productId) => {
    const response = await UserApi.post(`/api/delete/wishList`, { userId, productId });

    return response.data;
}

/**
 * 리뷰 등록
 * @param {string} userId - 사용자 ID
 * @param {string} orderId - 주문 ID
 * @param {object} review - 등록할 리뷰 정보를 담은 객체
 * @returns 
 */
export const addProductReview = async (userId, orderId, review) => {
    const response = await UserApi.post(`/api/add/review`, { userId, orderId, review });

    return response.data;
}

/**
 * 작성한 리뷰를 조회
 * @param {string} userId - 사용자 ID
 * @param {string} productId - 제품 ID
 * @param {string} orderId - 주문 ID
 * @returns - 리뷰 정보를 담은 객체
 */
export const fetchReviewWritten = async (userId, productId, orderId) => {
    const response = await UserApi.post(`/api/fetch/written/review`, { userId, orderId, productId });

    return response.data;
}