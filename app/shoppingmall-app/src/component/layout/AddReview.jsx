import React, { useEffect, useState } from 'react';
import { Button, Modal, Col, Row, Form } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';

import { handleEncodeImage, handleImageClick, handleMoveImage, handleSubImageChange, saveDragStartIndex } from '../../assets/js/ProductAdditionFunctions';
import { addProductReview } from '../../api/UserAPI';
import { ERROR } from '../../assets/js/Constants';

const AddReview = ({userId, product, orderId}) => {
    const [isModalOpen, setModalOpen] = useState();
    const [selectedProduct, setSelectedProduct] = useState({
        ...product,
        image: [],
        rating: 0 // 추가된 rating 상태
      });

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct({});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const sendData = await encodedImage();
            const isComplete = await addProductReview(userId, orderId, sendData);
            if (isComplete) {
                alert("리뷰 등록 완료!");
                closeModal();
                return ;
            }
        } catch(error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }

        alert("다시 시도해 주세요");
    }

    const encodedImage = async () => {
        if (selectedProduct.image) {
            const encodeImage = await handleEncodeImage(selectedProduct.image);     // 이미지들을 인코딩하는 함수

            const formData = {
                ...selectedProduct,
                image: encodeImage,
            };

            return formData;
        }

        return selectedProduct;
    }

    const handleReviewClick = () => {
        setModalOpen(true);
    }

    const handleImageChange = (e) => {
        if (selectedProduct.image) {
            const updatedImages = handleSubImageChange(e.target.files, selectedProduct.image);
            setSelectedProduct((prevShowProduct) => ({ ...prevShowProduct, image: updatedImages }));

            return ;
        }

        setSelectedProduct((prevShowProduct) => ({ ...prevShowProduct, image: e.target.files }));
    }
    /**
     * 이미지 클릭 시, 삭제 기능
     * @param {number} index 변경하고자 하는 값의 index
     */
    const handleImageClickWrapper = (index) => {
        const updatedImages = handleImageClick(index, selectedProduct.image);

        setSelectedProduct((prevShowProduct) => ({ ...prevShowProduct, image: updatedImages }));
    }

    /**
     * drag drop을 통해 이미지 위치 이동
     * @param {*} e 
     * @param {number} i - drag 한 이미지를 놓을 위치의 인덱스 
     */
    const onDragDrop = (e, i) => {
        e.preventDefault();
        const updateImages = [...selectedProduct.image];
        
        handleMoveImage(Number(e.dataTransfer.getData('imgIndex')), i, updateImages);
        
        setSelectedProduct((prevShowProduct) => ({ ...prevShowProduct, image: updateImages }));
    };
    const onDragOver = (e) => {
        e.preventDefault();
    };

    const changeRating = (newRating) => {
        setSelectedProduct({ ...selectedProduct, rating: newRating });
    }

    return (
        <>
        <Button type="button" variant="primary" className="btn" onClick={handleReviewClick}>
                리뷰작성
        </Button>
        <Modal show={isModalOpen} onHide={closeModal}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>리뷰 작성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <p>Product ID: {product.name}</p>
                        <p>User ID: {userId}</p>
                        {/* 이미지 등록 */}
                        <Form.Group className="mb-3" as={Row}>
                            <Col sm={5}>
                                <Form.Control type="file" accept="image/*" multiple onChange={handleImageChange} />  
                            </Col>
                        </Form.Group>
                        {/* 이미지 보이기 */}
                        <Row>
                            <Col sm={2}/>
                            <Col sm={10}>
                                {selectedProduct.image && selectedProduct.image.map((image, index) => (
                                    <div
                                        type="button"
                                        key={index}
                                        className="uploaded-image-container"
                                        style={{
                                            display: 'inline-block', 
                                            margin: '10px', 
                                            backgroundColor: index === 0 ? '#ffcccb' : '#f0f0f0'
                                        }}
                                        onClick={() => handleImageClickWrapper(index)}
                                        onDragOver={onDragOver}
                                        onDrop={(e) => onDragDrop(e, index)}
                                    >
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(image)}
                                        alt={`Uploaded Image ${index + 1}`}
                                        className="uploaded-image"
                                        style={{width:'150px', height: '150px', objectFit: 'contain', cursor: 'pointer'}}
                                        draggable
                                        onDragStart={(e) => saveDragStartIndex(e.dataTransfer, index)}
                                        onDragOver={onDragOver}
                                        onDrop={(e) => onDragDrop(e, index)}
                                    />
                                    </div>
                                ))}
                            </Col>
                        </Row>
                        {/* 리뷰 작성 */}
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label>[리뷰]</Form.Label>
                            <Col sm={12}>
                                <Form.Control 
                                    as='textarea'
                                    rows={20}
                                    value={selectedProduct.review}
                                    onChange={(e) => setSelectedProduct(prevProduct => ({ ...prevProduct, review: e.target.value }))}
                                />
                            </Col>
                        </Form.Group>
                        {/* 평점 */}
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label>평점</Form.Label>
                            <Col sm={12}>
                                <StarRatings
                                    rating={selectedProduct.rating}
                                    starRatedColor="blue"
                                    changeRating={changeRating}
                                    numberOfStars={5}
                                    name='rating'
                                />
                            </Col>
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        취소
                    </Button>
                    <Button type="submit" variant="primary">
                        작성
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
        </>
    );
}

export default AddReview;