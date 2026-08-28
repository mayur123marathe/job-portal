package com.mayur.job.service;

import com.mayur.job.payload.LoginRequest;
import com.mayur.job.payload.SignupRequest;
import com.mayur.job.payload.AuthResponse;

public interface AuthService {

    AuthResponse signup(SignupRequest req) throws Exception;
    AuthResponse login(LoginRequest req) throws Exception;
}
