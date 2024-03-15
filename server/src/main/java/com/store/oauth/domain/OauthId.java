package com.store.onlineStore.oauth.domain;

import static jakarta.persistence.EnumType.STRING;
import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * 서로 다른 서비스간 혹시 모를 식별자의 중복을 예방하기 위한 클래스
 *
 */
@Embeddable
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
public class OauthId {

	@Column(nullable = false, name = "oauth_server_id")
	private String oauthServerId; 	// 특정 인증 서버의 식별자 값

	@Enumerated(STRING)
	@Column(nullable = false, name = "oauth_server")
	private OauthServerType oauthServerType;

	public String oauthServerId() {
		return oauthServerId;
	}

	public OauthServerType oauthServer() {
		return oauthServerType;
	}
}
