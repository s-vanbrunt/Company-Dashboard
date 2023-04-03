package com.cooksys.groupfinal.services;

import java.util.Set;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.AnnouncementRequestDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;

public interface AnnouncementService {

    Set<AnnouncementDto> getAllAnnouncements();

    AnnouncementDto createAnnouncement(AnnouncementRequestDto announcementRequestDto);

    AnnouncementDto deleteAnnouncement(Long id, CredentialsDto credentialsDto);

    AnnouncementDto editAnnouncement(Long id, AnnouncementRequestDto announcementRequestDto);

}
