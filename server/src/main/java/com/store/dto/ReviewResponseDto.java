package com.store.onlineStore.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewResponseDto {
	private String user_id;
	private String review;
	private String image;
	private String createDate;
	private String updateDate;
	private int rating;
}
