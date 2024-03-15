import React, { useState } from 'react';

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";

import RegistrationUser from '../../../component/layout/RegistrationUser';
import { SIGNUP } from '../../../assets/js/Constants';
import "../../../assets/css/signup.css"
import { Container } from 'react-bootstrap';

function Signup() {
    return (
        <>
        <Header/>
                <Container fluid><h3 style={{marginTop: '5rem', marginLeft: '12%'}}>회원가입</h3> </Container>
                <div style={{marginTop: '5rem'}}>
                    <RegistrationUser userInfo={SIGNUP.INIT_USER} />
                </div>
        <Footer/ >
        </>
    );
};


export default Signup;