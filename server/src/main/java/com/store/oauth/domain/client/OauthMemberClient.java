package com.store.onlineStore.oauth.domain.client;

import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.oauth.domain.OauthServerType;

public interface OauthMemberClient {

	OauthServerType supportServer();

	SocialRegistrationDto fetch(String code);
}
