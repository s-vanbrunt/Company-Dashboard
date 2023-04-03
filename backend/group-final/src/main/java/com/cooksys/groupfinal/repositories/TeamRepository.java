package com.cooksys.groupfinal.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cooksys.groupfinal.entities.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Team findByName(String name);

    Optional<Team> findByIdAndActiveTrue(long id);

}