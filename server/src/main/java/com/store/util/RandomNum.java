package com.store.onlineStore.util;

import java.util.Random;

import lombok.Getter;

@Getter
public class RandomNum {
	private String num = "";

	public RandomNum(int max){
		this.num = generateRandomNum(max);
	}

	private String generateRandomNum(int max) {
		for (int i = 0; i < max; i++) {
			num += generateNum();
		}

		return num;
	}
	private int generateNum() {
		// Random 객체 생성
		Random random = new Random();

		// 0 이상 10 미만의 랜덤 정수 생성
		return random.nextInt(10);
	}
}
