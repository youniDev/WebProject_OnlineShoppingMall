package com.store.onlineStore.dto.registerDTO;

import com.store.onlineStore.oauth.domain.OauthId;
import com.store.onlineStore.oauth.domain.OauthServerType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class SocialRegistrationDto {
	private String id;
	private OauthServerType pw;
	private String name;
	private String birth;
}
