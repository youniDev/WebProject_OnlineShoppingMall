package com.store.onlineStore.service;

import java.util.StringTokenizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Service;

import com.store.onlineStore.dto.registerDTO.UserResponseDto;
import com.store.onlineStore.repository.UserRepository;
import com.store.onlineStore.util.EmailUtil;
import com.store.onlineStore.util.RandomNum;
import com.store.onlineStore.util.RedisUtil;
import com.store.onlineStore.util.SmsUtil;

@Service
public class UserService {

	UserRepository userRepository;
	final int random = 5;
	@Autowired
	SmsUtil sms;
	@Autowired
	EmailUtil email;
	@Autowired
	RedisUtil redisUtil;

	// 문자 인증 번호 전송
	public ResponseEntity<?> sendVerificationCodeByPhone(String telephone) {
		String verificationCode = new RandomNum(random).getNum();

		// 300원만 무료....sms 1건당 10원...
		//sms.sendOne(telephone, verificationCode);

		return ResponseEntity.ok(verificationCode);
	}

	// 이메일 인증 번호 전송
	public ResponseEntity<?> sendVerificationCodeByEmail(String mail) {
		String verificationCode = new RandomNum(random).getNum();
		// send 이메일
		// email.sendMail(mail, verificationCode);

		return ResponseEntity.ok(verificationCode);
	}

	// address 분리
	public UserResponseDto compareAddress(UserResponseDto user) {
		StringTokenizer tokenizer = new StringTokenizer(user.getAddress(), "/");

		user.setAddress(tokenizer.nextToken());
		user.setDetail(tokenizer.nextToken());

		return user;
	}
}
