package com.store.onlineStore.oauth.infra.google;

import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.oauth.domain.client.OauthMemberClient;
import com.store.onlineStore.oauth.infra.google.client.GoogleApiClient;
import com.store.onlineStore.oauth.infra.google.dto.GoogleMemberResponse;
import com.store.onlineStore.oauth.infra.google.dto.GoogleToken;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleMemberClient implements OauthMemberClient {
	private final GoogleApiClient googleApiClient;
	private final GoogleOauthConfig googleOauthConfig;

	@Override
	public OauthServerType supportServer() {
		return OauthServerType.GOOGLE;
	}

	@Override
	public SocialRegistrationDto fetch(String authCode) {
		GoogleToken tokenInfo = googleApiClient.fetchToken(tokenRequestParams(authCode));

		GoogleMemberResponse googleMemberResponse = googleApiClient.fetchMember("Bearer " + tokenInfo.access_token()); // AccessToken을 가지고 회원 정보를 받아옴

		log.info(googleMemberResponse.toString());

		SocialRegistrationDto socialRegistrationDto = googleMemberResponse.toDomainGoogle();

		log.info(socialRegistrationDto.toString());

		return socialRegistrationDto; // 회원 정보를 OauthMember 객체로 변환
	}

	// 토큰 받기 API의 요청에 사용되는 요청 파라미터를 설정
	private MultiValueMap<String, String> tokenRequestParams(String authCode) {
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("client_id", googleOauthConfig.clientId());
		params.add("client_secret", googleOauthConfig.clientSecret());
		params.add("code", authCode);
		params.add("grant_type", "authorization_code");
		params.add("redirect_uri", googleOauthConfig.redirectUri());
		return params;
	}
}
