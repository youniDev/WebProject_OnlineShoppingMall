import React from "react";
import { Col, Image } from "react-bootstrap";
import "../../assets/css/itemImage.css";
import { useLocation, useNavigate } from "react-router-dom";

const Product = ({ products }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleImageClick = (p) => {
        console.log(location.pathname);
        if (!location.pathname.includes('category')) {
            navigate(`/category/${p.category}/${p.id}`, { state: {data: p} });

            return;
        }

        navigate(`${location.pathname}/${p.id}`, { state: { data: p } });
    }

    return (
        <React.Fragment>
            {products && products.map((p) => (
                <Col>
                    <div
                        key={p}
                        onClick={() => handleImageClick(p)}
                    >
                        <Image
                            className="bd-placeholder-img"
                            src={URL.createObjectURL(p.image[0])}
                            width={320}
                            height={440}
                            alt={p.name}
                        />
                        <div className="description text-center">
                            <strong className="name">
                                <span style={{ fontSize: '14px', color: '#000000' }}>{p.name}</span>
                            </strong>
                            <ul>
                                <li alt="상품 간략설명">
                                    <span style={{ fontSize: '14px', color: '#000000' }}>{p.description}</span>
                                </li>
                                <li alt="상품 요약설명">
                                    <span style={{ fontSize: '12px', color: '#969696' }}>{p.description}</span>
                                </li>
                                <li alt="판매가">
                                    <span style={{ fontSize: '12px', color: '#000000' }}>{p.price}</span>
                                    <span id="span_product_tax_type_text" style={{}}></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Col>
            ))}
        </React.Fragment>
    );
}

export default Product;