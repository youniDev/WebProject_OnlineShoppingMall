package com.store.onlineStore.oauth.infra.google;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * application.yml에 oauth.google 설정된 정보들을 통해 생성
 *
 * @param redirectUri
 * @param clientId
 * @param clientSecret
 * @param scope
 */

@ConfigurationProperties(prefix = "oauth.google")
public record GoogleOauthConfig (
		String redirectUri,
		String clientId,
		String clientSecret,
		String[] scope
	) {
}
