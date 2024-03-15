package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.ProductResponseDto;
import com.store.onlineStore.dto.WishListRequestDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class WishListRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public WishListRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 위시리스트에 제품 추가
	 *
	 * @param wishlist 위시리스트에 추가할 제품 정보를 담은 WishListRequestDto 객체
	 * @throws DuplicateKeyException 중복된 키가 발생한 경우
	 * @throws RuntimeException 제품 추가가 실패한 경우
	 */
	public void insertWishList(WishListRequestDto wishlist) {
		sql = "INSERT INTO user_wish_list (product_id, user_id) " +
				"VALUES (?, ?)";

		try {
			jdbcTemplate.update(sql, wishlist.getProductId(), wishlist.getUserId());
		} catch (DuplicateKeyException e) {
			throw new DuplicateKeyException("Failed to duplicate key.", e);
		} catch (Exception e) {
			throw new RuntimeException("Failed to insert error", e);
		}
	}

	/**
	 * 위시리스트에서 제품 삭제
	 *
	 * @param wishlist 삭제할 제품 정보를 담은 WishListRequestDto 객체
	 * @throws RuntimeException 위시리스트에서 제품 삭제에 실패한 경우
	 */
	public void deleteWishListByUserId(WishListRequestDto wishlist) {
		sql = "DELETE FROM user_wish_list WHERE product_id = ? AND user_id = ?";

		try {
			jdbcTemplate.update(sql, wishlist.getProductId(), wishlist.getUserId());
		} catch (Exception e) {
			throw new RuntimeException("Failed to delete user_wish_list.", e);
		}
	}

	/**
	 * 위시리스트에서 제품 목록 조회
	 *
	 * @param userId 사용자 ID를 나타내는 문자열
	 * @return 사용자의 위시리스트에 있는 제품 목록을 담은 List<ProductResponseDto>
	 * @throws RuntimeException 위시리스트에서 제품 목록 조회에 실패한 경우
	 */
	public List<ProductResponseDto> findWishListByUserId(String userId) {
		sql = "SELECT p.*\n"
				+ "FROM product p\n"
				+ "JOIN user_wish_list w ON p.id = w.product_id\n"
				+ "WHERE w.user_id = ?";
		try {
			return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), userId);
		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch products in product.", e);
		}
	}
}
