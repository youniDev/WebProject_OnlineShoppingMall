package com.store.onlineStore.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

import jakarta.annotation.PostConstruct;

@Component
public class SmsUtil {

	@Value("${coolsms.api.key}")
	private String apiKey;
	@Value("${coolsms.api.secret}")
	private String apiSecretKey;
	@Value("${coolsms.api.callerID}")
	private String callerID;
	private DefaultMessageService messageService;

	@PostConstruct
	public void init() {
		System.out.println("Init method is called!");

		this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecretKey, "https://api.coolsms.co.kr");
	}

	/**
	 * 단일 메시지 발송 예제
	 */
	public SingleMessageSentResponse sendOne(String to, String verificationCode) {
		Message message = new Message();
		// 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
		message.setFrom(callerID);
		message.setTo(to);
		message.setText("[SHOPPING MALL]\n아래의 인증번호를 입력해주세요.\n[ " + verificationCode+ " ]");

		SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));

		return response;
	}
}
