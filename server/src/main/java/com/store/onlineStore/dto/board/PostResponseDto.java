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
public class PostResponseDto {
	private int postId;
	private String userId;
	private String category;
	private String title;
	private String content;
	private String image;
	private String createDate;
	private String updateDate;
}
