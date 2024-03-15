package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.PostResponseDto;
import com.store.onlineStore.dto.WriteRequestDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class WriteRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public WriteRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 카테고리 이름을 기준으로 카테고리 ID 조회
	 *
	 * @param category 카테고리 이름
	 * @return 조회된 카테고리 ID
	 * @throws RuntimeException 카테고리 ID 조회 실패한 경우
	 */
	public String findCategoryId(String category) {
		sql = "SELECT id FROM board_category WHERE name = ?";

		try {
			return jdbcTemplate.queryForObject(sql, String.class, category);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to find category_id by category_name", e);
		}
	}

	/**
	 * 글 등록
	 *
	 * @param write 작성할 글 정보를 담은 WriteRequestDto 객체
	 * @throws RuntimeException 글 등록에 실패한 경우
	 */
	public void insertWrite(WriteRequestDto write) {
		sql = "INSERT INTO write_post (user_id, title, content, category, image) " +
				"VALUES (?, ?, ?, ?, ?)";

		try {
			jdbcTemplate.update(sql,
					write.getUserId(),
					write.getPost().getTitle(),
					write.getPost().getContent(),
					write.getPost().getCategory(),
					write.getPost().getImage()
					);
		} catch (Exception e) {
			log.info(e.toString());
			throw new RuntimeException("Failed to insert write", e);
		}
	}

	/**
	 * 글 수정
	 *
	 * @param write 수정할 글 정보를 담은 WriteRequestDto 객체
	 * @throws RuntimeException 글 수정에 실패한 경우
	 */
	public void updateAll(WriteRequestDto write) {
		sql = "UPDATE write_post SET (title, content, category, image) "
				+ "VALUES (?, ?, ?, ?, ?) "
				+ "WHERE id = ? AND user_id = ?";

		try {
			jdbcTemplate.update(
					sql,
					write.getPost().getTitle(),
					write.getPost().getContent(),
					write.getPost().getCategory(),
					write.getPost().getImage(),
					write.getPost().getId(),
					write.getUserId()
			);
		} catch (Exception e) {
			log.info(e.toString());
			throw new RuntimeException("Failed to update write.", e);
		}
	}

	/**
	 * 글 삭제
	 *
	 * @param writeId 삭제할 글의 ID를 나타내는 문자열
	 * @throws RuntimeException 글 삭제에 실패한 경우
	 */
	public void deleteWriteById(String writeId) {
		sql = "DELETE FROM write_post WHERE id = ?";

		try {
			jdbcTemplate.update(sql, writeId);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to delete write.", e);
		}
	}

	/**
	 * 등록된 모든 글 조회
	 *
	 * @return 모든 글 목록을 담은 List<PostResponseDto> 객체
	 * @throws RuntimeException 글 조회에 실패한 경우
	 */
	public List<PostResponseDto> findAll() {
		sql = "SELECT \n"
				+ "    wp.id AS postId, \n"
				+ "    wp.user_id AS userId, \n"
				+ "    wp.title, \n"
				+ "    wp.content, \n"
				+ "    wp.image,\n"
				+ "    DATE_FORMAT(wp.create_at, '%Y/%m/%d') AS createDate,\n"
				+ "    DATE_FORMAT(wp.update_at, '%Y/%m/%d') AS updateDate,\n"
				+ "    bc.name AS category\n"
				+ "FROM write_post wp\n"
				+ "JOIN board_category bc ON bc.id = wp.category;";

		try {
			return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PostResponseDto.class));
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to select post", e);
		}
	}

	/**
	 * 특정 카테고리에 속한 글 조회
	 *
	 * @param category 조회할 글의 카테고리
	 * @return 특정 카테고리에 속한 글 목록을 담은 List<PostResponseDto> 객체
	 * @throws RuntimeException 글 조회에 실패한 경우
	 */
	public List<PostResponseDto> findPostByCategory(String category) {
		sql = "SELECT \n"
				+ "    wp.id AS postId, \n"
				+ "    wp.user_id AS userId, \n"
				+ "    wp.title, \n"
				+ "    wp.content, \n"
				+ "    wp.image,\n"
				+ "    DATE_FORMAT(wp.create_at, '%Y/%m/%d') AS createDate,\n"
				+ "    DATE_FORMAT(wp.update_at, '%Y/%m/%d') AS updateDate\n"
				+ "FROM write_post wp\n"
				+ "JOIN board_category bc ON bc.id = wp.category\n"
				+ "WHERE bc.name = ?";

		try {
			return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PostResponseDto.class), category);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to select write by category", e);
		}
	}

	/*
	public PostResponseDto findPostById(String postId) {
		sql = "SELECT\n"
				+ "    wp.id AS postId, \n"
				+ "    wp.user_id AS userId, \n"
				+ "    wp.title, \n"
				+ "    wp.content, \n"
				+ "    wp.image,\n"
				+ "    DATE_FORMAT(wp.create_at, '%Y/%m/%d') AS createDate,\n"
				+ "    DATE_FORMAT(wp.update_at, '%Y/%m/%d') AS updateDate,\n"
				+ "    bc.name AS category\n"
				+ "FROM write_post wp\n"
				+ "LEFT JOIN board_category bc ON wp.category = bc.id\n"
				+ "WHERE wp.id = ?";

		try {
			return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(PostResponseDto.class), postId);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to select write by id", e);
		}
	}
	 */
}
