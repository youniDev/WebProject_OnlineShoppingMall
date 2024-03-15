import React, { useEffect, useState } from 'react';
import { Button, Container, Modal, Col, Row, Image } from 'react-bootstrap';
import { fetchReviewByProductId } from '../../api/ProductApi';
import { ERROR } from '../../assets/js/Constants';
import { saveDecodeBase64ToImages } from '../../assets/js/ImageManager';

const ShowReview = ({productId}) => {
    const [reviews, setReview] = useState([]);

    useEffect(() => {
        fetchReview(); // 리뷰 리스트 불러오기
    }, []);

    const fetchReview = async () => {
        try {
            const productReviews = await fetchReviewByProductId(productId);
            const updatedReviews = [];

            for (const productReview of productReviews) {
                const updatedReview = await decodeImage(productReview);
                updatedReviews.push(updatedReview);
            }
    
            setReview(updatedReviews);

        } catch (error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    const decodeImage = async (productReview) => {
        let decodedImages = [];

        if (productReview.image) {
            decodedImages = saveDecodeBase64ToImages(productReview.image);
        }
        
        const updatedProduct = {
            ...productReview,
            image: decodedImages
        };

        return updatedProduct;
    }

    return (
        <>
        <h3>제품 리뷰</h3>
        {reviews.length !== 0 && reviews.map((r, i) => (
            <div className="product-review" key={i}>
                <p>User ID: {r.user_id}</p>
                <p>평점: {r.rating}</p>
                <p>Review: {r.review}</p>
                <Row>
                    <Col sm={10}>
                        {r.image.map((image, index) => (
                            <div
                                type="button"
                                key={index}
                                className="uploaded-image-container"
                                style={{
                                    display: 'inline-block', 
                                    margin: '10px', 
                                    backgroundColor: index === 0 ? '#ffcccb' : '#f0f0f0'
                                }}
                            >
                            <Image
                                key={index}
                                src={URL.createObjectURL(image)}
                                alt={`Uploaded Image ${index + 1}`}
                                className="uploaded-image"
                                style={{width:'150px', height: '150px', objectFit: 'contain', cursor: 'pointer'}}
                            />
                            </div>
                        ))}
                    </Col>
                </Row>
            </div> 
        ))}
        </>
    );
};

export default ShowReview;