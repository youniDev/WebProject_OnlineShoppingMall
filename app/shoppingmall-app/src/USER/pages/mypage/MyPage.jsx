import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Nav } from 'react-bootstrap';

import { PRODUCT, PURCHASE } from '../../../assets/js/Constants';

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";
import UserDetail from '../../../component/layout/UserDetail';
import Cart from '../../../component/layout/Cart';
import DeliveryStatus from '../../../component/layout/DeliveryStatus';
import ShowProduct from '../../../component/layout/ShowProduct';

const MyPage = () => {
    const { state } = useLocation();
    const [currentTab, setTab] = useState(state.currentTab);

    const menu = [
        { category: '상세정보', content: <UserDetail onRegistrationComplete={() => setTab(PURCHASE.EDIT_USER)} userId={state.userId} />},
        { category: '찜목록', content: <ShowProduct userId={ state.userId } />},
        { category: '장바구니', content: <Cart userId={state.userId} />},
        { category: '배송정보', content: <DeliveryStatus userId={state.userId}/>},
    ];

    return (
        <>    
        <Header />
        <Container fluid>
            <div className="text-center top-space"/>                
            <Row>
                <Col xs={2}>
                    <div className="text-center title-space">
                        <h4>My Page</h4>
                        <hr/>
                    </div>
                    <React.Fragment>
                        <div style={{marginTop: '-4rem'}}></div>
                        {menu.map((item, i) => {
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
        <Footer />
        </>
    );
};

export default MyPage;