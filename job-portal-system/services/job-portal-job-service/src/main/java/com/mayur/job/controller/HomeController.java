package com.mayur.job.controller;


import com.mayur.job.domain.UserRole;
import com.mayur.job.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ApiResponse home(){
        return new ApiResponse("helloo" + UserRole.ROLE_EMPLOYER, true);
    }
}
