import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

import { fetchUser } from '../../api/UserAPI';
import { BOARD, LOGIN, PRODUCT, PURCHASE, ROUTE } from "../../assets/js/Constants";
import Dropdown from "./Dropdown";
import '../../assets/css/header.css';

const CartIcon = () => (
    <>
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
      <symbol id="cart" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </symbol>
    </svg>
    <svg className="bi" width="24" height="24">
      <use xlinkHref="#cart"/>
    </svg>
  </>
);

const Header = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const ACCESS_TOKEN = localStorage.getItem(LOGIN.ACCESS_TOKEN);

    /**로그인 서비스 
     * ACCESS_TOKEN의 변경이 있을 때 마다 서버에서 인가 절차를 진행 후 사용자 이메일 정보를 받아와 로그인 진행
    */
    useEffect(() => {
      if (ACCESS_TOKEN) {
        fetchUser()
        .then((response) => {
            setUser(response);
            if (props.setUserId) props.setUserId(response);
        }).catch((error) => {
          console.error("LOGIN ERROR " + error);
        });
      }
    }, [ACCESS_TOKEN]);

    const goToDashboard = () => {
      navigate("/dashboard");
    }
    const goToSignin = () => {
      navigate("/signin");
    }
    const goToMypage = () => {
      navigate('/mypage', {state: { userId: user, currentTab: PURCHASE.EDIT_USER}})
    }
  
    const goToSignup = () => {
      navigate("/signup");
    }

    const logout = () => {
      if (window.confirm(LOGIN.LOGOUT_ALTER)) {
        alert(LOGIN.LOGOUT_MSG);
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
                            <Nav.Link className="navbar-appeal" href="#">신상품 5%</Nav.Link>
                            <Nav.Link className="navbar-appeal" href="#">베스트</Nav.Link>
                            <Nav.Link className="navbar-appeal" href="#">오늘출발</Nav.Link>
                            {PRODUCT.CATEGORY.slice(0, -1).map((dropdown) => (
                                <Dropdown key={dropdown.id} dropdown={dropdown}/>
                            ))}
                        </Nav>

                        <Nav>
                            {ACCESS_TOKEN
                            ? (
                            <React.Fragment> {
                              user === "ADMIN" ? (
                                <Nav.Link onClick={goToDashboard}>{user + "관리자"}</Nav.Link>
                              ) : (
                                <React.Fragment>
                                  <Nav.Link href="#">
                                    <CartIcon/>
                                  </Nav.Link>
                                  <Nav.Link onClick={goToMypage}>{user + "님"}</Nav.Link>
                                </React.Fragment>
                              )}
                              <Nav.Link onClick={logout}>LOGOUT</Nav.Link>
                            </React.Fragment>
                            ) : (
                            <React.Fragment>
                              <Nav.Link onClick={goToSignin}>LOGIN</Nav.Link>
                              <Nav.Link onClick={goToSignup}>JOIN</Nav.Link>
                            </React.Fragment>
                          )}
                          {/* 게스트일 경우 해결하는 방법 모색하기 */}
                          {BOARD.CATEGORY.map((dropdown) => (
                              <Dropdown key={dropdown.id} dropdown={dropdown} userId={user}/ >
                          ))}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;