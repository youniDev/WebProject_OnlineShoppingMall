import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col} from 'react-bootstrap';

import { PRODUCT, ERROR } from '../../../assets/js/Constants';
import { addProduct, categoryDropdowns } from '../../../api/ProductApi'
import { handleCategoryChange, handleAddAmount, handleSubImageChange, 
            handleMoveImage, handleImageClick, saveDragStartIndex, handleEncodeImage } from '../../../assets/js/ProductAdditionFunctions';

/**
 *  제품 등록 기능
 *  product name, description, category, mainImage, subImage 입력받음.
 * @param {function} props.onRegistrationComplete - 제품 등록이 완료될 때 호출되는 콜백 함수
 * @returns 
 */
const ProductAddition = ( {onRegistrationComplete, editProduct} ) => {
    const [product, setProduct] = useState(editProduct);

    /**
     * field 값을 입력값으로 변경하는 함수
     * @param {object} e - INPUT 입력값
     * @param {string} field  - product field 값
     */
    const handleChangeWrapper = (e, field) => {
        setProduct((prevProduct) => ({ ...prevProduct, [field]: e.target.value }));
    }    
    /**
     * 사용자가 선택한 카테고리를 저장하는 함수로, 하위 카테고리 값도 지정함
     * @param {string} e 
     */
    const handleCategoryChangeWrapper = (e) => {
        handleCategoryChange(e.target.value, setProduct);
    };
    /**
     * 사용자가 선택한 세부 카테고리 저장하는 함수
     * @param {string} e 
     */
    const handleItemChangeWrapper = (e) => {
        setProduct((prevProduct) => ({ ...prevProduct, subCategory: e.target.value }));
    };
    /**
     * 버튼 클릭으로 판매가, 원가 같은 숫자 값을 변경하는 함수
     * @param {number} amount - ??
     * @param {field} target - product field 값
     */
    const handleAddAmountWrapper = (amount, target) => {
        handleAddAmount(amount, target, setProduct);
    };
    /**
     * 사용자가 선택한 이미지들을 저장하는 함수
     * @param {files} e
     *  
     */
    const handleImageChangeWrapper = (e) => {
        const updatedImages = handleSubImageChange(e.target.files, product.previewImage);

        setProduct((prevShowProduct) => ({ ...prevShowProduct, previewImage: updatedImages }));
    }
    /**
     * 이미지 클릭 시, 삭제 기능
     * @param {number} index 변경하고자 하는 값의 index
     */
    const handleImageClickWrapper = (index) => {
        const updatedImages = handleImageClick(index, product.previewImage);

        setProduct((prevShowProduct) => ({ ...prevShowProduct, previewImage: updatedImages }));
    }

    /**
     * product data들을 서버에 보냄
     * @param {object} formData 
     */
    const submitFormData = (formData) => {
        addProduct({formData})
        .then((isComplete) => {
            if(isComplete) onRegistrationComplete();
        }).catch((error) => {
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
            alert(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_KR]);
        })
    }
    // 제품 등록
    const handleSubmit = async (e) => {
        e.preventDefault();

        const encodeImage = await handleEncodeImage(product.previewImage);     // 이미지들을 인코딩하는 함수
        const encodeTunmbnail = await handleEncodeImage([product.previewImage[0]]);

        const formData = {
            ...product,
            encodedImage: encodeImage,
            thumbnail: encodeTunmbnail,
        };

        submitFormData(formData);
    };
    /**
     * drag drop을 통해 이미지 위치 이동
     * @param {*} e 
     * @param {number} i - drag 한 이미지를 놓을 위치의 인덱스 
     */
    const onDragDrop = (e, i) => {
        e.preventDefault();
        const updateImages = [...product.previewImage];
        
        handleMoveImage(Number(e.dataTransfer.getData('imgIndex')), i, updateImages);
        
        setProduct((prevShowProduct) => ({ ...prevShowProduct, previewImage: updateImages }));
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const renderProductAttribute = (label, controlId, value, inputType, price) => {
        return (
            <Form.Group controlId={controlId}>
                <Row>
                    <Col sm={2} className="text-center"><Form.Label>{label}</Form.Label></Col>
                    <Col sm={5}>
                        {formControlBycontrolId(controlId, value, inputType)}
                    </Col>
                        {price && renderButton(price, controlId)} {/* cost 또는 price일 때 renderButton 호출 */}
                </Row>
            </Form.Group>            
        );
    };

    const renderButton = (price, controlId) => {
        return (
            <Col sm={5} style={{marginTop: '-0.3rem'}}>
                <div className="mt-2">
                    <Button variant="secondary" style={{ backgroundColor: "#747474", border: "none", marginRight: "0", marginLeft: "auto" }} onClick={() => handleAddAmountWrapper(price, controlId)}>+{price}</Button>{' '}
                    <Button variant="secondary" style={{ backgroundColor: "#747474", border: "none", marginRight: "0", marginLeft: "auto" }} onClick={() => handleAddAmountWrapper(price * 5, controlId)}>+{price * 5}</Button>{' '}
                    <Button variant="secondary" style={{ backgroundColor: "#747474", border: "none", marginRight: "0", marginLeft: "auto" }}onClick={() => handleAddAmountWrapper(price * 10, controlId)}>+{price * 10}</Button>
                </div>
            </Col>
        );
    }

    const formControlBycontrolId = (controlId, value, inputType) => {
        if (inputType === 'select') {
            if (controlId === 'mainCategory') {
                return (
                    <Form.Control
                        as={inputType}
                        value={value}
                        onChange={handleCategoryChangeWrapper}>
                        <option value="" disabled>Select a category</option>
                        {categoryDropdowns.map((category) => (
                            <option key={category.id} value={category.id}>{category.title}</option>
                        ))}
                    </Form.Control>
                );
            }
            return (
                <Form.Control
                    as={inputType}
                    value={value}
                    onChange={handleItemChangeWrapper}>
                    {categoryDropdowns.find((category) => category.id === product.mainCategory)?.items.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </Form.Control>
            );
        }
        if (inputType === 'file') {
            return (
                <Form.Control type={inputType} accept="image/*" multiple onChange={handleImageChangeWrapper} />  
            );
        }
        return (
            <Form.Control
                {...(inputType === "textarea" ? { as: "textarea", rows: 3 } : { type: inputType })}
                value={value}
                onChange={(e) => handleChangeWrapper(e, controlId)}
            />          
    );};

    return (
    <Container>
        <Form onSubmit={handleSubmit}>
            {renderProductAttribute("제품 이름", "name", product.name, "text")}
            {renderProductAttribute("제품 설명", "description", product.description, "textarea")}
            {renderProductAttribute("원 가", "cost", product.cost, "number", 1000)}
            {renderProductAttribute("판매가", "price", product.price, "number",1000)}
            {renderProductAttribute("재 고", "quantity", product.quantity, "number", 10)}
            {renderProductAttribute("카테고리", "mainCategory", product.mainCategory, "select")}
            {renderProductAttribute("", "subCategory", product.subCategory, "select")}
            {renderProductAttribute("이미지", "image", undefined, "file")}

            <Row>
                <Col sm={2}/>
                <Col sm={10}>
                    {product.previewImage.map((image, index) => (
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
            <Row>
                <Col sm={9}></Col>
                <Col sm={2} style={{marginTop: '5rem'}}>
                    <Button 
                        variant="primary" 
                        type="submit"
                        style={{ backgroundColor: "#747474", border: "none", marginRight: "0", marginLeft: "auto" }}
                        >Submit</Button>
                </Col>
            </Row>
        </Form>
    </Container>
    );
};

export default ProductAddition;