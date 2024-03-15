package com.store.onlineStore.oauth.domain.authcode;

import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.store.onlineStore.oauth.domain.OauthServerType;

/**
 * OauthServerType의 종류에 따라,
 * 이에 해당하는 AuthCodeRequestUrlProvier를 사용하여 URL을 생성할 수 있도록 하는 클래스
 */
@Component
public class AuthCodeRequestUrlProviderComposite {
	private final Map<OauthServerType, AuthCodeRequestUrlProvider> mapping;

	public AuthCodeRequestUrlProviderComposite(Set<AuthCodeRequestUrlProvider> providers) {
		mapping = providers.stream()
				.collect(toMap(
						AuthCodeRequestUrlProvider::supportServer,
						identity()
				));
	}

	public String provide(OauthServerType oauthServerType) {
		return getProvider(oauthServerType).provide();
	}

	private AuthCodeRequestUrlProvider getProvider(OauthServerType oauthServerType) {
		return Optional.ofNullable(mapping.get(oauthServerType))
				.orElseThrow(() -> new RuntimeException("지원하지 않는 소셜 로그인 타입입니다."));
	}
}
