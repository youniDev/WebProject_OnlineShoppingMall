import axios from "axios";

export const ProductApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 장바구니에 제품을 등록
 * @param {object} cart - 장바구니에 등록할 제품 정보를 담은 객체
 * @returns 
 */
export const addToCart = async ({cart}) => {
    const response = await ProductApi.post(`/api/cart/product`, cart);
    return response.data;
}

/**
 * 장바구니에서 제품 삭제
 * @param {object} cart - 장바구니에서 삭제할 제품 정보를 담은 객체
 * @returns 
 */
export const deleteToCart = async ({cart}) => {
    const response = await ProductApi.post(`/api/cart/delete/product`, cart);
    return response.data;
}

/**
 * 사용자 ID를 기준으로 장바구니에 담긴 제품 조회
 * @param {string} userId - 장바구니를 조회할 사용자의 ID
 * @returns - 장바구니에 담긴 제품 정보를 담은 객체
 */
export const fetchCartProductsByUserId = async (userId) => {
    const response = await ProductApi.post(`/api/fetch/product`, userId);
    return response.data;
}

/**
 * 판매 내역에 판매된 제품 등록
 * @param {object} purchaseProduct - 추가할 제품 정보를 담은 객체
 * @returns 
 */
export const addToSales = async ({ purchaseProduct }) => {
    const response = await ProductApi.post(`/api/purchase/product`, purchaseProduct);
    return response.data;
}

/**
 * 사용자 ID에 해당하는 주문 정보 조회
 * @param {string} userId - 조회할 사용자의 ID
 * @returns - 조회된 주문 정보를 담은 객체
 */
export const fetchDeliveryStatusByUserId = async (userId) => {
    const response = await ProductApi.post(`api/fetch/purchaseOrder/shippingStatus`, userId);
    return response.data;
}

/**
 * 주문 ID에 해당하는 구매 정보 조회
 * @param {string[]} orderIds - 조회할 주문의 ID 배열
 * @returns - 구매 정보를 담은 객체
 */
export const fetchSalesProductsByOrderId = async (orderIds) => {
    const response = await ProductApi.post(`api/fetch/sales/purchaseProduct`, orderIds);
    return response.data;
}