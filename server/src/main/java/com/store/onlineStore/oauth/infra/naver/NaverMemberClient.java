package com.store.onlineStore.oauth.infra.naver;

import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.oauth.domain.OauthMember;
import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.oauth.domain.client.OauthMemberClient;
import com.store.onlineStore.oauth.infra.naver.client.NaverApiClient;
import com.store.onlineStore.oauth.infra.naver.dto.NaverMemberResponse;
import com.store.onlineStore.oauth.infra.naver.dto.NaverToken;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class NaverMemberClient implements OauthMemberClient {

	private final NaverApiClient naverApiClient;
	private final NaverOauthConfig naverOauthConfig;

	@Override
	public OauthServerType supportServer() {
		return OauthServerType.NAVER;
	}

	@Override
	public SocialRegistrationDto fetch(String authCode) {
		MultiValueMap<String, String> tokenRequest = tokenRequestParams(authCode);
		NaverToken tokenInfo = naverApiClient.fetchToken(tokenRequest); // 먼저 Auth Code를 통해서 AccessToken을 조회
		NaverMemberResponse naverMemberResponse = naverApiClient.fetchMember("Bearer " + tokenInfo.accessToken()); // AccessToken을 가지고 회원 정보를 받아옴

		SocialRegistrationDto socialRegistrationDto = naverMemberResponse.toDomainByNaver();
		log.info(socialRegistrationDto.toString());

		return socialRegistrationDto; // 회원 정보를 OauthMember 객체로 변환
	}

	// 토큰 받기 API의 요청에 사용되는 요청 파라미터를 설정
	private MultiValueMap<String, String> tokenRequestParams(String authCode) {
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", naverOauthConfig.clientId());
		params.add("client_secret", naverOauthConfig.clientSecret());
		params.add("code", authCode);
		params.add("state", naverOauthConfig.state());
		return params;
	}
}
