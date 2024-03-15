package com.store.onlineStore.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import com.store.onlineStore.dto.AuthRequestDto;
import com.store.onlineStore.dto.WishListRequestDto;
import com.store.onlineStore.dto.registerDTO.RegistrationDto;
import com.store.onlineStore.dto.registerDTO.RegistrationRequestDto;
import com.store.onlineStore.dto.registerDTO.SocialRegistrationDto;
import com.store.onlineStore.dto.registerDTO.UserResponseDto;

import entity.Role;
import entity.User;
import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class UserRepository {
	private final JdbcTemplate jdbcTemplate;
	private String sql;

	@Autowired
	public UserRepository(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void insertUser(RegistrationDto user) {
		sql = "INSERT INTO user (name, birth, address, user_id, password, role) " +
				"VALUES (?, ?, ?, ?, ?, ?)";
		try {
			jdbcTemplate.update(
					sql,
					user.getName(),
					user.getBirth(),
					user.getAddress(),
					user.getId(),
					user.getPassword(),
					Role.ROLE_USER.getValue()
			);
		} catch (Exception e) {
			throw new RuntimeException("Failed to insert user.", e);
		}
	}

	public void updateUser(RegistrationDto user) {
		sql = "UPDATE user SET name=?, address=?, birth=? WHERE user_id = ?";

		try {
			jdbcTemplate.update(
					sql,
					user.getName(),
					user.getAddress(),
					user.getBirth(),
					user.getId()
			);
		} catch (Exception e) {
			throw new RuntimeException("Failed to update product.", e);
		}
	}

	public AuthRequestDto insertUserBySocial(SocialRegistrationDto user) {
		String address = "NAVER_NULL";

		sql = "INSERT INTO user (name, birth, address, user_id, password, order_id, role) " +
				"VALUES (?, ?, ?, ?, ?, NULL, ?)";
		try {
			jdbcTemplate.update(
					sql,
					user.getName(),
					user.getBirth(),
					address,
					user.getId(),
					user.getPw().toString(),
					Role.ROLE_USER.getValue()
			);
		} catch (Exception e) {
			throw new RuntimeException("Failed to insert user.", e);
		}

		return findByEmail(user.getId());
	}

	public void updateAuth(String token, String email) {
		sql = "UPDATE user SET auth = ? WHERE user_id = ?";

		try {
			jdbcTemplate.update(sql, token, email);
		} catch (Exception e) {
			throw new RuntimeException("Failed to update user auth.", e);
		}
	}

	public List<User> selectAll() {
		sql = "select * from user";
		return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(User.class));
	}
	public List<String> selectEmailByUser() {
		String sql = "select user_id from user";

		return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("user_id"));
	}

	// 로그인
	public boolean validateUserCredentials(String id, String password) {
		sql = "SELECT * FROM user WHERE user_id = ? AND password = ?";
		Object[] params = { id, password };

		return !jdbcTemplate.queryForList(sql, params).isEmpty();
	}

	public AuthRequestDto findByEmail(String email){
		sql = "SELECT user_id, password, role FROM user WHERE user_id = ?";

		try {
			return jdbcTemplate.queryForObject(
					sql,
					(rs, rowNum) -> {
						AuthRequestDto user = new AuthRequestDto(
								rs.getString("user_id"),
								rs.getString("password"),
								rs.getString("role")
						);
						return user;
					}, email);
		} catch (UsernameNotFoundException e) {
			log.error(String.valueOf(e));
			return null;
		} catch (EmptyResultDataAccessException e) {
			log.error(String.valueOf(e));
			return null;
		}
	}

	public String findUserNameByEmail(String email) {
		sql = "SELECT user_id FROM user WHERE user_id = ?";

		return jdbcTemplate.queryForObject(sql, String.class, email);
	}

	public RegistrationRequestDto findUserByEmail(String email) {
		sql = "SELECT user_id, password, name, birth, address, point FROM user WHERE user_id = ?";

		return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(RegistrationRequestDto.class), email);
	}

	public UserResponseDto findAddressByUserId(String email) {
		sql = "SELECT name, address FROM user WHERE user_id = ?";

		return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(UserResponseDto.class), email);
	}
}
