package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/test")

public class TestController {

  @GetMapping
  public ResponseEntity<String> getLoad(){
    return ResponseEntity.ok("Hi Welcome to Sprinboot");
  }
}