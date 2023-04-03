package com.cooksys.groupfinal.mappers;

import java.util.Set;

import org.mapstruct.Mapper;

import com.cooksys.groupfinal.dtos.ProjectResponseDto;
import com.cooksys.groupfinal.dtos.ProjectRequestDto;
import com.cooksys.groupfinal.entities.Project;

@Mapper(componentModel = "spring", uses = { TeamMapper.class })
public interface ProjectMapper {

    ProjectResponseDto entityToDto(Project project);

    Set<ProjectResponseDto> entitiesToDtos(Set<Project> projects);

    Project dtoToEntity(ProjectRequestDto projectRequestDto);

}
