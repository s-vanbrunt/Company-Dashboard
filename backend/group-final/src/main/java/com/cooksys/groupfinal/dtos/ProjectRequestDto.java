package com.cooksys.groupfinal.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ProjectRequestDto {

  private String name;

  private String description;

  private TeamDto team;

  private boolean active;

  private CredentialsDto credentials;

}