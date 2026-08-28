package com.mayur.job.service.impl;

import com.mayur.job.domain.UserRole;
import com.mayur.job.domain.UserStatus;
import com.mayur.job.mapper.UserMapper;
import com.mayur.job.model.User;
import com.mayur.job.payload.AuthResponse;
import com.mayur.job.payload.LoginRequest;
import com.mayur.job.payload.SignupRequest;
import com.mayur.job.repository.UserRepository;
import com.mayur.job.security.CustomUserDetailsService;
import com.mayur.job.security.JwtProvider;
import com.mayur.job.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;


    @Override
    public AuthResponse signup(SignupRequest req) throws Exception {

        if(userRepository.existsByEmail(req.getEmail())){
            throw new Exception("Email Already registered: " + req.getEmail());
        }

        if(req.getRole() == UserRole.ROLE_ADMIN){
            throw new Exception("Cannot self register as role Admin");
        }

        User user = User.builder().fullName(req.getFullName()).email(req.getEmail()).password(passwordEncoder.encode(req.getPassword())).role(req.getRole()).phone(req.getPhone()).lastLogin(LocalDateTime.now()).status(UserStatus.ACTIVE).build();

        User savedUser = userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

//        JwtProvider jwtProvider = new JwtProvider();
        String jwt = jwtProvider.generateToken(authentication, savedUser.getId());

        AuthResponse res = new AuthResponse();
        res.setTitle("Welcome: " + savedUser.getFullName());
        res.setMessage("Registered Successfully");
        res.setJwt(jwt);
        res.setUser(UserMapper.toDTO(savedUser));
        return res;
    }

    @Override
    public AuthResponse login(LoginRequest req) throws Exception {
        Authentication authentication = authenticate(req.getEmail(), req.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(req.getEmail());

//        JwtProvider jwtProvider = new JwtProvider();
        String jwt = jwtProvider.generateToken(authentication, user.getId());

        user.setLastLogin((LocalDateTime.now()));
        userRepository.save(user);

        AuthResponse res = new AuthResponse();
        res.setTitle("Welcome back: " + user.getFullName());
        res.setMessage("Logged user Successfully");
        res.setJwt(jwt);
        res.setUser(UserMapper.toDTO(user));

        return res;
    }

    private Authentication authenticate(String email, String password)throws Exception{
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        if (userDetails == null) {
            throw new Exception("User not found with email: " + email);
        }


        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new Exception("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }


}
