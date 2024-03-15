import axios from "axios";

export const BoardAPI = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 게시물 등록
 * @param {string} userId - 사용자 ID
 * @param {object} post - 추가할 게시물 정보를 담은 객체
 * @returns 
 */
export const addPost = async(userId, post) => {
    const response = await BoardAPI.post(`/api/add/write`, {userId, post});

    return response.data;
}

/**
 * 게시물 삭제
 * @param {string} postId - 삭제할 게시물의 ID
 * @returns
 */
export const deletePost = async(postId) => {
    const response = await BoardAPI.post(`/api/delete/write`, postId);

    return response.data;
}

/**
 * 게시물에 대한 댓글 등록
 * @param {string} postId - 댓글이 속한 게시물의 ID
 * @param {string} userId - 댓글을 작성한 사용자의 ID
 * @param {string} parentCommentId - 부모 댓글의 ID
 * @param {object} comment - 추가할 댓글의 내용과 이미지 등을 담은 객체
 * @returns 
 */
export const addComment = async(postId, userId, parentCommentId, comment) => {
    const response = await BoardAPI.post(`/api/add/comments`, {userId, postId, parentCommentId, comment});

    return response.data;
}

/**
 * 댓글 삭제
 * @param {string} commentId 삭제할 댓글 ID
 * @returns 
 */
export const deleteComment = async(commentId) => {
    const response = await BoardAPI.post(`/api/delete/comments`, commentId);

    return response.data;
}

/**
 * 특정 게시물에 대한 댓글 조회
 * @param {string} postId - 조회할 게시물의 ID
 * @returns - 조회된 댓글 목록을 담은 객체
 */
export const fetchCommentsByPostId = async(postId) => {
    const response = await BoardAPI.post(`/api/fetch/comments`, postId);

    return response.data;
}

/**
 * 특정 카테고리에 대한 게시물 조회
 * @param {string} category - 조회할 게시물의 카테고리
 * @returns - 조회된 게시물 목록을 담은 객체
 */
export const fetchPostByCategory = async (category) => {
    const response = await BoardAPI.post(`/api/fetch/post/category`, category);

    return response.data;
}