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

import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.dto.WishListRequestDto;
import com.store.onlineStore.repository.UserRepository;
import com.store.onlineStore.repository.WishListRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class UserController {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private WishListRepository wishListRepository;

	/**
	 * 사용자의 위시리스트에 제품 추가
	 *
	 * @param wishList 위시리스트에 추가할 제품 정보를 담은 WishListRequestDto 객체
	 * @return 위시리스트에 제품 추가가 성공하면 true를 반환하며, 중복된 제품일 경우 400 Bad Request를 반환
	 */
	@PostMapping("/add/wishList")
	public ResponseEntity<?> addWishListByUserId(@RequestBody WishListRequestDto wishList) {
		try {
			wishListRepository.insertWishList(wishList);
			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (DuplicateKeyException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("duplicate entry");	// 중복일 경우
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}

	/**
	 * 사용자의 위시리스트에서 제품 삭제
	 *
	 * @param wishList 삭제할 제품 정보를 담은 WishListRequestDto 객체
	 * @return 제품 삭제가 성공하면 true를 반환하며, 실패한 경우 400 Bad Request를 반환
	 */
	@PostMapping("/delete/wishList")
	public ResponseEntity<?> deleteWishListByUserId(@RequestBody WishListRequestDto wishList) {
		try {
			wishListRepository.deleteWishListByUserId(wishList);
			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}

	/**
	 * 사용자의 위시리스트 조회
	 *
	 * @param wishlist 사용자의 위시리스트를 조회할 사용자 ID를 담은 WishListRequestDto 객체
	 * @return 사용자의 위시리스트에 있는 제품 목록을 담은 ResponseEntity
	 */
	@PostMapping("/fetch/wishList/userId")
	public ResponseEntity<?> fetchWishListByUserId(@RequestBody WishListRequestDto wishlist) {
		try {
			List<ProductResponseDto> products = wishListRepository.findWishListByUserId(wishlist.getUserId());
			return ResponseEntity.status(HttpStatus.OK).body(products);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
		}
	}
}
