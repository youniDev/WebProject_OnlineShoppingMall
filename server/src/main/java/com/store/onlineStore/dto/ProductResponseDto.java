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
public class ProductResponseDto {
	private String id;
	private String name;
	private String description;
	private String category;
	private String image;
	private String delivery_availability;
	private String createDate;
	private int cost;
	private int price;
	private int quantity;
	private int purchaseQuantity;
}
