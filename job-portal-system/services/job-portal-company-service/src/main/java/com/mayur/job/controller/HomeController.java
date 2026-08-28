package com.mayur.job.controller;

import com.mayur.job.domain.UserRole;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public String home(){
        return "company service" + UserRole.ROLE_EMPLOYER;
    }

}
