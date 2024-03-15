package com.store.onlineStore.oauth.domain;

import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Oauth를 통해 가입한 회원을 나타내는 객체
 */
@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
@Table(name = "oauth_member",
		uniqueConstraints = {
				@UniqueConstraint(
						name = "oauth_id_unique",
						columnNames = {
								"oauth_server_id",
								"oauth_server"
						}
				),
		}
)
public class OauthMember {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Embedded
	private OauthId oauthId;
	private String name;
	private String email;
	private String birthday;
}
