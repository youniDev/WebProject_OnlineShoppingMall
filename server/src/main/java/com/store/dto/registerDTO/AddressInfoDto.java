package com.store.onlineStore.dto.registerDTO;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class AddressInfoDto {
	private String address;

	public AddressInfoDto(String road, String detail, String extra) {
		System.out.println("addressInfo : " + road + " " + detail + " " + extra);
		this.address = road + extra + " " + detail;
	}
}
