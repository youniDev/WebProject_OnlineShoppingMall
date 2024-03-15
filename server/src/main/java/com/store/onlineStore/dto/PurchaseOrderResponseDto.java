package com.store.onlineStore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderResponseDto {
	// purchase_order table
	private String order_id; // order id
	private String shipping_status; // 배송 상태
	private String purchase_date; // 주문 날짜
	private String due_date; // 입금 기한 날짜
	private int total_cost; // 총 금액
}
