package com.store.onlineStore.oauth.domain.authcode;

import com.store.onlineStore.oauth.domain.OauthServerType;

/**
 *  AuthCode를 발급할 URL을 제공함
 *  supportServer()는 자신이 어떤 OauthServerType를 지원할 수 있는지를 나타냄.
 * 		예를 들어, KakaoAuthCodeRequestUrlProvider는 OauthServerType으로 KAKAO를 반환
 *
 *  provide()를 통해 URL을 생성하여 반환하며, 해당 주소로 Redirect 한다면 해당 소셜 로그인 화면이 보여짐
 */
public interface AuthCodeRequestUrlProvider {
	OauthServerType supportServer();
	String provide();
}
