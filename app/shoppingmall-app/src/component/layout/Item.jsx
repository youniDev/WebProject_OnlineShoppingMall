import React from "react";
import { Col, Image } from "react-bootstrap";
import "../../assets/css/itemImage.css";

const Item = ({ product }) => {
  return (
    <Col>
        <Image
          alt={product.name}
          width={320}
          height={440}
          className="bd-placeholder-img"
        />
        <h2 className="fw-normal text-center">{product.name}</h2>
        <p className="text-center">{product.description}</p>
    </Col>
  );
};

export default Item;