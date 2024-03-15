package com.store.onlineStore.oauth.infra.naver.dto;

import static com.store.onlineStore.oauth.domain.OauthServerType.NAVER;

import com.fasterxml.jackson.databind.PropertyNamingStrategies.SnakeCaseStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.oauth.domain.OauthId;
import com.store.onlineStore.oauth.domain.OauthMember;

@JsonNaming(value = SnakeCaseStrategy.class)
public record NaverMemberResponse(
		String resultcode,
		String message,
		Response response
) {

	public OauthMember toDomain() {
		return OauthMember.builder()
				.oauthId(new OauthId(String.valueOf(response.id), NAVER))
				.name(response.name)
				.email(response.email)
				.birthday(response.birthyear + " " + response.birthday)
				.build();
	}

	public SocialRegistrationDto toDomainByNaver() {
		return SocialRegistrationDto.builder()
				.pw(NAVER)
				.name(response.name)
				.id(response.email)
				.birth(response.birthyear + "-" + response.birthday)
				.build();
	}

	@JsonNaming(value = SnakeCaseStrategy.class)
	public record Response(
			String id,
			String nickname,
			String name,
			String email,
			String gender,
			String age,
			String birthday,
			String profileImage,
			String birthyear,
			String mobile
	) {
	}
}
