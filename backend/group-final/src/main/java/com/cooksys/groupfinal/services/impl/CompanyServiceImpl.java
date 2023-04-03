package com.cooksys.groupfinal.services.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.FullUserDto;
import com.cooksys.groupfinal.dtos.ProjectResponseDto;
import com.cooksys.groupfinal.dtos.TeamDto;
import com.cooksys.groupfinal.entities.Announcement;
import com.cooksys.groupfinal.entities.Company;
import com.cooksys.groupfinal.entities.Project;
import com.cooksys.groupfinal.entities.Team;
import com.cooksys.groupfinal.entities.User;
import com.cooksys.groupfinal.exceptions.NotFoundException;
import com.cooksys.groupfinal.mappers.AnnouncementMapper;
import com.cooksys.groupfinal.mappers.FullUserMapper;
import com.cooksys.groupfinal.mappers.ProjectMapper;
import com.cooksys.groupfinal.mappers.TeamMapper;
import com.cooksys.groupfinal.repositories.CompanyRepository;
import com.cooksys.groupfinal.repositories.TeamRepository;
import com.cooksys.groupfinal.services.CompanyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

  private final CompanyRepository companyRepository;
  private final TeamRepository teamRepository;
  private final FullUserMapper fullUserMapper;
  private final AnnouncementMapper announcementMapper;
  private final TeamMapper teamMapper;
  private final ProjectMapper projectMapper;

  private Company findCompany(Long id) {
    Optional<Company> company = companyRepository.findById(id);
    if (company.isEmpty()) {
      throw new NotFoundException("A company with the provided id does not exist.");
    }
    return company.get();
  }

  private Team findTeam(Long id) {
    Optional<Team> team = teamRepository.findById(id);
    if (team.isEmpty()) {
      throw new NotFoundException("A team with the provided id does not exist.");
    }
    if (team.get().isActive() == false) {
      throw new NotFoundException("Team is no longer active.");
    }
    return team.get();
  }

  @Override
  public Set<FullUserDto> getAllUsers(Long id) {
    Company company = findCompany(id);
    Set<User> filteredUsers = new HashSet<>();
    company.getEmployees().forEach(filteredUsers::add);
    filteredUsers.removeIf(user -> !user.isActive());
    return fullUserMapper.entitiesToFullUserDtos(filteredUsers);
  }

  @Override
  public Set<AnnouncementDto> getAllAnnouncements(Long id) {
    Company company = findCompany(id);
    List<Announcement> sortedList = new ArrayList<>();
    company.getAnnouncements().forEach(e -> {
      if (e.isDeleted() == false)
        sortedList.add(e);
    });
    sortedList.sort(Comparator.comparing(Announcement::getDate).reversed());
    Set<Announcement> sortedSet = new HashSet<Announcement>(sortedList);
    return announcementMapper.entitiesToDtos(sortedSet);
  }

  @Override
  public Set<TeamDto> getAllTeams(Long id) {
    Company company = findCompany(id);
    Set<Team> filteredTeams = new HashSet<>();
    company.getTeams().forEach(filteredTeams::add);
    filteredTeams.removeIf(team -> !team.isActive());
    return teamMapper.entitiesToDtos(filteredTeams);
  }

  @Override
  public Set<ProjectResponseDto> getAllProjects(Long companyId, Long teamId) {
    Company company = findCompany(companyId);
    Team team = findTeam(teamId);
    if (!company.getTeams().contains(team)) {
      throw new NotFoundException("A team with id " + teamId + " does not exist at company with id " + companyId + ".");
    }
    Set<Project> filteredProjects = new HashSet<>();
    team.getProjects().forEach(filteredProjects::add);
    filteredProjects.removeIf(project -> project.isDeleted());
    return projectMapper.entitiesToDtos(filteredProjects);
  }

}
