package com.erp.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                if (jwtUtils.validateToken(token)) {
                    String username = jwtUtils.extractUsername(token);
                    Integer userId = jwtUtils.extractUserId(token);
                    String role = jwtUtils.extractRole(token);
                    
                    UserPrincipal principal = new UserPrincipal(userId, username, role);
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            principal, 
                            null, 
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                        );
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                logger.error("JWT token validation failed", e);
            }
        }
        
        chain.doFilter(request, response);
    }
}
