package com.mayur.job.payload;

import com.mayur.job.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank(message = "full name is manditory")
    private String fullName;

    @Email(message = "Email Should be Valid")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Password is mandatory")
    private String password;
    private String phone;

    @NotNull(message = "Role is mandatory")
    private UserRole role;
}
