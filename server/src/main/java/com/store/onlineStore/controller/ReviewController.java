package com.store.onlineStore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.ReviewRequestDto;
import com.store.onlineStore.dto.ReviewResponseDto;
import com.store.onlineStore.dto.ReviewWrittenRequestDto;
import com.store.onlineStore.repository.PurchaseRepository;
import com.store.onlineStore.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {
	@Autowired
	ReviewRepository reviewRepository;
	@Autowired
	PurchaseRepository purchaseRepository;

	/**
	 * 리뷰 등록
	 *
	 * @param review 추가할 리뷰 정보를 담은 ReviewRequestDto 객체
	 * @return 리뷰 추가가 성공하면 true를 반환하며, 중복된 리뷰가 있을 경우 400 Bad Request를 반환
	 */
	@PostMapping("/add/review")
	public ResponseEntity<?> addWishListByUserId(@RequestBody ReviewRequestDto review) {
		try {
			String salesId = purchaseRepository.findSalesIdByOrderId(review.getOrderId(), review.getReview().getProductId());
			reviewRepository.insertProductReview(salesId, review);
			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (DuplicateKeyException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
		catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 제품 ID를 기반으로 해당 제품에 대한 리뷰를 조회
	 *
	 * @param productId 제품 ID를 나타내는 문자열
	 * @return 해당 제품에 대한 리뷰 목록을 담은 ResponseEntity
	 */
	@PostMapping("/fetch/review/productId")
	public ResponseEntity<?> fetchReviewByProductId(@RequestBody String productId) {
		productId = productId.replaceAll("\"", "");

		try {
			List<ReviewResponseDto> reviews = reviewRepository.findReviewByProductId(productId);

			return ResponseEntity.status(HttpStatus.OK).body(reviews);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}

	/**
	 * 특정 주문과 제품에 대한 리뷰 작성 여부를 확인
	 *
	 * @param review 리뷰 작성 여부를 확인할 정보를 담은 ReviewWrittenRequestDto 객체
	 * @return 리뷰가 작성되었으면 true를, 아니면 false를 반환하는 ResponseEntity
	 */
	@PostMapping("/fetch/written/review")
	public ResponseEntity<?> fetchReviewWritten(@RequestBody ReviewWrittenRequestDto review) {
		try {
			return ResponseEntity.status(HttpStatus.OK).body(reviewRepository.isWrittenReview(review));
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}
}
