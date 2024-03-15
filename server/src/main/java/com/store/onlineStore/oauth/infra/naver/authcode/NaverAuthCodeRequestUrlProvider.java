package com.store.onlineStore.oauth.infra.naver.authcode;

import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.oauth.domain.authcode.AuthCodeRequestUrlProvider;
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
public class NaverAuthCodeRequestUrlProvider implements AuthCodeRequestUrlProvider {
	private final String NAVER_AUTH_URL = "https://nid.naver.com/oauth2.0/authorize";
	private final NaverOauthConfig naverOauthConfig;

	@Override
	public OauthServerType supportServer() {
		return OauthServerType.NAVER;
	}

	@Override
	public String provide() {
		return UriComponentsBuilder
				.fromUriString(NAVER_AUTH_URL)
				.queryParam("response_type", "code")
				.queryParam("client_id", naverOauthConfig.clientId())
				.queryParam("state", "samplestate")  // 이건 나중에 따로 찾아보고 설정해서 쓰세용!
				.queryParam("redirect_uri", naverOauthConfig.redirectUri())
				.build()
				.toUriString();
	}
}
