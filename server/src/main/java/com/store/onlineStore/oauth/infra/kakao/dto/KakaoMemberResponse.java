package com.store.onlineStore.oauth.infra.kakao.dto;

import static com.store.onlineStore.oauth.domain.OauthServerType.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.PropertyNamingStrategies.SnakeCaseStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.oauth.domain.OauthId;
import com.store.onlineStore.oauth.domain.OauthMember;

@JsonNaming(value = SnakeCaseStrategy.class)
public record KakaoMemberResponse(
		Long id,
		boolean hasSignedUp,
		LocalDateTime connectedAt,
		KakaoAccount kakaoAccount
) {

	public OauthMember toDomain() {
		return OauthMember.builder()
				.oauthId(new OauthId(String.valueOf(id), KAKAO))
				.name(kakaoAccount.profile.nickname)
				.email(kakaoAccount.profile.profileImageUrl)
				.build();
	}

	public SocialRegistrationDto toDomainByKakao() {
		return SocialRegistrationDto.builder()
				.pw(KAKAO)
				.name(kakaoAccount.name)
				.id(kakaoAccount.email)
				.birth(kakaoAccount.birthyear + "-" + kakaoAccount.birthday)
				.build();
	}

	@JsonNaming(value = SnakeCaseStrategy.class)
	public record KakaoAccount (
		boolean profileNeedsAgreement,
		boolean profileNicknameNeedsAgreement,
		boolean profileImageNeedsAgreement,
		Profile profile,
		boolean nameNeedsAgreement,
		String name,
		boolean emailNeedsAgreement,
		boolean isEmailValid,
		boolean isEmailVerified,
		String email,
		boolean ageRangeNeedsAgreement,
		String ageRange,
		boolean birthyearNeedsAgreement,
		String birthyear,
		boolean birthdayNeedsAgreement,
		String birthday,
		String birthdayType,
		boolean genderNeedsAgreement,
		String gender,
		boolean phoneNumberNeedsAgreement,
		String phoneNumber,
		boolean ciNeedsAgreement,
		String ci,
		LocalDateTime ciAuthenticatedAt
	) {
	}

	@JsonNaming(SnakeCaseStrategy.class)
	public record Profile(
			String nickname,
			String thumbnailImageUrl,
			String profileImageUrl,
			boolean isDefaultImage
	) {
	}
}
