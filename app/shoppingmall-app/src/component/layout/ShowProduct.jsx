import React, { useEffect, useState } from "react";
import { Container, Row, Pagination, Form, Col } from "react-bootstrap";

import { getProductForMain, getWishListByUserId } from "../../api/ProductApi";
import { saveDecodeBase64ToImages } from "../../assets/js/ImageManager";
import { ERROR, PAGE, PRODUCT } from "../../assets/js/Constants";

import Product from "./Product";

const ShowProduct = ({userId}) => {
    const [products, setProducts] = useState({
        bestProducts: [],
        newProducts: [],
        wishList: [],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState({
        mainCategory: 'All',
        subCategory: '',
    });
    
    useEffect(() => {
        if (userId) {
            getProductByUserId();
        } else {
            getProduct();
        }

    }, [currentPage]);

    // 이미지 디코딩 함수
    const decodeImages = (products) => {
        return products.map(product => ({
            ...product,
            image: saveDecodeBase64ToImages(product.image),
        }));
    };

    // 제품 정보 불러오기
    const getProduct = async () => {
        try {
            const p = await getProductForMain();
            const productsWithDecodedImages = {
                bestProducts: decodeImages(p.bestProducts),
                newProducts: decodeImages(p.newProducts),
            };
            setProducts(productsWithDecodedImages);
        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
            alert(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_KR]);
        }
    };

    // 찜 목록 불러오기
    const getProductByUserId = async () => {
        try {
            const p = await getWishListByUserId(userId);
            const productsWithDecodedImages = {
                wishList: decodeImages(p),
            };
            setProducts(productsWithDecodedImages);

        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
            alert(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_KR]);
        }
    };

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = (totalProducts) => {
        const totalPages = Math.ceil(totalProducts / PAGE.WISH_LIST);
        
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
    };

    // Function to filter products based on selected category
    const getFilteredProducts = () => {
        if (selectedCategory.mainCategory === 'All') {
            return products.wishList;
        }
        
        // 2. main 과 sub 카테고리 둘 다 선택된 경우 
        if (selectedCategory.subCategory) {
            
            return products.wishList.filter((product) => product.category === selectedCategory.subCategory);
        }

        // 1. main 카테고리만 선택된 경우 
        // 1-1. category item으로부터 title을 찾아야됨
        return products.wishList.filter((product) => 
            PRODUCT.CATEGORY.find(cat => cat.items && cat.items.includes(product.category)).id === selectedCategory.mainCategory);
    };

    const handleCategoryChange = (e) => {
        const main = e.target.value;

        setSelectedCategory((prevProduct) => ({ ...prevProduct, mainCategory: main, subCategory: ''}));
    };
    
    /**
     * 
     * @param {String} title 
     * @param {String} additional 
     * @param {Array} sectionProducts 
     * @returns 
     */
    const renderSection = (title, additional, sectionProducts) => {
        const indexOfLastProduct = currentPage * PAGE.WISH_LIST;
        const indexOfFirstProduct = indexOfLastProduct - PAGE.WISH_LIST;
        const currentProducts = sectionProducts.slice(indexOfFirstProduct, indexOfLastProduct);
        
        return (
            <div className="text-center">
                <h2>{title}</h2>
                <p>{additional}</p>
                <Row xs={1} md={4} className="row-cols-4">
                    <Product products={currentProducts} />
                </Row>
            </div>
        );
    };

    return (
      <Container>
            {/* Main에 아이템 보여줌*/}
            {!userId && (
                <>
                    {renderSection(PRODUCT.MAIN[PRODUCT.BEST].title, PRODUCT.MAIN[PRODUCT.BEST].additional, products.bestProducts)}
                    {renderSection(PRODUCT.MAIN[PRODUCT.NEW].title, PRODUCT.MAIN[PRODUCT.NEW].additional, products.newProducts)}
                </>
            )}
            
            {/* 페이지네이션 표시 */}
            {userId && (
                <>
                    <Row>
                        <Col xs="auto"><p> CATEGORY : </p></Col>
                        <Col xs="auto">
                            <Form.Group controlId="mainCategoryFilter">
                                <Form.Control
                                    as="select"
                                    value={selectedCategory.mainCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="All">All</option>
                                        {PRODUCT.CATEGORY.map((category) => (
                                            <option key={category.id} value={category.id}>{category.title}</option>
                                        ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Form.Group controlId="subCategoryFilter">
                                <Form.Control
                                    as="select"
                                    value={selectedCategory.subCategory}
                                    onChange={(e) => setSelectedCategory((prevCategory) => ({...prevCategory, subCategory: e.target.value}))}
                                >
                                    <option value=''></option>
                                    {PRODUCT.CATEGORY.find((category) => category.id === selectedCategory.mainCategory)?.items.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    {renderSection(null, null, getFilteredProducts())}
                    {renderPagination(getFilteredProducts().length)}
                </>
            )}
      </Container>
    );
};

export default ShowProduct;