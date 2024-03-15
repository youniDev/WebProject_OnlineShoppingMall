package com.store.onlineStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequestDto {
	private int id;
	private int postId;
	private Integer parentCommentId;
	private String userId;
	private CommentDto comment;
}
