package com.mayur.job.dto.response;

import com.mayur.job.domain.UserRole;
import com.mayur.job.domain.UserStatus;
import jdk.jshell.Snippet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String fullName;
    private String password;
    private String email;
    private String phone;
    private String profileImage;
    private UserRole role = UserRole.ROLE_JOB_SEEKER;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    private LocalDateTime suspendedAt;
    private LocalDateTime deletedAt;
    private Integer tokenVersion = 0;

}
