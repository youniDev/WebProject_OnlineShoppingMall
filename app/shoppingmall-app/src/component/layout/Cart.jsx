import React, { useEffect, useState } from "react";

import { ERROR, PRODUCT, PURCHASE } from '../../assets/js/Constants';
import {deleteToCart, fetchCartProductsByUserId} from '../../api/PurchaseApi';

import { Container, Table, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Cart = ({ userId }) => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState({
      products: [],
      selectedProducts: [],
      selectAll: false,
      totalCost: 0,
    });
  
    useEffect(() => {
      if (userId) {
        fetchCart();
      }
    }, [cartData]);

    const fetchCart = () => {
      fetchCartProductsByUserId(userId)
          .then((res) => {
            setCartData((prevData) => ({
              ...prevData,
              products: res,
              totalCost: res.reduce((total, product) => total + (product.cost * product.purchaseQuantity), 0),
              selectedProducts: res.map((product) => product.product_id),
            }));
          })
          .catch((error) => {
            console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error);
          });
    }
  
    const handleCheckboxChange = (productId) => {
      setCartData((prevData) => {
        const { selectedProducts } = prevData;
  
        const updatedSelectedProducts = selectedProducts.includes(productId)
          ? selectedProducts.filter((id) => id !== productId)
          : [...selectedProducts, productId];
  
        const updatedTotalCost = updatedSelectedProducts.reduce(
          (total, productId) => {
            const product = prevData.products.find(
              (product) => product.product_id === productId
            );
            return total + (product.cost * product.purchaseQuantity);
          },
          0
        );
  
        return {
          ...prevData,
          selectedProducts: updatedSelectedProducts,
          totalCost: updatedTotalCost,
        };
      });
    };
  
    const handleSelectAllChange = () => {
      setCartData((prevData) => {
        const { selectAll, products } = prevData;
  
        const updatedSelectAll = !selectAll;
        const updatedSelectedProducts = updatedSelectAll
          ? products.map((product) => product.product_id)
          : [];
  
        const updatedTotalCost = updatedSelectAll
          ? products.reduce((total, product) => total + (product.cost * product.purchaseQuantity), 0)
          : 0;
  
        return {
          ...prevData,
          selectAll: updatedSelectAll,
          selectedProducts: updatedSelectedProducts,
          totalCost: updatedTotalCost,
        };
      });
    };

    const handleSubmit = () => {
        const selectedProductDetails = cartData.selectedProducts.map((productId) => {
            const product = cartData.products.find((p) => p.product_id === productId);
            return {
                product_id: productId,
                name: product.name,
                cost: product.cost,
                quantity: product.purchaseQuantity,
            };
        });

        // 구매 페이지로 이동
        navigate(`/purchase`, { state: { selectedProducts: selectedProductDetails, userId: userId, totalCost: cartData.totalCost } });
    }

    const handleCancel = () => {
        const selectedProductDetails = cartData.selectedProducts.map((productId) => {
          const product = cartData.products.find((p) => p.product_id === productId);
          return {
              productId: product.product_id,
              userId: userId,
          };
        });

        deleteToCart({cart: selectedProductDetails})
        .then((res) => {
          if (res) {
             alert("삭제되었습니다.");
             fetchCart();
          } else alert("다시 시도해주세요.");
        }).catch((error) => console.error(ERROR.FAIL_COMMUNICATION[ERROR.TEXT_EN], error));
    }
  
    return (
      <Container>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>
                <input
                  type="checkbox"
                  onChange={handleSelectAllChange}
                  checked={cartData.selectAll}
                />
              </td>
              <td colSpan="2">전체 선택</td>
            </tr>
            {cartData.products.map((product, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleCheckboxChange(product.product_id)
                    }
                    checked={cartData.selectedProducts.includes(
                      product.product_id
                    )}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.cost}</td>
                <td>{product.purchaseQuantity}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">총 합계:</td>
              <td>{cartData.totalCost}</td>
            </tr>
          </tbody>
        </Table>
        <Button type="submit" onClick={handleSubmit}>주문하기</Button>
        <Button onClick={handleCancel}>삭제</Button>
      </Container>
    );
  };

export default Cart;