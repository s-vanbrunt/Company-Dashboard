package com.cooksys.groupfinal.dtos;

import java.util.Set;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TeamRequestDto {
    private String name;
    private String description;
    private Set<BasicUserDto> teammates;
    private Set<ProjectRequestDto> projects;
    private CredentialsDto credentials;
}
