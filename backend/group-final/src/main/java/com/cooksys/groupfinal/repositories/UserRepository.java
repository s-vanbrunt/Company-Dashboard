package com.cooksys.groupfinal.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cooksys.groupfinal.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByCredentialsUsernameAndActiveTrue(String username);

	User findByProfileFirstNameAndActiveTrue(String name);

	Optional<User> findByCredentialsUsername(String username);

	Optional<User> findByIdAndActiveTrue(Long id);
}