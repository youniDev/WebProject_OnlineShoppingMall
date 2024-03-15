package com.store.onlineStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDto {
	private int commentId;
	private int postId;
	private Integer parentCommentId; //null 허용 데이터 타입 사용
	private String commentUserId;
	private String content;
	private String image;
	private String createDate;
	private String updateDate;
}
