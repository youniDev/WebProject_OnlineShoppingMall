package com.store.onlineStore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.CommentRequestDto;
import com.store.onlineStore.dto.CommentResponseDto;
import com.store.onlineStore.dto.PostResponseDto;
import com.store.onlineStore.dto.WriteRequestDto;
import com.store.onlineStore.repository.CommentsRepository;
import com.store.onlineStore.repository.WriteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class BoardController {
	@Autowired
	WriteRepository writeRepository;
	@Autowired
	CommentsRepository commentsRepository;

	/**
	 * 글 등록
	 *
	 * @param write 추가할 글의 정보를 담은 WriteRequestDto 객체
	 * @return 글 추가가 성공하면 true를 반환하며, 실패한 경우 400 Bad Request를 반환
	 */
	@PostMapping("/add/write")
	public ResponseEntity<?> addWrite(@RequestBody WriteRequestDto write) {
		try {
			write.getPost().setCategory(writeRepository.findCategoryId(write.getPost().getCategory()));

			// update
			if ((write.getPost().getId()) != 0) {
				writeRepository.updateAll(write);

				return ResponseEntity.status(HttpStatus.OK).body(true);
			}
			writeRepository.insertWrite(write);

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 글 삭제
	 *
	 * @param writeId 삭제할 글의 ID를 나타내는 문자열
	 * @return 글 삭제가 성공하면 true를 반환하며, 실패한 경우 400 Bad Request를 반환
	 */
	@PostMapping("/delete/write")
	public ResponseEntity<?> deleteWrite(@RequestBody String writeId) {
		writeId = writeId.replaceAll("\"", "");

		try {
			writeRepository.deleteWriteById(writeId);

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 댓글 추가
	 *
	 * @param comment 추가할 댓글 정보를 담은 CommentRequestDto 객체
	 * @return 댓글 추가가 성공하면 true를 반환하며, 실패한 경우 400 Bad Request를 반환
	 */
	@PostMapping("/add/comments")
	public ResponseEntity<?> addComments(@RequestBody CommentRequestDto comment) {
		try {
			commentsRepository.insertComment(comment);

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 댓글 삭제
	 *
	 * @param commentId 삭제할 댓글의 ID를 나타내는 문자열
	 * @return 댓글 삭제가 성공하면 true를 반환하며, 실패한 경우 400 Bad Request를 반환
	 */
	@PostMapping("/delete/comments")
	public ResponseEntity<?> deleteComments(@RequestBody String commentId) {
		commentId = commentId.replaceAll("\"", "");

		try {
			commentsRepository.deleteCommentById(commentId);

			return ResponseEntity.status(HttpStatus.OK).body(true);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 게시판에 등록된 모든 글을 조회
	 *
	 * @return 게시판에 등록된 모든 글 목록을 담은 ResponseEntity
	 *			조회에 실패할 경우 400 Bad Request를 반환
	 */
	@GetMapping("/fetch/post")
	public ResponseEntity<?> getPost() {
		try {
			List<PostResponseDto> posts = writeRepository.findAll();

			return ResponseEntity.status(HttpStatus.OK).body(posts);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 특정 카테고리에 해당하는 게시판 글을 조회
	 *
	 * @param category 조회할 글의 카테고리를 나타내는 문자열
	 * @return 특정 카테고리에 해당하는 게시판 글 목록을 담은 ResponseEntity
	 *			조회에 실패할 경우 400 Bad Request를 반환
	 */
	@PostMapping("/fetch/post/category")
	public ResponseEntity<?> getPostByCategory(@RequestBody String category) {
		category = category.replaceAll("\"", "");
		List<PostResponseDto> posts;

		try {
			if (category.equals("COMMUNITY")) {
				posts = writeRepository.findAll();
			} else {
				posts = writeRepository.findPostByCategory(category);
			}

			return ResponseEntity.status(HttpStatus.OK).body(posts);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}

	/**
	 * 특정 게시물에 해당하는 댓글 조회
	 *
	 * @param postId 조회할 댓글이 속한 게시물의 ID를 나타내는 문자열
	 * @return 특정 게시물에 해당하는 댓글 목록을 담은 ResponseEntity
	 * 			조회에 실패할 경우 400 Bad Request를 반환합니다.
	 */
	@PostMapping("/fetch/comments")
	public ResponseEntity<?> getPostByPostId(@RequestBody String postId) {
		postId = postId.replaceAll("\"", "");

		try {
			List<CommentResponseDto> comments = commentsRepository.findPostById(postId);

			return ResponseEntity.status(HttpStatus.OK).body(comments);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString());
		}
	}
}
