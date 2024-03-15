package com.store.onlineStore.oauth.infra.google.authcode;

import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.oauth.domain.authcode.AuthCodeRequestUrlProvider;
import com.store.onlineStore.oauth.infra.google.GoogleOauthConfig;

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
public class GoogleAuthCodeRequestUrlProvider implements AuthCodeRequestUrlProvider {
	private final String GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
	private final GoogleOauthConfig googleOauthConfig;

	@Override
	public OauthServerType supportServer() {
		return OauthServerType.GOOGLE;
	}

	@Override
	public String provide() {
		return UriComponentsBuilder
				.fromUriString(GOOGLE_AUTH_URL)
				.queryParam("response_type", "code")
				.queryParam("client_id", googleOauthConfig.clientId())
				.queryParam("redirect_uri", googleOauthConfig.redirectUri())
				.queryParam("scope", googleOauthConfig.scope())
				.toUriString();
	}
}
