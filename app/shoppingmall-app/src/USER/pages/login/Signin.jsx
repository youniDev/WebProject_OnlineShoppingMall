import React, { useState } from "react";
import { Container, Row, Col, Form, Button} from "react-bootstrap";

import { login, getCodeByNaver, getCodeByKakao, getCodeByGoogle } from "../../../api/AuthAPI";      // api

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";

// icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
// login brand
import naverBanner from "../../../assets/images/btnG_naver.png";

import "../../../assets/css/signin.css"
import { ERROR } from "../../../assets/js/Constants";

function Signin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // basic login
    const handleSignin = async (e) => {
        e.preventDefault();

        try {
            const isSuccess = await login(formData);

            localStorage.clear();
            localStorage.setItem('accessToken', isSuccess.accessToken);
            window.location.href = `/`;    
        } catch (error) {
            console.error(ERROR.FAIL_LOGIN[ERROR.TEXT_EN], error);
            alert(ERROR.FAIL_LOGIN[ERROR.TEXT_KR]);
        }
    }

    // naver login
    const handleSigninByNaver = async (e) => {
        e.preventDefault();
    
        getCodeByNaver();
    }

    // google login
    const handleSigninByGoogle = (e) => {
        e.preventDefault();
    
        getCodeByGoogle();
    }

    // kakao login
    const handleSigninByKakao = (e) => {
        e.preventDefault();
    
        getCodeByKakao();
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Header/>
            <main>
                <Container className="rm-10">
                    <Row>
                        <Col md={{ span: 5, offset: 4 }}>
                                <div className="myform form">
                                    <div className="logo mb-3">
                                        <Col md={12} className="text-center">
                                            <h1>Login</h1>
                                        </Col>
                                    </div>
                                    <Form onSubmit={handleSignin}>
                                        <Form.Group>
                                            <Form.Control type="email" name="email" placeholder="아이디" onChange={handleInputChange}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Control type="password" name="password" placeholder="비밀번호" onChange={handleInputChange}/>
                                        </Form.Group>
                                        <Form.Group className="form-custom">
                                            <Form.Check
                                            type="checkbox"
                                            label={
                                                <>
                                                아이디 저장
                                                <div className="find-account">
                                                    <a href="#">아이디 찾기</a>
                                                    <a href="#">/ 비밀번호 찾기</a>
                                                </div>
                                                </>
                                            }
                                            id="remember-me"
                                            />
                                        </Form.Group>
                                        <Col md={12} className="text-center">
                                            <Button type="submit" className="btn btn-block mybtn btn-primary tx-tfm">
                                                로그인
                                            </Button>
                                        </Col>
                                        <Col md={12}>
                                            <div className="login-or">
                                            <hr className="hr-or" />
                                            <span className="span-or">or</span>
                                            </div>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <p className="text-center">
                                                <Button onClick={handleSigninByGoogle} className="google btn mybtn">
                                                    <FontAwesomeIcon icon={faGoogle}  style={{ marginRight: '5px' }} />
                                                    구글 로그인
                                                </Button>
                                            </p>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <p className="text-center">
                                                <Button onClick={handleSigninByNaver} className="naver btn mybtn">
                                                    <img
                                                        className="login-naver bi-naver"
                                                        src={naverBanner}
                                                        alt="naver_login"
                                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                    />
                                                    네이버 로그인
                                                </Button>
                                            </p>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <p className="text-center">
                                                <Button onClick={handleSigninByKakao} className="kakao btn mybtn">
                                                    <FontAwesomeIcon icon={faComment}  style={{ marginRight: '5px' }} />
                                                    카카오톡 로그인
                                                </Button>
                                            </p>
                                        </Col>
                                        <Form.Group>
                                            <p className="text-center">
                                            Don't have account? <a href="/signup" id="signup">회원가입</a>
                                            </p>
                                        </Form.Group>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </main>
            <Footer/ >
        </>
    );
};

export default Signin;