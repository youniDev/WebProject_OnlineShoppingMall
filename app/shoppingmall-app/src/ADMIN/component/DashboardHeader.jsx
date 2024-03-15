import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

import { fetchUser } from '../../../api/UserAPI';
import { LOGIN, ERROR, ROUTE } from '../../../assets/js/Constants';


import '../../../assets/css/header.css';

const DashboardHeader = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const accessToken = localStorage.getItem(LOGIN.ACCESS_TOKEN);

    useEffect(() => {
        if (accessToken) {
            fetchUser()
            .then((role) => {
                setUser(role);
                handleAdminClick(role);
            }).catch((error) => {
                console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
                handleAdminClick();
            });
        } else {
            handleAdminClick();
        }

    }, [accessToken]);

    const goToMainPage = () => {
        navigate(ROUTE.MAIN);
    }

    const handleAdminClick = (permission) => {
        if (permission != LOGIN.ADMIN) {
            console.error(ERROR.NO_PERMISSTION[ERROR.TEXT_EN]);
            alert(ERROR.NO_PERMISSTION[ERROR.TEXT_KR]);
            goToMainPage();
        }
    }
  
    const logout = () => {
      if (window.confirm(LOGIN.LOGOUT_MESSAGE)) {
        localStorage.removeItem(LOGIN.ACCESS_TOKEN);
        navigate(ROUTE.MAIN);
      }
    }

    return (
        <header>
            <Navbar bg="light" expand="md" fixed="top" className="border-bottom background-color-custom">
                <Container fluid>
                    <Navbar.Brand href="/">NAME</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarCollapse" />
                    <Navbar.Collapse id="navbarCollapse">
                        <Nav className="me-auto mb-2 mb-md-0">
                            <Nav.Link>회원관리</Nav.Link>
                            <Nav.Link>상품관리</Nav.Link>
                            <Nav.Link>주문관리</Nav.Link>
                            <Nav.Link>카테고리관리</Nav.Link>
                        </Nav>

                        <Nav>
                            <React.Fragment> 
                                <Nav.Link>{user + " 관리자"}</Nav.Link>
                                <Nav.Link onClick={logout}>LOGOUT</Nav.Link>
                            </React.Fragment>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default DashboardHeader;