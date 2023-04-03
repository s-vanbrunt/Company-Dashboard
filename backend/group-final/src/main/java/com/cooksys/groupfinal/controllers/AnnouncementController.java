package com.cooksys.groupfinal.controllers;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.groupfinal.dtos.AnnouncementDto;
import com.cooksys.groupfinal.dtos.AnnouncementRequestDto;
import com.cooksys.groupfinal.dtos.CredentialsDto;
import com.cooksys.groupfinal.services.AnnouncementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/announcements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnnouncementController {

	private final AnnouncementService announcementService;

	@GetMapping
	public Set<AnnouncementDto> getAllAnnouncements() {
		return announcementService.getAllAnnouncements();
	}

	@PostMapping("/{companyId}")
	public AnnouncementDto createAnnouncement(@RequestBody AnnouncementRequestDto announcementRequestDto) {
		return announcementService.createAnnouncement(announcementRequestDto);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<AnnouncementDto> deleteAnnouncement(@PathVariable Long id,
			@RequestBody CredentialsDto credentialsDto) {
		return ResponseEntity.ok(announcementService.deleteAnnouncement(id, credentialsDto));
	}

	@PatchMapping("/{id}")
	public ResponseEntity<AnnouncementDto> editAnnouncement(@PathVariable Long id,
			@RequestBody AnnouncementRequestDto announcementRequestDto) {
		return ResponseEntity.ok(announcementService.editAnnouncement(id, announcementRequestDto));
	}

}
