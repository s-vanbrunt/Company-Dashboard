package com.cooksys.groupfinal.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserAddRequestDto {

	private UserRequestDto user;

	private CredentialsDto credentials;
}
