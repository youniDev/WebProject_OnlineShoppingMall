package com.store.onlineStore.dto.registerDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PersonalInfoDto {
	private String id;
	private String password;
	private String name;
	private String birth;
	private String path;
}
