package com.store.onlineStore.oauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import com.store.onlineStore.oauth.infra.google.client.GoogleApiClient;
import com.store.onlineStore.oauth.infra.kakao.client.KakaoApiClient;
import com.store.onlineStore.oauth.infra.naver.client.NaverApiClient;

/**
 * Http Interface Client 구현체를 빈으로 등록
 */
@Configuration
public class HttpInterfaceConfig {
	@Bean
	public NaverApiClient naverApiClient() {
		return createHttpInterface(NaverApiClient.class);
	}
	@Bean
	public KakaoApiClient kakaoApiClient() {
		return createHttpInterface(KakaoApiClient.class);
	}
	@Bean
	public GoogleApiClient googleApiClient() {
		return createHttpInterface(GoogleApiClient.class);
	}

	private <T> T createHttpInterface(Class<T> clazz) {
		WebClient webClient = WebClient.create();
		HttpServiceProxyFactory build = HttpServiceProxyFactory
				.builder(WebClientAdapter.forClient(webClient)).build();
		return build.createClient(clazz);
	}
}
