package com.store.onlineStore.oauth.infra.google.dto;

import static com.store.onlineStore.oauth.domain.OauthServerType.*;

import java.util.Objects;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;

@JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
public record GoogleMemberResponse(
		String id,
		String email,
		boolean verified_email,
		String name,
		String given_name,
		String family_name,
		String picture,
		String locale
) {

	static final String GUEST = "guest";

	public SocialRegistrationDto toDomainGoogle() {
		return SocialRegistrationDto.builder()
				.pw(GOOGLE)
				.name(Objects.requireNonNullElse(name, GUEST))
				.id(email)
				.build();
	}
}

