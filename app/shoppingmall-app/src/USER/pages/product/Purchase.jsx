import React, { useEffect, useState } from "react";

import { ERROR, ROUTE } from '../../../assets/js/Constants';
import {addToSales} from '../../../api/PurchaseApi';

import { Container, Col, Form, Button, Row } from "react-bootstrap";
import { fetchUserByUserId } from "../../../api/UserAPI";
import { useLocation, useNavigate } from "react-router-dom";

const Purchase = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId;

    const [purchaseData, setPurchaseData] = useState({
        products: location.state.selectedProducts, // product 이름과 cost, 총 total cost만
        user: [], // user name, address만
        totalCost: location.state.totalCost,
    });

    useEffect(() => {
        if (userId) {
              fetchUserByUserId(userId)
              .then((res) => {
                setPurchaseData((prevData) => ({
                  ...prevData,
                  user: res,
                  }));
              })
              .catch((error) => {
                  console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
              });
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updateProducts = purchaseData.products.map((product) => ({
          productId: product.product_id,
          userId: userId,
          quantity: product.quantity,
          totalCost: purchaseData.totalCost,
        }));
    
        addToSales({purchaseProduct: updateProducts})
        .then((res) => {
            if (res) {
                alert("결제가 완료되었습니다. - 아직 미구현 - ")
                navigate(ROUTE.MAIN);          
            }}).catch((error) => {
                alert("다시 시도해주세요.");
                console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
            });
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <h3> 배송정보 </h3>
                <hr/>
                <Form.Group controlId="name" as={Row}>
                    <Col sm={2} className="text-center">
                        <Form.Label>이름</Form.Label>
                    </Col>
                    <Col sm={6}>
                        <Form.Control type="text" value={purchaseData.user.name} readOnly />
                    </Col>
                </Form.Group>
                <Form.Group controlId="adress" as={Row}>
                    <Col sm={2} className="text-center">
                        <Form.Label>주소</Form.Label>
                    </Col>
                    <Col sm={6}>
                        <Form.Control type="text" value={purchaseData.user.address} readOnly />
                    </Col>
                </Form.Group>
                <Form.Group controlId="detail" as={Row}>
                    <Col sm={2}/>
                    <Col sm={6}>
                        <Form.Control type="text" value={purchaseData.user.detail} readOnly />
                    </Col>
                </Form.Group>
                {/*  제품 정보 */}
                {purchaseData.products.map((product, index) => (
                    <React.Fragment key={index}>
                        <Form.Group controlId="productName" as={Row}>
                            <Col sm={2} className="text-center">
                                <Form.Label>제품 이름</Form.Label>
                            </Col>
                            <Col sm={6}>
                                <Form.Control type="text" value={product.name} readOnly />
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="productCost" as={Row}>
                            <Col sm={2} className="text-center">
                                <Form.Label>가격</Form.Label>
                            </Col>
                            <Col sm={6}>
                                <Form.Control type="text" value={product.cost} readOnly />
                            </Col>
                        </Form.Group>
                        <Form.Group controlId="productPurchaseQuantity" as={Row}>
                            <Col sm={2} className="text-center">
                                <Form.Label>개수</Form.Label>
                            </Col>
                            <Col sm={6}>
                                <Form.Control type="text" value={product.quantity} readOnly />
                            </Col>
                        </Form.Group>
                    </React.Fragment>
                ))}
                <Form.Group controlId="totalCost" as={Row}>
                    <Col sm={2} className="text-center">
                        <Form.Label>총 결제금액</Form.Label>
                    </Col>
                    <Col sm={6}>
                        <Form.Control type="text" value={purchaseData.totalCost} readOnly />
                    </Col>
                </Form.Group>
                {/* 결제 버튼 */}
                <Row>
                    <Col sm={9}/>
                    <Col sm={2} style={{marginTop: '5rem'}}>
                        <Button variant="primary" type="submit" style={{ backgroundColor: "#747474", border: "none", marginRight: "0", marginLeft: "auto" }}>
                            결제
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default Purchase;