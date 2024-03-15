package com.store.onlineStore.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.CartRequestDto;
import com.store.onlineStore.dto.CartResponseDto;

import com.store.onlineStore.dto.OrderResponseDto;
import com.store.onlineStore.dto.PurchaseOrderResponseDto;
import com.store.onlineStore.dto.registerDTO.UserResponseDto;
import com.store.onlineStore.repository.PurchaseRepository;
import com.store.onlineStore.repository.UserRepository;
import com.store.onlineStore.service.ProductManagementService;
import com.store.onlineStore.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PurchaseController {
	@Autowired
	private PurchaseRepository purchaseRepository;
	@Autowired
	private ProductManagementService productManagementService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserService userService;

	// 바로구매
	/**
	 * 구매한 제품을 등록
	 *
	 * @param purchases 구매한 제품 정보를 담은 CartRequestDto 리스트
	 * @return 제품 등록이 성공하면 true를 반환
	 */
	@PostMapping("/purchase/product")
	public ResponseEntity<?> addSellProduct(@RequestBody List<CartRequestDto> purchases) {
		CartRequestDto order = purchases.get(0);
		String orderId = productManagementService.generateProductId(order.getProductId());

		purchaseRepository.insertOrder(order, orderId);
		for (CartRequestDto purchase : purchases) {
			purchaseRepository.insertSales(purchase, orderId);
			purchaseRepository.deleteCartBySales(purchase);
		}

		return ResponseEntity.status(HttpStatus.OK).body(true);
	}

	/**
	 * 장바구니에 제품을 추가
	 *
	 * @param cart 장바구니에 추가할 제품 정보를 담은 CartRequestDto 객체
	 * @return 제품 추가가 성공하면 true를 반환
	 */
	@PostMapping("/cart/product")
	public ResponseEntity<?> addCartProduct(@RequestBody CartRequestDto cart) {
		boolean exists = purchaseRepository.cartExists(cart);

		if (exists) {
			purchaseRepository.updateCartQuantity(cart);
		}
		if (isNot(exists)) {
			purchaseRepository.insertCart(cart);
		}

		return ResponseEntity.status(HttpStatus.OK).body(true);
	}

	/**
	 * 장바구니 목록 조회
	 * 사용자 ID에 해당하는 제품 목록 조회
	 *
	 * @param user 사용자 ID를 나타내는 문자열
	 * @return 사용자에게 연관된 제품 목록을 담은 ResponseEntity
	 */
	@PostMapping("/fetch/product")
	public ResponseEntity<?> fetchProductByUserId(@RequestBody String user) {
		user = user.replaceAll("\"", "");
		List<CartResponseDto> products= purchaseRepository.findProductByUserId(user);

		return ResponseEntity.status(HttpStatus.OK).body(products);
	}

	/**
	 * 선택한 제품을 장바구니에서 삭제
	 *
	 * @param products 삭제할 제품 정보를 담은 CartRequestDto 리스트
	 * @return 삭제 작업이 성공하면 true를 반환
	 */
	@PostMapping("/cart/delete/product")
	public ResponseEntity<?> deleteSelectedProduct(@RequestBody List<CartRequestDto> products) {
		boolean result = false;

		for(CartRequestDto product : products) {
			result = purchaseRepository.deleteCartBySales(product);
		}

		return ResponseEntity.status(HttpStatus.OK).body(result);
	}

	/**
	 * 구매 전, 회원의 주소를 조회
	 *
	 * @param email 사용자 이메일을 나타내는 문자열
	 * @return 사용자의 주소 정보를 담은 ResponseEntity
	 */
	@PostMapping("/fetch/purchase/user")
	public ResponseEntity<?> fetchPurchaseUserByUserid(@RequestBody String email) {
		email = email.replaceAll("\"", "");
		UserResponseDto user = userRepository.findAddressByUserId(email);

		return ResponseEntity.status(HttpStatus.OK).body(userService.compareAddress(user));
	}

	/**
	 * 사용자의 배송 정보 조회
	 *
	 * @param email 사용자 이메일을 나타내는 문자열
	 * @return 사용자의 배송 정보를 담은 ResponseEntity
	 */
	@PostMapping("/fetch/purchaseOrder/shippingStatus")
	public ResponseEntity<?> fetchShippingStatusByUserid(@RequestBody String email) {
		email = email.replaceAll("\"", "");
		List<PurchaseOrderResponseDto> shippingStatus = purchaseRepository.findShippingStatusByUserId(email);

		return ResponseEntity.status(HttpStatus.OK).body(shippingStatus);
	}

	/**
	 * 주문 ID에 해당하는 구매 제품 조회
	 *
	 * @param orderIds 주문 ID를 담은 문자열 리스트
	 * @return 각 주문 ID에 대한 구매 제품 목록을 담은 ResponseEntity
	 */
	@PostMapping("/fetch/sales/purchaseProduct")
	public ResponseEntity<?> fetchPurchaseProductByOrderId(@RequestBody List<String> orderIds) {
		List<List<OrderResponseDto>> purchaseProduct = new ArrayList<>();

		for (String orderId : orderIds) {
			purchaseProduct.add(purchaseRepository.findProductByOrderId(orderId));
		}

		return ResponseEntity.status(HttpStatus.OK).body(purchaseProduct);
	}

	private boolean isNot(boolean result) {
		return !result;
	}
}
