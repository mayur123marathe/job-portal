package com.mayur.job.domain;

public enum InterviewType {
    PHONE_SCREENING,  // initial screening call
    VIDEO_CALL,       // remote video interview (Zoom, Meet, Teams)
    IN_PERSON,        // on-site interview
    TECHNICAL,        // coding test / system design round
    HR,               // HR / culture fit round
    PANEL             // multiple interviewers simultaneously
}
