package com.cooksys.groupfinal.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.ProjectResponseDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.services.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

	private final ProjectService projectService;

	@PostMapping("/{teamId}")
	@ResponseStatus(HttpStatus.CREATED)
	public ProjectResponseDto createProject(@PathVariable Long teamId,
			@RequestBody ProjectRequestDto projectRequestDto) {
		return projectService.createProject(teamId, projectRequestDto);
	}

	@PatchMapping("/{projectId}")
	public ProjectResponseDto editProject(@PathVariable Long projectId,
			@RequestBody ProjectRequestDto projectRequestDto) {
		return projectService.editProject(projectId, projectRequestDto);
	}

	@DeleteMapping("/{projectId}")
	public ProjectResponseDto deleteProject(@PathVariable Long projectId, @RequestBody CredentialsDto credentials) {
		return projectService.deleteProject(projectId, credentials);
	}

}
