package com.store.onlineStore.oauth;

import org.springframework.core.convert.converter.Converter;
import com.store.onlineStore.oauth.domain.OauthServerType;

public class OauthServerTypeConverter implements Converter<String, OauthServerType> {

	@Override
	public OauthServerType convert(String source) {
		return OauthServerType.fromName(source);
	}
}
