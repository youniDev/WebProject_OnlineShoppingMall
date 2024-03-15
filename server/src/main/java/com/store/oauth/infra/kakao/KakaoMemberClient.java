package com.store.onlineStore.oauth.infra.kakao;

import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.oauth.domain.client.OauthMemberClient;
import com.store.onlineStore.oauth.infra.kakao.client.KakaoApiClient;
import com.store.onlineStore.oauth.infra.kakao.dto.KakaoMemberResponse;
import com.store.onlineStore.oauth.infra.kakao.dto.KakaoToken;
import com.store.onlineStore.oauth.infra.naver.NaverOauthConfig;
import com.store.onlineStore.oauth.infra.naver.client.NaverApiClient;
import com.store.onlineStore.oauth.infra.naver.dto.NaverMemberResponse;
import com.store.onlineStore.oauth.infra.naver.dto.NaverToken;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoMemberClient implements OauthMemberClient {

	private final KakaoApiClient kakaoApiClient;
	private final KakaoOauthConfig kakaoOauthConfig;

	@Override
	public OauthServerType supportServer() {
		return OauthServerType.KAKAO;
	}

	@Override
	public SocialRegistrationDto fetch(String authCode) {
		KakaoToken tokenInfo = kakaoApiClient.fetchToken(tokenRequestParams(authCode));
		KakaoMemberResponse kakaoMemberResponse = kakaoApiClient.fetchMember("Bearer " + tokenInfo.accessToken()); // AccessToken을 가지고 회원 정보를 받아옴

		SocialRegistrationDto socialRegistrationDto = kakaoMemberResponse.toDomainByKakao();
		log.info(socialRegistrationDto.toString());

		return socialRegistrationDto; // 회원 정보를 OauthMember 객체로 변환
	}

	// 토큰 받기 API의 요청에 사용되는 요청 파라미터를 설정
	private MultiValueMap<String, String> tokenRequestParams(String authCode) {
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", kakaoOauthConfig.clientId());
		params.add("redirect_url", kakaoOauthConfig.redirectUri());
		params.add("code", authCode);
		params.add("client_secret", kakaoOauthConfig.clientSecret());
		return params;
	}
}
