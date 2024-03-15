import React, { useState } from "react";

import ProductAddition from "./ProductAddition";
import { PRODUCT } from '../../../assets/js/Constants';


const EditProduct = ({ onRegistrationComplete, productDetail}) => {
    const [product, setProduct] = useState({
        id: productDetail.id,
        name: productDetail.name,
        description: productDetail.description,
        mainCategory: PRODUCT.CATEGORY.find(cat => cat.items && cat.items.includes(productDetail.category)).id,
        subCategory: productDetail.category,
        cost: productDetail.cost,
        price: productDetail.price,
        quantity: productDetail.quantity,
        previewImage: productDetail.previewImage,
    });

    
    return (
        <>
            <ProductAddition onRegistrationComplete={onRegistrationComplete} editProduct={product} />
        </>
    );
};

export default EditProduct;