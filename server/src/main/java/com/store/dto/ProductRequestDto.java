package com.store.onlineStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductRequestDto {
	private String id;
	private String name;
	private String description;
	private String mainCategory;
	private String subCategory;
	private String encodedImage;
	private String thumbnail;
	private int cost;
	private int price;
	private int quantity;
}
