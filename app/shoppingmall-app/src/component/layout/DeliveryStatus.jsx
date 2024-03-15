import React, { useEffect, useState } from 'react';
import { Container} from 'react-bootstrap';

import { fetchSalesProductsByOrderId, fetchDeliveryStatusByUserId } from '../../api/PurchaseApi';
import { ERROR } from '../../assets/js/Constants';
import AddReview from './AddReview';

const DeliveryStatus = ({userId}) => {
    const [delivery, setDelivery] = useState([]);

    useEffect(() => {
        fetchDeliveryStatus(); // 구매 리스트 불러오기
    }, []);

    const fetchDeliveryStatus = () => {
        fetchDeliveryStatusByUserId(userId)
        .then((deliveryStatus) => {
            const orderIds = deliveryStatus.map(order => order.order_id);
            showPurchaseProducts(orderIds, deliveryStatus);
        }).catch((error) => {
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
        })
    }
    const showPurchaseProducts = (orderIds, deliveryStatus) => {
        fetchSalesProductsByOrderId(orderIds)
        .then((res) => {
            const ordersWithProducts = deliveryStatus.map(order => {
                const orderProducts = res
                    .map(innerArray => innerArray.filter(product => product.orderId === order.order_id))
                    .flat(); // flat 메소드를 사용하여 이중 배열을 평탄화
                return { ...order, products: orderProducts };
            });

            console.log(ordersWithProducts);

            setDelivery(ordersWithProducts);

        }).catch((error) => {
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
        })
    }

    return (
        <Container>
            <div>
                {delivery.map((order, orderIndex) => (
                    <div key={orderIndex}>
                        <hr />
                        <div style={{marginTop: '-4rem'}}>
                            <p>Order ID: {order.order_id}</p>
                            <p>Shipping Status: {order.shipping_status}</p>
                        </div>
                        <hr />
                        <div style={{marginBottom: '4rem'}}>
                            {order.products.map((product, productIndex) => (
                                <div key={productIndex}>
                                    <p>Product ID: {product.productId}</p>
                                    <p>Name: {product.name}</p>
                                    <p>Cost: {product.cost}</p>
                                    <p style={{marginBottom: '3rem'}}>Purchase Quantity: {product.purchaseQuantity}</p>
                                    {product.reviewId ? (
                                        <p>이미 리뷰가 작성되었습니다.</p>
                                    ) : (
                                        <AddReview userId={userId} product={product} orderId={order.order_id} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default DeliveryStatus;