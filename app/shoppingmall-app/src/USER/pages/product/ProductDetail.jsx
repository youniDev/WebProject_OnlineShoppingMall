import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Slider from "react-slick";

import { ERROR, PRODUCT, PURCHASE } from '../../../assets/js/Constants';
import { addToCart } from '../../../api/PurchaseApi'

import Header from '../../../component/layout/Header';
import Footer from '../../../component/layout/Footer';

import "../../../assets/css/productDetail.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';

// slider css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { addWishListByUserId, deleteWishListByUserId } from '../../../api/UserAPI';
import ShowReview from '../../../component/layout/ShowReview';


function ProductDetail() {
    let interval;
    const navigate = useNavigate(); 
    const location = useLocation();
    const product = location.state && location.state.data;
    const [showProductInfo, setShowProductInfo] = useState({
        mainImage: product.image[PRODUCT.MAIN_IMAGE_INDEX],
        subImage: product.image.slice(PRODUCT.SUB_IMAGE_INDEX),
        imageIndex: PRODUCT.MAIN_IMAGE_INDEX,
        quantity: PRODUCT.PURCHASE_QUANTITY, 
        totalCost: product.cost,
    });

    const [userId, setUserId] = useState('');

    useEffect(() => {
        interval = setInterval(() => {
            setShowProductInfo((prevInfo) => ({
                ...prevInfo,
                imageIndex: (prevInfo.imageIndex) % showProductInfo.subImage.length,
                mainImage: showProductInfo.subImage[(prevInfo.imageIndex) % showProductInfo.subImage.length],
                subImage: deleteMainImgAndAddSubImg(showProductInfo.mainImage,
                    showProductInfo.subImage[(prevInfo.imageIndex) % showProductInfo.subImage.length]),  //// 배열에서 현재 이미지의 다음 이미지를 선택
            }));
        }, 2000);   // 2초 간격으로 대표 이미지 변경
    
        return () => clearInterval(interval);
    }, [showProductInfo.mainImage]);

    const handleImageClick = (img) => {
        setShowProductInfo((prevInfo) => ({
            ...prevInfo,
            mainImage: img,
            subImage: deleteMainImgAndAddSubImg(showProductInfo.mainImage, img),
        }));
        clearInterval(interval); // 이미지 클릭 시, interval을 정리하여 변경 중지
    };

    // 기존 대표 이미지를 sub img 배열에 저장하고, sub 이미지에서 선택된 이미지는 대표 이미지로 변경하면서 sub 배열에서 삭제
    const deleteMainImgAndAddSubImg = (prevImg, seletedImg) => {
        const deletedSubImage = deleteSubImage(seletedImg);
        const updatedSubImage = addSubImage(prevImg, deletedSubImage);

        return updatedSubImage;
    }
    const addSubImage = (newImage, subImageArray) => {
        return [...subImageArray, newImage];
    };
    const deleteSubImage = (newImg) => {
        return showProductInfo.subImage.filter((img) => img !== newImg);
    };

    const handleIncreaseQuantity = () => {
        const updateQuantity = Number(showProductInfo.quantity) + Number(1);

        setShowProductInfo((prevQuantity) => ({...prevQuantity, 
            quantity: updateQuantity,
            totalCost: (product.price * updateQuantity),
        }));
    };
  
    const handleDecreaseQuantity = () => {
        const updateQuantity = Number(showProductInfo.quantity) - Number(1);

        if (showProductInfo.quantity > 1) {
            setShowProductInfo((prevQuantity) => ({...prevQuantity, 
                quantity: updateQuantity,
                totalCost: (product.price * updateQuantity),
            }));
        }
    };
  
    const handleOrderSubmit = () => {
        if (isNotUser) {
            alert("회원이 아닙니다.");
            return ;
        }
        
        const selectedProductDetails = [{
            product_id: product.id,
            name: product.name,
            cost: product.cost,
            quantity: showProductInfo.quantity,
        }]

        // 구매 페이지로 이동
        navigate(`/purchase`, { state: { selectedProducts: selectedProductDetails, userId: userId, totalCost: showProductInfo.totalCost } });
    };
  
    const handleAddToCart = () => {
        if (isNotUser) {
            alert("회원이 아닙니다.");
            return ;
        }
        const cart = {
            userId: userId,
            productId: product.id,
            quantity: showProductInfo.quantity,
        };

        addToCart({cart})
        .then((isComplete) => {
            if (isComplete) {
                if (window.confirm("장바구니로 이동하시겠습니까?")) {
                    navigate('/mypage', {state: { userId: userId, currentTab: PURCHASE.CART}})
                }
            }
        }).catch((error) => {
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
            alert("다시 시도해주세요.");
        })
    }

    const handleAddToHeart = async () => {
        if (isNotUser) {
            alert("회원이 아닙니다.");
            return ;
        }
        try {
            const isComplete = await addWishListByUserId(userId, product.id);

            alert("찜 완료!");
        } catch (error) {
            const isFail = error.response.data;
            if (isFail.includes('duplicate')) {
                const userConfirmed = window.confirm("찜을 해제하시겠습니까?");
                if (userConfirmed) {
                    try {
                        await deleteWishListByUserId(userId, product.id);
                        alert("찜 해제 완료!");
                    } catch(error) {
                        console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
                        alert(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_KR]);
                    }
                }
                return ;
            }
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
            alert(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_KR]);
        }
    }

    const isNotUser = () => {
        if (userId) {
            return false;
        }
        return true;
    }

    return (
        <>
            <Header setUserId={setUserId}/>
            <Container fluid>
                <div className='custom-resizing-container'>
                    <Row>
                        <Col xl={2}></Col>
                        <Col xs={12} sm={12} md={12} lg={6} xl={5}>
                            <Image
                                src={URL.createObjectURL(showProductInfo.mainImage)}
                                className='custom-resizing-main-image'
                                alt="Main Image"
                            />
                            <Row>
                                <Slider {...PRODUCT.SLIDER_SETTING}>
                                    {showProductInfo.subImage.map((img) => (
                                            <div className='custom-resizing-sub'>
                                                <Image
                                                    src={URL.createObjectURL(img)}
                                                    className={'custom-resizing-sub-image'}
                                                    alt="Sub Image"
                                                    onClick={() => handleImageClick(img)}
                                                />
                                            </div>
                                    ))}
                                </Slider>
                            </Row>
                        </Col>
                        <Col xs={12} lg={3} xl={4}>
                            <div className='custom-resizing-container custom-resizing-info'>
                                <h2>{product.name}</h2>
                                <hr style={{width: '50%'}}/>
                                <div style={{marginTop: '-4rem'}}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th scope='row'>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>
                                                        요약정보
                                                    </span>
                                                </th>
                                                <td>
                                                    <span style={{fontSize: '12px', color: '#000000'}}>
                                                        {product.description}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr title='판매가' className=' xans-record-'>
                                                <th scope='row'>
                                                    <span style={{fontSize: '12px', color: '#000000'}}>판매가</span>
                                                </th>
                                                <td>
                                                    <span style={{fontSize: '12px', color: '#000000', fontWeight: 'bold'}}>
                                                        <strong id='span_product_price_text'> {product.price} 원</strong>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr title='적립금' className=' xans-record-'>
                                                <th scope='row'>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>적립금</span>
                                                </th>
                                                <td>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>
                                                        <span id='span_product_price_text'> 300원 (1%)</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr title='할인 기간' className=' xans-record-'>
                                                <th scope='row'>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>할인 기간</span>
                                                </th>
                                                <td>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>
                                                        <span style={{color: '#4d75da'}}> 
                                                            <span className='product_promotion_date'>남은시간 10일 03:43:17</span>
                                                            (24,400원 할인)
                                                        </span>
                                                        <span className="period">2024-01-26 09:50 ~ 2024-02-08 00:00</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            
                                            <tr title='상품소재' className=' xans-record-'>
                                                <th scope='row'>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>상품소재</span>
                                                </th>
                                                <td>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>
                                                        울60%, 나일론25%, 폴리15%
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr title='할인판매가' className=' xans-record-'>
                                                <th scope='row'>
                                                    <span style={{fontSize: '12px', color: '#555555'}}>할인판매가</span>
                                                </th>
                                                <td>

                                                    <span>
                                                        <span style={{fontSize: '12px', color: '#555555'}}>
                                                            <span id="span_product_price_sale">10,500원
                                                                <span style={{fontSize: '12px', color: '#000000'}}>(24,400원 할인)</span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <Form style={{marginTop: '1rem'}}>
                                    <Form.Group controlId="quantity">
                                        <div className="d-flex align-items-center">
                                            <Button style={{marginRight: '0rem', width: '7%'}}variant="outline-secondary" onClick={handleDecreaseQuantity}>
                                                -
                                            </Button>
                                            <Form.Control style={{width: '20%'}} type="number" value={showProductInfo.quantity} readOnly />
                                            <Button style={{marginLeft: '0rem', width: '7%'}} variant="outline-secondary" onClick={handleIncreaseQuantity}>
                                                +
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Form>
                                {/* 총 상품 금액 */}
                                <div style={{marginTop: '5rem'}}>
                                    <span style={{fontSize: '20px', color: '#555555'}}>
                                        <span id="span_product_price_sale" style={{fontWeight: 'bold'}}> 총상품금액(수량):
                                            <span style={{fontSize: '20px', color: '#000000', fontWeight: 'bold'}}> {showProductInfo.totalCost} 원</span>
                                        </span>
                                    </span>
                                </div>
                                {/* 서버 제출 버튼 */}
                                <div className="d-flex justify-content-between" style={{marginTop: '2rem'}}>
                                    <div className="d-flex align-items-center">
                                        <Button style={{marginRight: '0.5rem', paddingBlock: '1rem', paddingInline: '4rem'}} variant="primary" 
                                            onClick={handleOrderSubmit}
                                            disabled={product.quantity === 0}
                                        >
                                            바로구매
                                        </Button>
                                        <Button
                                            style={{marginRight: '0.5rem', paddingBlock: '1rem', paddingInline: '1rem', backgroundColor:'white', color: 'black'}}
                                            variant="secondary"
                                            onClick={handleAddToCart}
                                            disabled={product.quantity === 0}
                                        >
                                            장바구니
                                        </Button>
                                        <Button style={{marginRight: '0.5rem', paddingBlock: '1rem', paddingInline: '1rem', backgroundColor:'white', color: 'black'}} variant="secondary" onClick={handleAddToHeart}>
                                            <FontAwesomeIcon icon={farHeart} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/** tab */}
                    <Tabs
                        defaultActiveKey="detail"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="detail" title="상세정보">
                            Tab content for Home
                        </Tab>
                        <Tab eventKey="review" title="리뷰">
                            <ShowReview productId={product.id}/>
                        </Tab>
                        <Tab eventKey="contact" title="Contact" disabled>
                            Tab content for Contact
                        </Tab>
                    </Tabs>                   

                </div>
            </Container>
            <Footer />
        </>
    );
};

export default ProductDetail;