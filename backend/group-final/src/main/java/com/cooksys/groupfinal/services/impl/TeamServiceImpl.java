package com.cooksys.groupfinal.services.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.dtos.TeamRequestDto;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.BadRequestException;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.ProjectRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.repositories.UserRepository;
import com.cooksys.groupfinal.services.TeamService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ProjectRepository projectRepository;
    private final TeamMapper teamMapper;

    @Override
    public TeamDto createTeam(TeamRequestDto teamRequestDto, long companyId) {
        if (teamRequestDto.getCredentials() == null || teamRequestDto.getCredentials().getUsername() == null
                || teamRequestDto.getCredentials().getPassword() == null) {
            throw new BadRequestException("A username and password are required.");
        }
        if (teamRequestDto == null || teamRequestDto.getName() == null || teamRequestDto.getDescription() == null
                || teamRequestDto.getTeammates() == null) {
            throw new BadRequestException("All team information required.");
        }

        User userToValidate = userRepository
                .findByCredentialsUsernameAndActiveTrue(teamRequestDto.getCredentials().getUsername())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!userToValidate.isAdmin()
                && !teamRequestDto.getCredentials().getPassword()
                        .equals(userToValidate.getCredentials().getPassword())) {
            throw new BadRequestException("Invalid Credentials");
        }

        Team team = teamMapper.requestDtoToEntity(teamRequestDto);

        Set<User> members = new HashSet<>();
        teamRequestDto.getTeammates().forEach(member -> {
            final User tempUser = userRepository
                    .findByProfileFirstNameAndActiveTrue(member.getProfile().getFirstName());
            if (tempUser != null)
                members.add(tempUser);
        });
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new NotFoundException("Company not found"));
        team.setCompany(company);
        team.setTeammates(members);

        return teamMapper.entityToDto(teamRepository.saveAndFlush(team));
    }

    @Override
    public TeamDto editTeam(TeamRequestDto teamRequestDto, Long id) {
        if (teamRequestDto == null || teamRequestDto.getName() == null || teamRequestDto.getDescription() == null) {
            throw new BadRequestException("Name and description are required.");
        }
        User userToValidate = userRepository
                .findByCredentialsUsernameAndActiveTrue(teamRequestDto.getCredentials().getUsername())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!userToValidate.isAdmin()
                && !teamRequestDto.getCredentials().getPassword()
                        .equals(userToValidate.getCredentials().getPassword())) {
            throw new BadRequestException("User must be an admin to perform this action");
        }
        Team team = teamRepository.findById(id).orElseThrow(() -> new NotFoundException("Team not found"));
        Team existingTeam = teamRepository.findByName(teamRequestDto.getName());
        if (existingTeam != null && existingTeam.getId() != id) {
            throw new BadRequestException("Another team already exists with this name");
        }
        team.setName(teamRequestDto.getName());
        team.setDescription(teamRequestDto.getDescription());
        Set<User> members = new HashSet<>();
        if (teamRequestDto.getTeammates() != null) {
            teamRequestDto.getTeammates().forEach(member -> {
                final User tempUser = userRepository
                        .findByProfileFirstNameAndActiveTrue(member.getProfile().getFirstName());
                if (tempUser != null)
                    members.add(tempUser);
            });
        }
        Set<Project> projects = new HashSet<>();
        if (teamRequestDto.getProjects() != null) {
            teamRequestDto.getProjects().forEach(project -> {
                final Project tempProject = projectRepository.findByNameAndActiveTrue(project.getName());
                if (tempProject != null)
                    projects.add(tempProject);
            });
        }
        team.setCompany(team.getCompany());
        team.setProjects(projects);
        team.setTeammates(members);
        return teamMapper.entityToDto(teamRepository.saveAndFlush(team));
    }

    @Override
    public TeamDto deleteTeam(CredentialsDto credentialsDto, long id) {
        if (credentialsDto == null || credentialsDto.getUsername() == null || credentialsDto.getPassword() == null) {
            throw new BadRequestException("A username and password are required.");
        }

        User userToValidate = userRepository.findByCredentialsUsernameAndActiveTrue(credentialsDto.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!userToValidate.isAdmin()
                && !credentialsDto.getPassword().equals(userToValidate.getCredentials().getPassword())) {
            throw new BadRequestException("Invalid Credentials");
        }

        Team teamToDelete = teamRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new NotFoundException("Team not found."));

        teamToDelete.setActive(false);

        return teamMapper.entityToDto(teamRepository.saveAndFlush(teamToDelete));
    }

}
