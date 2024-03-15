package com.store.onlineStore.oauth.infra.kakao.authcode;

import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.oauth.domain.authcode.AuthCodeRequestUrlProvider;
import com.store.onlineStore.oauth.infra.kakao.KakaoOauthConfig;
import com.store.onlineStore.oauth.infra.naver.NaverOauthConfig;

import lombok.RequiredArgsConstructor;

/**
 *  [요청 변수 정보]
 * response_type: code
 * client_id: naver-client-id
 * redirect_uri: naver-redirected-uri
 * state: (URL 인코딩을 적용한 값 사용)
 * */
@Component
@RequiredArgsConstructor
public class KakaoAuthCodeRequestUrlProvider implements AuthCodeRequestUrlProvider {
	private final String KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
	private final KakaoOauthConfig kakaoOauthConfig;

	@Override
	public OauthServerType supportServer() {
		return OauthServerType.KAKAO;
	}

	@Override
	public String provide() {
		return UriComponentsBuilder
				.fromUriString(KAKAO_AUTH_URL)
				.queryParam("response_type", "code")
				.queryParam("client_id", kakaoOauthConfig.clientId())
				.queryParam("redirect_uri", kakaoOauthConfig.redirectUri())
				.toUriString();
	}
}
