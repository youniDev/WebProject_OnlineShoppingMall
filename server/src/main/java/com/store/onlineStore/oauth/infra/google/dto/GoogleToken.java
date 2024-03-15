package com.store.onlineStore.oauth.infra.google.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import lombok.ToString;

@JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
public record GoogleToken (
		String access_token,
		Integer expires_in,
		String refresh_token,
		String scope,
		String token_type
) {
}
