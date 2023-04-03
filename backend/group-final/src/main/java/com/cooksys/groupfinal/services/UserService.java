package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.UserAddRequestDto;

public interface UserService {

	FullUserDto login(CredentialsDto credentialsDto);

	FullUserDto editUser(UserAddRequestDto userAddRequestDto, long id);

	BasicUserDto createUser(UserAddRequestDto userAddRequestDto, Long companyId);

	FullUserDto deleteUser(CredentialsDto credentialsDto, long id);

}
