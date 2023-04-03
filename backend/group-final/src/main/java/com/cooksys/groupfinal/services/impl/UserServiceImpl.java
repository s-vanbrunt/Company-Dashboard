package com.cooksys.groupfinal.services.impl;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.BasicUserDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.UserAddRequestDto;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Credentials;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotAuthorizedException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.BasicUserMapper;
import com.cooksys.groupfinal.mappers.CredentialsMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final FullUserMapper fullUserMapper;
	private final BasicUserMapper basicUserMapper;
	private final CredentialsMapper credentialsMapper;
	private final CompanyRepository companyRepository;

	/**
	 * findUser private overloaded method used to search the database for an active
	 * user with a matching username.
	 * 
	 * @param username string to search by
	 * @return a user object if found
	 */
	private User findUser(String username) {
		Optional<User> user = userRepository.findByCredentialsUsernameAndActiveTrue(username);
		if (user.isEmpty()) {
			throw new NotFoundException("The username provided does not belong to an active user.");
		}
		return user.get();
	}

	/**
	 * findUser private overloaded method to search the database for an active user
	 * with a matching id.
	 * 
	 * @param id long to find a user by
	 * @return a user object if found
	 */
	private User findUser(long id) {
		Optional<User> user = userRepository.findByIdAndActiveTrue(id);
		if (user.isEmpty()) {
			throw new NotFoundException("The user id provided does not belong to an active user.");
		}
		return user.get();
	}

	/**
	 * verifyLogin private method checks that a credentialsDto with username and
	 * password values exists, searches the database by for a matching user and
	 * returns the user if username and password match. Throws a
	 * NotAuthorizedException otherwise.
	 * 
	 * @param credentialsDto with a username and password to check against the
	 *                       database
	 * @return a user object matching the username and password sent in
	 */
	private User verifyLogin(CredentialsDto credentialsDto) {

		if (credentialsDto == null || credentialsDto.getUsername() == null || credentialsDto.getPassword() == null) {
			throw new BadRequestException("A username and password are required.");
		}
		Credentials credentialsToValidate = credentialsMapper.dtoToEntity(credentialsDto);
		User userToValidate = findUser(credentialsDto.getUsername());
		if (!userToValidate.getCredentials().equals(credentialsToValidate)) {
			throw new NotAuthorizedException("The provided credentials are invalid.");
		}
		return userToValidate;
	}

	/**
	 * verifyAdmin private method calls other private methods to find a user and
	 * verify login credentials, then checks if the found user is an admin and
	 * returns the user. If the user is not an admin a NotAuthorizedException is
	 * thrown.
	 * 
	 * @param credentialsDto with a username and password to check against the
	 *                       database
	 * @return a user object matching the username and password sent in
	 */
	private User verifyAdmin(CredentialsDto credentialsDto) {
		User user = verifyLogin(credentialsDto);
		if (!user.isAdmin()) {
			throw new NotAuthorizedException("Admin credentials are required for this request.");
		}
		return user;
	}

	/**
	 * login method takes in a credentialsDto, searches for a user with a matching
	 * username and compares the stored user password the the passed in credential.
	 * If matching a user object is returned.
	 */
	@Override
	public FullUserDto login(CredentialsDto credentialsDto) {
		User userToValidate = verifyLogin(credentialsDto);
		if (userToValidate.getStatus().equals("PENDING")) {
			userToValidate.setStatus("JOINED");
			userRepository.saveAndFlush(userToValidate);
		}
		return fullUserMapper.entityToFullUserDto(userToValidate);
	}

	/**
	 * editUser method takes in a userAddRequestDto and an id. After verifying the
	 * user credentials and admin privilege any existing fields are checked for
	 * validity and assigned as values to an user found by the passed in id.
	 */
	@Override
	public FullUserDto editUser(UserAddRequestDto userAddRequestDto, long id) {

		verifyAdmin(userAddRequestDto.getCredentials());
		User userToEdit = findUser(id);

		// Check that the request has a username to change to
		if (userAddRequestDto.getUser().getCredentials().getUsername() != null) {

			// Check the given username doesn't not equal the current username
			if (!userAddRequestDto.getUser().getCredentials().getUsername()
					.equals(userToEdit.getCredentials().getUsername())) {

				// Check the given username doesn't exist is the database
				if (userRepository.findByCredentialsUsername(userAddRequestDto.getUser().getCredentials().getUsername())
						.isEmpty()) {
					userToEdit.getCredentials().setUsername(userAddRequestDto.getUser().getCredentials().getUsername());
				} else {
					throw new BadRequestException("Given Username is already in use.");
				}
			}
		}

		if (userAddRequestDto.getUser().getCredentials().getPassword() != null) {
			userToEdit.getCredentials().setPassword(userAddRequestDto.getUser().getCredentials().getPassword());
		}
		if (userAddRequestDto.getUser().getProfile().getFirstName() != null) {
			userToEdit.getProfile().setFirstName(userAddRequestDto.getUser().getProfile().getFirstName());
		}
		if (userAddRequestDto.getUser().getProfile().getLastName() != null) {
			userToEdit.getProfile().setLastName(userAddRequestDto.getUser().getProfile().getLastName());
		}
		if (userAddRequestDto.getUser().getProfile().getEmail() != null) {

			String regex = "^.+@.+\\..+$";
			Pattern pattern = Pattern.compile(regex);
			Matcher matcher = pattern.matcher((CharSequence) userAddRequestDto.getUser().getProfile().getEmail());

			if (matcher.matches()) {
				userToEdit.getProfile().setEmail(userAddRequestDto.getUser().getProfile().getEmail());
			} else {
				throw new BadRequestException("Properly formatted email addresses with '@' and '.' are required.");
			}

		}
		if (userAddRequestDto.getUser().getProfile().getPhone() != null) {

			// Check phone number given has 10 digits
			if (userAddRequestDto.getUser().getProfile().getPhone().length() == 10) {

				// Format phone number before saving to database with format (xxx) xxx-xxxx
				userToEdit.getProfile().setPhone(String.valueOf(userAddRequestDto.getUser().getProfile().getPhone())
						.replaceFirst("(\\d{3})(\\d{3})(\\d+)", "($1) $2-$3"));
			} else {
				throw new BadRequestException("Phone Numbers require 10 digits.");
			}
		}

		return fullUserMapper.entityToFullUserDto(userRepository.saveAndFlush(userToEdit));
	}

	@Override
	public BasicUserDto createUser(UserAddRequestDto userAddRequestDto, Long companyId) {
		verifyAdmin(userAddRequestDto.getCredentials());

		if (userAddRequestDto.getUser().getCredentials().getUsername() == null
				|| userAddRequestDto.getUser().getCredentials().getPassword() == null) {
			throw new BadRequestException("A username and password for the new user are required.");
		}

		User userToAdd = fullUserMapper.requestDtoToEntity(userAddRequestDto.getUser());

		// Check that the request has a username to change to
		if (userAddRequestDto.getUser().getCredentials().getUsername() != null) {

			if (userRepository.findByCredentialsUsername(userAddRequestDto.getUser().getCredentials().getUsername())
					.isEmpty()) {
				userToAdd.getCredentials().setUsername(userAddRequestDto.getUser().getCredentials().getUsername());
			} else {
				throw new BadRequestException("Given Username is already in use.");
			}
		}

		if (userAddRequestDto.getUser().getProfile().getEmail() != null) {

			String regex = "^.+@.+\\..+$";
			Pattern pattern = Pattern.compile(regex);
			Matcher matcher = pattern.matcher((CharSequence) userAddRequestDto.getUser().getProfile().getEmail());

			if (matcher.matches()) {
				userToAdd.getProfile().setEmail(userAddRequestDto.getUser().getProfile().getEmail());
			} else {
				throw new BadRequestException("Properly formatted email addresses with '@' and '.' are required.");
			}

		}
		if (userAddRequestDto.getUser().getProfile().getPhone() != null) {

			// Check phone number given has 10 digits
			if (userAddRequestDto.getUser().getProfile().getPhone().length() == 10) {

				// Format phone number before saving to database with format (xxx) xxx-xxxx
				userToAdd.getProfile().setPhone(String.valueOf(userAddRequestDto.getUser().getProfile().getPhone())
						.replaceFirst("(\\d{3})(\\d{3})(\\d+)", "($1) $2-$3"));
			} else {
				throw new BadRequestException("Phone Numbers require 10 digits.");
			}
		}
		userToAdd.setActive(true);
		userToAdd.setStatus("PENDING");
		Optional<Company> optionalCompany = companyRepository.findById(companyId);
		if (optionalCompany == null) {
			throw new NotFoundException("No company has id " + companyId + ".");
		}
		Company company = optionalCompany.get();

		User userToReturn = userRepository.saveAndFlush(userToAdd);
		company.getEmployees().add(userToReturn);
		companyRepository.saveAndFlush(company);

		return basicUserMapper.entityToBasicUserDto(userToReturn);
	}

	/**
	 * deleteUser method takes in credentials and an id. The credentials are
	 * verified along with admin status and the id is used to search for a user. If
	 * no active user is found an exception is thrown. If found the active boolean
	 * is set to false and the user is returned.
	 */
	@Override
	public FullUserDto deleteUser(CredentialsDto credentialsDto, long id) {

		verifyAdmin(credentialsDto);

		User userToDelete = findUser(id);

		userToDelete.setActive(false);

		return fullUserMapper.entityToFullUserDto(userRepository.saveAndFlush(userToDelete));
	}
}
