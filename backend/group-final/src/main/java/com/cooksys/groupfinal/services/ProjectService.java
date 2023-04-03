package com.cooksys.groupfinal.services;

import com.cooksys.groupfinal.dtos.ProjectResponseDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;

public interface ProjectService {

	ProjectResponseDto createProject(Long teamId, ProjectRequestDto projectRequestDto);

	ProjectResponseDto editProject(Long projectId, ProjectRequestDto projectRequestDto);

	ProjectResponseDto deleteProject(Long projectId, CredentialsDto credentials);
}
