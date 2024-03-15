// Community.jsx
import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";
import Board from "../../../component/layout/Board";


import '../../../assets/css/main.css';
import '../../../assets/css/community.css';

function Community() {
    const location = useLocation();
    const category = location.state.data;
    const user = location.state.user;
    const [selectedComponent, setSelectedComponent] = useState(category);

    useEffect(() => {
        setSelectedComponent(category);
    }, [category]);


    const handleNavItemClick = (componentType) => {
        setSelectedComponent(componentType);
    };

    return (
        <>
            <Header/>
            <Container className="rm-10">
                <h5 className="text-center notice-title-custom">{selectedComponent}</h5>
                <Navbar expand="lg" bg="light" className="navbar-notice-custom">
                    <Navbar.Collapse id="navbarNavAltMarkup">
                        <Nav className="mx-auto">
                        <Nav.Link className="nav-space" onClick={() => handleNavItemClick("공지사항")}>공지사항</Nav.Link>
                        <Nav.Link className="nav-space" onClick={() => handleNavItemClick("상품문의")}>상품문의</Nav.Link>
                        <Nav.Link className="nav-space" onClick={() => handleNavItemClick("배송문의")}>배송문의</Nav.Link>
                        <Nav.Link className="nav-space" onClick={() => handleNavItemClick("반품문의")}>반품문의</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Board dropdownId={selectedComponent} user={user}/>
            </Container>
            <Footer/>
        </>
    );
}

export default Community;