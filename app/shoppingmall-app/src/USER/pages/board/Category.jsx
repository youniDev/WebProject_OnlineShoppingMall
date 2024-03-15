import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Container, Row, Col, Card, Image, Nav, Navbar, Pagination } from "react-bootstrap";
import { Swiper, SwiperSlide } from 'swiper/react';     // swiper
import { Pagination as SwiperPagination } from 'swiper';        // import required modules

import Header from "../../../component/layout/Header";
import Footer from "../../../component/layout/Footer";
import Product from "../../../component/layout/Product";
import { usePagenation } from "../../../component/usePagenation";
import useSort from "../../../component/useSort";
import useSelectCategory from "../../../component/useSelectCateogory";

import "../../../assets/css/category.css";
import 'swiper/css';
import 'swiper/css/pagination';
import useProducts from "../../../component/useProducts";

function Category() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mainCategory } = useParams();

    const { filteredProducts, setFilteredProducts, bestItems } = useProducts(mainCategory);
    const { setCurrentPage, currentPage, totalPages, indexOfFirstProduct, indexOfLastProduct } = usePagenation({ totalProductsLength: filteredProducts.length, products: filteredProducts });
    const { sortIntegerOrderByDESC, sortInteger, sortString, sortBestItemBySales } = useSort(filteredProducts, setFilteredProducts);
    const { getCategory } = useSelectCategory(mainCategory);

    // 해당 카테고리로 이동
    const goToCategory = (category) => {
        return () => {
            if (category === "ALL") {
                category = getCategory().title;
            }

            navigate(`/category/${category.replace(/\//g, '')}`, { state: { data: category } });
        };
    }
    // 제품 세부 정보 페이지로 이동
    const handleImageClick = (product) => {
        navigate(`${location.pathname}/${product.id}`, { state: { data: product } });
    }

    // pagenation
    const renderPagination = () => {
        return (
            <Pagination>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        );
    }
    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const renderProducts = (title, additional, sectionProducts) => {
        const currentProducts = sectionProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    
        return (
            <div className="text-center">
                <h2>{title}</h2>
                <p>{additional}</p>
                <Row xs={1} md={4} className="row-cols-4">
                    <Product products={currentProducts} />
                </Row>
            </div>
        )
    }

    return (
        <>
            <Header />
                <div className="best-item-list-custom">
                    <Container className="best-item-custom">
                        <h5 className="text-center">BEST ITEM</h5>
                        <Swiper
                            slidesPerView={4}
                            spaceBetween={30}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[SwiperPagination]}
                        >
                            {bestItems.map((product) => (
                                <SwiperSlide>
                                    <Row xs={1} md={4} className="g-4">
                                        <Col>
                                            <div
                                                key={product}
                                                onClick={() => handleImageClick(product)}
                                            >
                                                <Card>
                                                    <div className="img-container" style={{ width: '320px', height: '440px' }}>
                                                        <Image
                                                            className="bd-placeholder-img swiper-best-item-img"
                                                            src={URL.createObjectURL(product.image[0])}
                                                            alt={product.title}
                                                            width={320}
                                                            height={440}
                                                        />
                                                        <div className="text-overlay">
                                                            <Card.Title className="item-name">
                                                                <span style={{ fontSize: '11px' }}>🖤상품명🖤{product.name}</span>
                                                            </Card.Title>
                                                            <ul>
                                                                <li alt="상품 간략설명">
                                                                    <span style={{ fontSize: '11px' }}>[{product.description}]</span>
                                                                </li>
                                                                <li alt="상품 요약설명">
                                                                    <span style={{ fontSize: '11px' }}>{product.description}</span>
                                                                </li>
                                                                <li alt="소비자가">
                                                                    <span style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'line-through' }}>{product.price}원</span>
                                                                </li>
                                                                <li alt="할인판매가" className="displaynone">
                                                                    <span style={{ fontSize: '11px', color: '#a12f2f' }}>
                                                                        {product.sale} <span style={{ fontSize: '12px', color: '#ff0000', fontWeight: 'bold' }}>({product.saleDetail})원 할인</span>
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        </Col>
                                    </Row>
                                </SwiperSlide>
                            ))}
                        </Swiper> 
                    </Container>
                </div>

                <Container className="category-nav">
                    <h5 className="text-center notice-title-custom">
                        {mainCategory === getCategory().title ? "ALL" : mainCategory}
                    </h5>
                    <Navbar expand="lg" bg="light" className="navbar-notice-custom">
                        <Navbar.Collapse id="navbarNavAltMarkup">
                            <Nav className="mx-auto">
                                <Nav.Link
                                    disabled={mainCategory === getCategory().title}
                                    onClick={() => goToCategory("ALL")()}
                                > 
                                    ALL 
                                </Nav.Link>
                                {getCategory().items && getCategory().items.map((item, index) => (
                                    <Nav.Link 
                                        key={index} 
                                        onClick={() => goToCategory(item)()}
                                        disabled={mainCategory === item.replace(/\//g, '')}
                                    >
                                        {item}
                                    </Nav.Link>
                                ))}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                
                    { /* item 정렬 */}
                    <Row>
                        <small className="col-sm-1">Total Items.</small>
                        <div className="col-sm-7"></div>
                        <div className="col-sm-4 sorting-option-nav">
                            <Navbar expand="lg" bg="light" className="navbar-notice-custom">
                                <Navbar.Collapse id="navbarNavAltMarkup">
                                    <Nav className="mx-auto">
                                        <Nav.Link name='createDate' onClick={sortIntegerOrderByDESC}>신상품</Nav.Link>
                                        <Nav.Link name='name' onClick={sortString}>상품명</Nav.Link>
                                        <Nav.Link name='price' onClick={sortInteger}>낮은가격</Nav.Link>
                                        <Nav.Link name='price' onClick={sortIntegerOrderByDESC}> 높은가격</Nav.Link>
                                        <Nav.Link name="best" onClick={sortBestItemBySales}>인기상품</Nav.Link>
                                        <Nav.Link name="review">사용후기</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                        </div>
                    </Row>
                </Container>

                <Container>
                    {renderProducts(null, null, filteredProducts)}
                    {renderPagination()} 
                </Container>

            <Footer/ >
        </>
    );
};

export default Category;