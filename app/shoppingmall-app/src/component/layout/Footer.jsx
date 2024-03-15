import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // react-router-dom을 사용하여 링크를 만듭니다.
import "../../assets/css/footer.css"


const Footer = () => {
    return (
        <div className="footer-bg-custom" style={{marginTop: "4rem"}}>
            <footer className="py-5">
            <hr />
            <Container>
                <Row className="footer-custom">
                <Col md={3}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="d-block mb-2" role="img" viewBox="0 0 24 24">
                    <title>Product</title>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94" />
                    </svg>
                    <h5>COMPANY. (주)YOUNIDEV</h5>
                    <ul className="list-unstyled text-small">
                        <li><Link to="#" className="link-secondary text-decoration-none">developers. YOUNI</Link></li>
                        <li><Link to="#" className="link-secondary text-decoration-none">address. [12345] 서울특별시</Link></li>
                        <li><Link to="#" className="link-secondary text-decoration-none">male. gum0945@naver.com</Link></li>
                        <li><Link to="#" className="link-secondary text-decoration-none">github</Link></li>
                        <li><Link to="#" className="link-secondary text-decoration-none">instagram</Link></li>
                    </ul>
                    <small className="d-block mb-3 text-body-secondary">&copy; 2023</small>
                </Col>
                <Col md={2}>
                    <h4>소개</h4>
                    <h5>의류 쇼핑몰</h5>
                    <ul className="list-unstyled text-small">
                        <li><Link to="#" className="link-secondary text-decoration-none">자세히보기</Link></li>
                        <li><span className="link-secondary">2023/10/31 ~ 2023/11/07</span></li>
                        <li><span className="link-secondary">developers. YOUNI</span></li>
                    </ul>
                </Col>
                <Col md={2}>
                    <h4>고객센터</h4>
                    <h5>1234-1234</h5>
                    <p>MON - FRI AM 11:00 - PM 5:30</p>
                    <p>(BREAK TIME) PM 12:00 - PM 1:00</p>
                    <p>SAT. SUN. HOLIDAY CLOSE</p>
                </Col>
                <Col md={2}>
                    <h4>계좌</h4>
                    <p>농협 123-1234-1234-12</p>
                    <p>국민 123456-12-123456</p>
                </Col>
                <Col md={3}>
                    <h5>Q&A</h5>
                    <ul className="list-unstyled text-small">
                        <Link to="#" className="link-secondary text-decoration-none">Q&A게시판</Link>
                        <Link to="#" className="link-secondary text-decoration-none">공지사항</Link>
                        <Link to="#" className="link-secondary text-decoration-none">상품문의</Link>
                        <Link to="#" className="link-secondary text-decoration-none">배송문의</Link>
                    </ul>
                </Col>
                </Row>
            </Container>
            </footer>
        </div>
    );
};

export default Footer;