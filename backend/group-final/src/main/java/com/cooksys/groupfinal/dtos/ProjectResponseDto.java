package com.cooksys.groupfinal.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ProjectResponseDto {

    private Long id;

    private String name;

    private String description;

    private boolean active;
    
    private boolean deleted;

    private TeamDto team;

}