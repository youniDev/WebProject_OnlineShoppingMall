package com.store.onlineStore.oauth.infra.naver;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * application.yml에 oauth.naver로 설정된 정보들을 통해 생성
 *
 * @param redirectUri
 * @param clientId
 * @param clientSecret
 * @param scope
 * @param state
 */
@ConfigurationProperties(prefix = "oauth.naver")
public record NaverOauthConfig(
	String redirectUri,
	String clientId,
	String clientSecret,
	String[] scope,
	String state
) {
}
