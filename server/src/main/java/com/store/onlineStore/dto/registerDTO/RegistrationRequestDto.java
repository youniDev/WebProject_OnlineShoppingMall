package com.store.onlineStore.dto.registerDTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistrationRequestDto {
	private String user_id;
	private String password;
	private String name;
	private String birth;
	private String address;
	private int point;
}
