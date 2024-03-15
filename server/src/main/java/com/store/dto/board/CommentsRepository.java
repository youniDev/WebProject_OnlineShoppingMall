package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.CommentRequestDto;
import com.store.onlineStore.dto.CommentResponseDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class CommentsRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public CommentsRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 댓글 등록
	 *
	 * @param comment 등록할 댓글 정보를 담은 CommentRequestDto 객체
	 * @throws RuntimeException 댓글 등록에 실패한 경우
	 */
	public void insertComment(CommentRequestDto comment) {
		sql = "INSERT INTO comments (post_id, comment_user, parent_comment_id, content, image) " +
				"VALUES (?, ?, ?, ?, ?)";

		try {
			jdbcTemplate.update(sql,
					comment.getPostId(),
					comment.getUserId(),
					comment.getParentCommentId(),
					comment.getComment().getContent(),
					comment.getComment().getImage()
			);
		} catch (Exception e) {
			log.info(e.toString());
			throw new RuntimeException("Failed to insert comment", e);
		}
	}

	/**
	 * 댓글 삭제
	 *
	 * @param commentId 삭제할 댓글의 ID를 나타내는 문자열
	 * @throws RuntimeException 댓글 삭제에 실패한 경우
	 */
	public void deleteCommentById(String commentId) {
		sql = "DELETE FROM comments WHERE id = ?";

		try {
			jdbcTemplate.update(sql, commentId);
		} catch (Exception e) {
			log.info(e.toString());
			throw new RuntimeException("Failed to delete comment.", e);
		}
	}

	/**
	 * 글 ID를 기준으로 해당 글의 댓글 조회
	 *
	 * @param postId 조회할 글의 ID를 나타내는 문자열
	 * @return 해당 글에 대한 댓글 목록을 담은 List<CommentResponseDto> 객체
	 * @throws RuntimeException 댓글 조회에 실패한 경우
	 */
	public List<CommentResponseDto> findPostById(String postId) {
		sql = "SELECT id AS commentId, post_id AS postId, parent_comment_id AS parentCommentId, comment_user AS commentUserId, content, image, "
				+ "DATE_FORMAT(create_at, '%Y/%m/%d') AS createDate, "
				+ "DATE_FORMAT(update_at, '%Y/%m/%d') AS updateDate"
				+ " FROM comments WHERE post_id = ?";

		try {
			return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(CommentResponseDto.class), postId);
		} catch (Exception e) {
			log.error(e.toString());
			throw new RuntimeException("Failed to select comment by id", e);
		}
	}
}
