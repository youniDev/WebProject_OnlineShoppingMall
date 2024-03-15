import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

import { PRODUCT } from '../../../assets/js/Constants';

import TotalProductControl from './TotalProductControl'; 
import ProductAddition from './ProductAddition';
import ProductEditor from './ProductEditor';

/**
 *  관리자 페이지로, 상품 관리를 위한 화면 제공
 * 
 * @returns {JSX.Element} - ProductManagement 컴포넌트의 JSX 요소
 */
const ProductManagement = () => {
    const [currentTab, setTab] = useState(PRODUCT.TOTAL_PRODUCT_CONTROL_TAP_INDEX);
    const [productInfo, setProductInfo ] = useState({})

    const menu = [
        { category: '상품전체관리', content: <TotalProductControl onRegistrationComplete={(i) => setTab(i)} 
            productDetail={(info) => setProductInfo(info)}/> },
        { category: '상품등록', content: <ProductAddition onRegistrationComplete={() => setTab(PRODUCT.TOTAL_PRODUCT_CONTROL_TAP_INDEX)} editProduct={PRODUCT.DETAIL} />},
        { category: '상품수정', content: <ProductEditor onRegistrationComplete={() => setTab(PRODUCT.TOTAL_PRODUCT_CONTROL_TAP_INDEX)} productDetail={productInfo} />},
    ];

    return (
        <Container fluid>
            <div className="text-center top-space"/>                
            <Row>
                <Col xs={2}>
                    <div className="text-center title-space">
                        <h4>상품관리</h4>
                        <hr/>
                    </div>
                    <React.Fragment>
                        <div style={{marginTop: '-4rem'}}></div>
                        {menu.map((item, i) => {
                            // '상품수정' 메뉴를 렌더링하지 않음
                            if (item.category === '상품수정') {
                                return null;
                            }
                            return (
                                <Nav.Link 
                                    key={i} 
                                    onClick={() => setTab(i)} 
                                    style={{ 
                                        marginLeft: '1rem', 
                                        textDecoration: currentTab === i ? 'underline' : 'none',
                                    }}>
                                    {item.category}
                                </Nav.Link>
                            );
                        })}
                    </React.Fragment>
                </Col>
                <Col xs={8} className="title-space">
                    <div style={{backgroundColor: "#D5D5D5", padding: '1.5rem', marginTop: '-1.5rem', paddingRight: '2.5rem'}}>
                        <h4 style={{marginLeft:'1rem'}}>{menu[currentTab].category}</h4>
                        <hr/>
                        {menu[currentTab].content}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductManagement;