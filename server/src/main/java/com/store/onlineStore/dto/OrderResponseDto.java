package com.store.onlineStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto {
	private String orderId;
	private String productId;
	private String name;
	private String reviewId;
	private int cost;
	private int purchaseQuantity;
}
