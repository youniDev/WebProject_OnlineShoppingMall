package com.store.onlineStore.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.onlineStore.dto.AuthRequestDto;
import com.store.onlineStore.dto.AuthResponseDto;
import com.store.onlineStore.oauth.config.jwt.JwtFilter;
import com.store.onlineStore.oauth.config.jwt.TokenProvider;
import com.store.onlineStore.oauth.domain.OauthServerType;
import com.store.onlineStore.service.OauthService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/oauth")
@RestController
public class OauthController {
	private final OauthService oauthService;
	private final TokenProvider tokenProvider;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;

	// 각 소셜로부터 인가 코드 발급 받음
	@SneakyThrows
	@GetMapping("/{oauthServerType}")
	ResponseEntity<Void> redirectAuthCodeRequestUrl(
			@PathVariable OauthServerType oauthServerType,
			HttpServletResponse response) {
		String redirectUrl = oauthService.getAuthCodeRequestUrl(oauthServerType);
		response.sendRedirect(redirectUrl);
		return ResponseEntity.ok().build();
	}

	// 로그인 성공 시, token 발급 받음
	@GetMapping("/login/{oauthServerType}")
	ResponseEntity<String> login(
			@PathVariable OauthServerType oauthServerType,
			@RequestParam("code") String code) {
		AuthRequestDto login = oauthService.login(oauthServerType, code);

		try {
			// 로그인 폼에서 제출되는 id, pw를 통한 인증을 처리하는 filter
			UsernamePasswordAuthenticationToken authenticationToken =
					new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword());

			// authenticate 메소드가 실행이 될 때 CustomUserDetailsService class의 loadUserByUsername 메소드가 실행
			Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
			// 해당 객체를 SecurityContextHolder에 저장하고
			SecurityContextHolder.getContext().setAuthentication(authentication);
			// authentication 객체를 createToken 메소드를 통해서 JWT Token을 생성
			String jwt = tokenProvider.createToken(authentication);

			return ResponseEntity.ok(jwt);
		} catch (InternalAuthenticationServiceException e) {
			log.error(e.toString());
			return ResponseEntity.status(401).body("LOGIN_ERROR BAD_CREDENTIALS");
		} catch (BadCredentialsException e) {
			log.error(e.toString());
			return ResponseEntity.status(401).body("LOGIN_ERROR BAD_CREDENTIALS");
		}
	}

}
