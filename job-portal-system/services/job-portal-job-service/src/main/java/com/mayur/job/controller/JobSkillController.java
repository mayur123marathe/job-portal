package com.mayur.job.controller;

import com.mayur.job.domain.SkillCategory;
import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.response.JobSkillResponse;
import com.mayur.job.dto.request.BulkJobSkillRequest;
import com.mayur.job.dto.request.JobSkillRequest;
import com.mayur.job.dto.response.BulkJobSkillResponse;
import com.mayur.job.service.JobSkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-skills")
@RequiredArgsConstructor
public class JobSkillController {

    private final JobSkillService skillService;

    @PostMapping
    public ResponseEntity<JobSkillResponse> createSkill(
            @RequestBody @Valid JobSkillRequest req) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(skillService.createSkill(req));
    }

    @PostMapping("/bulk")
    public ResponseEntity<BulkJobSkillResponse> createSkillsBulk(
            @RequestBody @Valid BulkJobSkillRequest req) {
        return ResponseEntity.status(HttpStatus.MULTI_STATUS)
                .body(skillService.createSkillsBulk(req));
    }

    @GetMapping
    public ResponseEntity<List<JobSkillResponse>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<JobSkillResponse>> getSkillsByCategory(
            @PathVariable SkillCategory category) {
        return ResponseEntity.ok(skillService.getSkillsByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobSkillResponse>> searchSkills(
            @RequestParam String keyword) {
        return ResponseEntity.ok(skillService.searchSkills(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobSkillResponse> getSkillById(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobSkillResponse> updateSkill(
            @PathVariable Long id,
            @RequestBody @Valid JobSkillRequest req)
            throws Exception {
        return ResponseEntity.ok(skillService.updateSkill(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteSkill(
            @PathVariable Long id) throws Exception {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(new ApiResponse("Skill deleted successfully", true));
    }
}
