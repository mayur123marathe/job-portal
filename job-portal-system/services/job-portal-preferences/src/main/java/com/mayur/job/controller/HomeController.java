package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ResponseEntity<ApiResponse> Home(){
        ApiResponse res = new ApiResponse<>("hello", true);
        return ResponseEntity.ok(res);
    }
}
