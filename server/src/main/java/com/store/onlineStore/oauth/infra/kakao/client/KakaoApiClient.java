package com.store.onlineStore.oauth.infra.kakao.client;

import static org.springframework.http.HttpHeaders.*;
import static org.springframework.http.MediaType.*;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

import com.store.onlineStore.oauth.infra.kakao.dto.KakaoMemberResponse;
import com.store.onlineStore.oauth.infra.kakao.dto.KakaoToken;
import com.store.onlineStore.oauth.infra.naver.dto.NaverMemberResponse;
import com.store.onlineStore.oauth.infra.naver.dto.NaverToken;

public interface KakaoApiClient {
	@PostExchange(url = "https://kauth.kakao.com/oauth/token", contentType = APPLICATION_FORM_URLENCODED_VALUE)
	KakaoToken fetchToken(@RequestParam(name= "params") MultiValueMap<String, String> params);

	@GetExchange("https://kapi.kakao.com/v2/user/me")
	KakaoMemberResponse fetchMember(@RequestHeader(name = AUTHORIZATION) String bearerToken);
}
