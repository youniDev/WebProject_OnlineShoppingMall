package com.store.onlineStore.oauth.infra.google.client;

import static org.springframework.http.HttpHeaders.*;
import static org.springframework.http.MediaType.*;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.PostExchange;

import com.store.onlineStore.oauth.infra.google.dto.GoogleMemberResponse;
import com.store.onlineStore.oauth.infra.google.dto.GoogleToken;

public interface GoogleApiClient{
	@PostExchange(url = "https://oauth2.googleapis.com/token", contentType = APPLICATION_FORM_URLENCODED_VALUE)
	GoogleToken fetchToken(@RequestParam(name= "params") MultiValueMap<String, String> params);

	@GetExchange("https://www.googleapis.com/userinfo/v2/me")
	GoogleMemberResponse fetchMember(@RequestHeader(name = AUTHORIZATION) String bearerToken);
}
