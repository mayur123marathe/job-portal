package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.response.JobCategoryResponse;

import com.mayur.job.dto.request.BulkJobCategoryRequest;
import com.mayur.job.dto.request.JobCategoryRequest;
import com.mayur.job.dto.response.BulkJobCategoryResponse;
import com.mayur.job.service.JobCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-categories")
@RequiredArgsConstructor
public class JobCategoryController {

    private final JobCategoryService categoryService;

    @PostMapping
    public ResponseEntity<JobCategoryResponse> createCategory(
            @RequestBody @Valid JobCategoryRequest req)
            throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(req));
    }

    @PostMapping("/bulk")
    public ResponseEntity<BulkJobCategoryResponse> createCategoriesBulk(
            @RequestBody @Valid BulkJobCategoryRequest req) {
        return ResponseEntity.status(HttpStatus.MULTI_STATUS)
                .body(categoryService.createCategoriesBulk(req));
    }

    @GetMapping
    public ResponseEntity<List<JobCategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/root")
    public ResponseEntity<List<JobCategoryResponse>> getRootCategories() {
        return ResponseEntity.ok(categoryService.getRootCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobCategoryResponse> getCategoryById(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<JobCategoryResponse> getCategoryBySlug(
            @PathVariable String slug) throws Exception {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobCategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody @Valid JobCategoryRequest req)
            throws Exception {
        return ResponseEntity.ok(categoryService.updateCategory(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCategory(
            @PathVariable Long id) throws Exception {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new ApiResponse("Category deleted successfully", true));
    }
}
