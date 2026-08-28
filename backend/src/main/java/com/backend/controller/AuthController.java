package com.backend.controller;

import com.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;
import com.backend.entity.EntityUser;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://kakeibo2-ashen.vercel.app"})
public class AuthController {

    private final UserRepository userRepository;

    // BCryptPasswordEncoderのインスタンスを作成(パスワードのハッシュ化と照合に使用)
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EntityUser loginUser) {
        Optional<EntityUser> dbUserOpt = userRepository.findById(loginUser.getId());

        if(dbUserOpt.isPresent()) {
            EntityUser dbUser = dbUserOpt.get();

            if(passwordEncoder.matches(loginUser.getPassword(), dbUser.getPassword())) {
                return ResponseEntity.ok().body("{\"message\": \"ログイン成功\"}");
            } 
        }
        
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"ログイン失敗\"}");
    }
    
}
