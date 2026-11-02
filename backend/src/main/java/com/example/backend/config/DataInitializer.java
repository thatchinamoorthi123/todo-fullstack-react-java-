package com.example.backend.config;

import com.example.backend.model.Todo;
import com.example.backend.repository.TodoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(TodoRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Todo("Setup Spring Boot Backend", "Configured JPA, REST API controllers, and CORS for full stack connectivity.", true, "HIGH", "Backend"));
                repository.save(new Todo("Connect React with Spring Boot API", "Fetch todos, handle CRUD operations, and sync state in real time.", false, "HIGH", "Fullstack"));
                repository.save(new Todo("Design UI with Tailwind CSS v4", "Build modern, responsive, and glassmorphic UI components with badges and status filters.", true, "MEDIUM", "Frontend"));
                repository.save(new Todo("Learn REST API Architecture", "Master GET, POST, PUT, DELETE, and PATCH methods with proper HTTP status codes.", false, "MEDIUM", "Study"));
                repository.save(new Todo("Verify Database Persistence", "Confirm records persist in PostgreSQL across server restarts.", false, "LOW", "Database"));

                System.out.println("✅ Sample Todo dummy data successfully loaded into database!");
            }
        };
    }
}
