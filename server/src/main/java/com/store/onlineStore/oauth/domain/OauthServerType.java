package com.store.onlineStore.oauth.domain;

import java.util.Locale;

/**
 * Oauth2.0 인증을 제공하는 서버 종류를 명시 할 enum
 */
public enum OauthServerType {
	NAVER,
	KAKAO,
	GOOGLE,
	;

	public static OauthServerType fromName(String type) {
		return OauthServerType.valueOf(type.toUpperCase(Locale.ENGLISH));
	}
}
