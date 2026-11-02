package com.example.backend.controller;

import com.example.backend.model.Todo;
import com.example.backend.repository.TodoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"})
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // 1. Get all todos (with optional filtering)
    @GetMapping
    public List<Todo> getAllTodos(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean completed) {
        if (search != null && !search.trim().isEmpty()) {
            return todoRepository.findByTitleContainingIgnoreCase(search.trim());
        }
        if (completed != null) {
            return todoRepository.findByCompleted(completed);
        }
        return todoRepository.findAll();
    }

    // 2. Get single todo by ID
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Create a new todo
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        if (todo.getTitle() == null || todo.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Todo savedTodo = todoRepository.save(todo);
        return new ResponseEntity<>(savedTodo, HttpStatus.CREATED);
    }

    // 4. Update an existing todo
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setTitle(todoDetails.getTitle());
                    existingTodo.setDescription(todoDetails.getDescription());
                    existingTodo.setCompleted(todoDetails.isCompleted());
                    existingTodo.setPriority(todoDetails.getPriority());
                    existingTodo.setCategory(todoDetails.getCategory());
                    existingTodo.setDueDate(todoDetails.getDueDate());
                    Todo updated = todoRepository.save(existingTodo);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. Toggle completed status
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setCompleted(!existingTodo.isCompleted());
                    Todo updated = todoRepository.save(existingTodo);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. Delete a todo
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todoRepository.delete(todo);
                    return ResponseEntity.ok(Map.of("message", "Todo deleted successfully", "id", id.toString()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 7. Health check endpoint for verifying connection
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        long count = todoRepository.count();
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Spring Boot Backend is successfully connected!",
                "totalTodos", count,
                "timestamp", System.currentTimeMillis()
        ));
    }
}
