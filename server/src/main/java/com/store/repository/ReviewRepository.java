package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.ReviewRequestDto;
import com.store.onlineStore.dto.ReviewResponseDto;
import com.store.onlineStore.dto.ReviewWrittenRequestDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class ReviewRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public ReviewRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 제품 리뷰 등록
	 *
	 * @param salesId 판매 ID
	 * @param reviewRequest 리뷰 요청 정보를 담은 ReviewRequestDto 객체
	 */
	public void insertProductReview(String salesId, ReviewRequestDto reviewRequest) {
		sql = "INSERT INTO product_review (sales_id, review, image, rating)\n"
				+ "VALUES (?, ?, ?, ?)";
		try {
			jdbcTemplate.update(
					sql,
					salesId,
					reviewRequest.getReview().getReview(),
					reviewRequest.getReview().getImage(),
					reviewRequest.getReview().getRating()
			);
		} catch (DataIntegrityViolationException e) {
			log.info(e.toString());
			throw new DataIntegrityViolationException("duplicate", e);
		} catch (Exception e) {
			log.info(e.toString());
			throw new RuntimeException("Failed to insert product_review.", e);
		}
	}

	/**
	 * 제품 ID를 기반으로 해당 제품에 대한 리뷰를 조회
	 *
	 * @param productId 조회할 제품의 ID
	 * @return 제품에 대한 리뷰 목록을 담은 ReviewResponseDto 객체의 리스트
	 */
	public List<ReviewResponseDto> findReviewByProductId(String productId) {
		sql = "SELECT po.user_id,\n"
				+ "  pr.review, pr.image, pr.rating,\n"
				+ "  DATE_FORMAT(pr.create_at, '%Y/%m/%d') AS createDate,\n"
				+ "  DATE_FORMAT(pr.updated_at, '%Y/%m/%d') AS updateDate\n"
				+ "FROM purchase_order po\n"
				+ "JOIN sales s ON po.id = s.order_id\n"
				+ "LEFT JOIN product_review pr ON s.review_id = pr.id\n"
				+ "WHERE s.product_id = ?";
		try {
			return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ReviewResponseDto.class),
					productId);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to fetch products in product_review.", e);
		}
	}

	/**
	 * 특정 주문 및 제품에 대한 리뷰 작성 여부를 확인
	 *
	 * @param review 작성 여부를 확인할 ReviewWrittenRequestDto 객체
	 * @return 리뷰 작성 여부를 나타내는 boolean 값
	 */
	public boolean isWrittenReview(ReviewWrittenRequestDto review) {
		sql = "SELECT CASE WHEN review_id IS NOT NULL THEN TRUE ELSE FALSE END AS has_review\n"
				+ "FROM sales\n"
				+ "WHERE order_id = ? AND product_id = ?";
		try {
			return jdbcTemplate.queryForObject(sql, Boolean.class,
					review.getOrderId(),
					review.getProductId()
			);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to fetch written review in product_review.", e);
		}
	}
}
