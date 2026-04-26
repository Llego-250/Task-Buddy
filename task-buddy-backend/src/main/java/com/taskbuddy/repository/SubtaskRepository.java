package com.taskbuddy.repository;

import com.taskbuddy.model.Subtask;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubtaskRepository extends MongoRepository<Subtask, String> {
    List<Subtask> findByTaskId(String taskId);
}
