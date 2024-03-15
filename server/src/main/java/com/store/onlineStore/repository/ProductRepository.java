package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.ProductRequestDto;
import com.store.onlineStore.dto.ProductResponseDto;

import lombok.extern.slf4j.Slf4j;
/**
 * 주문 접수(Order Received): 고객이 주문을 완료하고 판매자가 주문을 접수한 단계
 *
 * 결제 완료(Payment Confirmed): 결제가 성공적으로 처리되어 돈이 판매자에게 이체된 상태
 *
 * 배송 준비중(Preparing for Shipment): 주문이 접수되고 결제가 완료된 후, 제품이 포장되고 배송 준비 단계
 *
 * 배송 중(Shipped): 상품이 배송되어 고객에게 향하고 있는 상태
 *
 * 배송 완료(Delivered): 상품이 고객에게 성공적으로 전달되었고, 주문이 완료된 상태
 *
 * 주문 취소(Canceled): 주문이 취소되어 주문이 완전히 취소된 상태
 */
@Slf4j
@Repository
public class ProductRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public ProductRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void insertProduct(ProductRequestDto product) {
		sql = "INSERT INTO product (id, name, description, category, cost, price, quantity, image, thumbnail) " +
				"VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		try {
			jdbcTemplate.update(
					sql,
					product.getId(),
					product.getName(),
					product.getDescription(),
					product.getSubCategory(),
					product.getCost(),
					product.getPrice(),
					product.getQuantity(),
					product.getEncodedImage(),
					product.getThumbnail()
			);
		} catch (Exception e) {
			throw new RuntimeException("Failed to insert user.", e);
		}
	}

	public void deleteProductById(String productId) {
		sql = "DELETE FROM product WHERE id = ?";

		try {
			jdbcTemplate.update(sql, productId);
		} catch (Exception e) {
			throw new RuntimeException("Failed to insert user.", e);
		}
	}

	public void updateAll(ProductRequestDto product) {
		sql = "UPDATE product SET name=?, description=?, category=?, cost=?, price=?, quantity=?, image=?, thumbnail=? WHERE id=?";

		try {
			jdbcTemplate.update(
					sql,
					product.getName(),
					product.getDescription(),
					product.getSubCategory(),
					product.getCost(),
					product.getPrice(),
					product.getQuantity(),
					product.getEncodedImage(),
					product.getThumbnail(),
					product.getId()
			);
		} catch (Exception e) {
			throw new RuntimeException("Failed to update product.", e);
		}
	}

	public void updateDeliveryAvailabilityById(String productId, char status) {
		sql = "UPDATE product SET delivery_availability = " + status + " WHERE id = ?";

		try {
			jdbcTemplate.update(sql, productId);
		} catch (Exception e) {
			throw new RuntimeException("Failed to update product");
		}
	}

	public String findProductIdByCategory(String category) {
		sql = "SELECT category_id, sub_category_id FROM product_category WHERE category_name = ?";

		return jdbcTemplate.query(sql, (rs) -> {
			if (rs.next()) {
				return rs.getString("category_id") + rs.getString("sub_category_id");
			}
			return null;	//throw new 로 바꾸기
		}, category);
	}

	// 여기 수정 중
	public List<ProductResponseDto> findProductByCategory(String category) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.image, p.category, p.delivery_availability, DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate " +
				"FROM product p " +
				"LEFT JOIN product_category c ON p.category = c.category_name " +
				"WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?) AND p.image NOT LIKE 'Nothing%'";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), category, category);
	}

	// 등록된 모든 제품 정보 불러오기
	public List<ProductResponseDto> selectAll() {

		sql = "SELECT p.*, DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate, COALESCE(s.purchaseQuantity, 0) AS purchaseQuantity\n"
				+ "FROM product p \n"
				+ "LEFT JOIN sales s "
				+ "ON s.product_id = p.id";

		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.quantity, p.category, p.delivery_availability, DATE_FORMAT(p.created_at, '%Y%m%d') AS createDate, COALESCE(s.purchaseQuantity, 0) AS purchaseQuantity\n"
				+ "FROM product p \n"
				+ "LEFT JOIN sales s "
				+ "ON s.product_id = p.id";
		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class));
	}

	// 해당 제품에 대한 이미지 불러오기
	public String findProductImagesById(String id) {
		sql = "SELECT image FROM product WHERE id = ?";
		try {
			return jdbcTemplate.queryForObject(sql, String.class, id);
		} catch (EmptyResultDataAccessException e) {
			log.error(e.toString());
			throw new RuntimeException(e);
		}
	}

	public ProductResponseDto findAllById(String id) {
		sql = "SELECT * FROM product WHERE id = ?";

		List<ProductResponseDto> resultList = jdbcTemplate.query(
				sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), id);

		return resultList.isEmpty() ? null : resultList.get(0);
	}

	public List<ProductResponseDto> findBestItem() {
		sql = "SELECT p.*, COALESCE(s.purchaseQuantity, 0) AS purchaseQuantity\n"
				+ "FROM product p \n"
				+ "LEFT JOIN sales s ON s.product_id = p.id\n"
				+ "ORDER BY p.created_at DESC, purchaseQuantity DESC\n"
				+ "LIMIT 8";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class));
	}

	public List<ProductResponseDto> findNewItem() {
		sql = "SELECT p1.*\n"
				+ "FROM product p1\n"
				+ "JOIN (\n"
				+ "    SELECT category, MAX(created_at) AS max_created_at\n"
				+ "    FROM product\n"
				+ "    GROUP BY category\n"
				+ ") p2 ON p1.category = p2.category AND p1.created_at = p2.max_created_at\n"
				+ "ORDER BY p1.created_at DESC\n"
				+ "LIMIT 8";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class));
	}

	public List<ProductResponseDto> findBestItemByCategory(String category) {
		sql = "SELECT p.id, p.name, p.description, p.cost, p.price, p.image, p.category\n"
				+ "FROM product p\n"
				+ "LEFT JOIN product_category c ON p.category = c.category_name\n"
				+ "LEFT JOIN (\n"
				+ "    SELECT product_id, SUM(purchaseQuantity) as totalQuantity\n"
				+ "    FROM sales\n"
				+ "    GROUP BY product_id\n"
				+ ") s ON p.id = s.product_id\n"
				+ "WHERE (c.category_name = ? OR COALESCE(c.main_category_name, c.category_name) = ?)\n"
				+ "ORDER BY COALESCE(s.totalQuantity, 0) DESC\n"
				+ "LIMIT 10;";

		return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ProductResponseDto.class), category, category);
	}
}
