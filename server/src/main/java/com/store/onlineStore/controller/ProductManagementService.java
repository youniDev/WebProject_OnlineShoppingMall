package com.store.onlineStore.service;

import org.springframework.stereotype.Service;

import com.store.onlineStore.util.RandomNum;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProductManagementService {
	int IDENTIFICATION_NUMBER = 5;

	/**
	 * 카테고리 ID를 기반으로 제품 ID를 생성합니다.
	 *
	 * @param categoryId 제품을 생성할 카테고리의 ID
	 * @return 생성된 제품의 ID
	 */
	public String generateProductId(String categoryId) {
		categoryId += new RandomNum(IDENTIFICATION_NUMBER).getNum();

		return categoryId;
	}
}
