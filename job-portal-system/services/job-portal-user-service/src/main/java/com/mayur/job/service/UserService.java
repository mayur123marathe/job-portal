package com.mayur.job.service;

import com.mayur.job.dto.response.UserResponse;
import com.mayur.job.model.User;
import com.mayur.job.payload.UpdateUserRequest;

import java.util.List;

public interface UserService {

    User getUserByEmail(String email) throws Exception;
    User getUserById(Long id) throws Exception;
    List<User> getAllUsers() throws Exception;
    UserResponse updateProfile(String email, UpdateUserRequest req);
    //Admin actions
    UserResponse suspendUser(Long id)throws Exception;
    UserResponse activateUser(Long id)throws Exception;
    UserResponse deleteUser(Long id)throws Exception;
}
