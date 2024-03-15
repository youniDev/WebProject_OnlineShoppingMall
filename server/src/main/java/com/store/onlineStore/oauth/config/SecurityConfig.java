package com.store.onlineStore.oauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.format.FormatterRegistry;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import com.store.onlineStore.oauth.OauthServerTypeConverter;
import com.store.onlineStore.oauth.config.jwt.JwtAccessDeniedHandler;
import com.store.onlineStore.oauth.config.jwt.JwtAuthenticationEntryPoint;
import com.store.onlineStore.oauth.config.jwt.JwtSecurityConfig;
import com.store.onlineStore.oauth.config.jwt.TokenProvider;

import lombok.RequiredArgsConstructor;

/**
 * 스프링 시큐리티와 OAuth2 설정 클래스
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig implements WebMvcConfigurer {
	private final TokenProvider tokenProvider;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("http://localhost:3000")
				.allowedMethods(
						HttpMethod.GET.name(),
						HttpMethod.POST.name(),
						HttpMethod.PUT.name(),
						HttpMethod.DELETE.name(),
						HttpMethod.PATCH.name()
				)
				.allowCredentials(true)
				.exposedHeaders("*");
	}

	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(new OauthServerTypeConverter());
	}

	// PasswordEncoder는 BCryptPasswordEncoder를 사용
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity httpSecurity, HandlerMappingIntrospector introspector) throws Exception {
		httpSecurity
				// token을 사용하는 방식이기 때문에 csrf를 disable합니다.
				.csrf(AbstractHttpConfigurer::disable)
				.exceptionHandling((exceptionHandling) -> //컨트롤러의 예외처리를 담당하는 exception handler와는 다름.
						exceptionHandling
								.accessDeniedHandler(jwtAccessDeniedHandler)
								.authenticationEntryPoint(jwtAuthenticationEntryPoint)
				)
				// enable h2-console
				.headers((headers)->
						headers.contentTypeOptions(contentTypeOptionsConfig ->
								headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)))
				// disable session
				.sessionManagement((sessionManagement) ->
						sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
				.authorizeHttpRequests((authorizeRequests)->
						authorizeRequests
								.requestMatchers(new MvcRequestMatcher(introspector, "/api/**")).permitAll() // HttpServletRequest를 사용하는 요청들에 대한 접근제한을 설정
								.requestMatchers(new MvcRequestMatcher(introspector, "/oauth/**")).permitAll()
								.anyRequest().authenticated() // 그 외 인증 없이 접근X
				)
				.exceptionHandling((exceptionHandling)->exceptionHandling
						.accessDeniedHandler(jwtAccessDeniedHandler)
						.authenticationEntryPoint(jwtAuthenticationEntryPoint))
				.apply(new JwtSecurityConfig(tokenProvider)); // JwtFilter를 addFilterBefore로 등록했던 JwtSecurityConfig class 적용

		return httpSecurity.build();
	}

}
