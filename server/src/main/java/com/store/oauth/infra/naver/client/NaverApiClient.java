package com.store.onlineStore.oauth.infra.naver.client;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

import com.store.onlineStore.oauth.infra.naver.dto.NaverMemberResponse;
import com.store.onlineStore.oauth.infra.naver.dto.NaverToken;

public interface NaverApiClient {
	@PostExchange(url = "https://nid.naver.com/oauth2.0/token")
	NaverToken fetchToken(@RequestParam(name= "params") MultiValueMap<String, String> params);

	@GetExchange("https://openapi.naver.com/v1/nid/me")
	NaverMemberResponse fetchMember(@RequestHeader(name = AUTHORIZATION) String bearerToken);
}
