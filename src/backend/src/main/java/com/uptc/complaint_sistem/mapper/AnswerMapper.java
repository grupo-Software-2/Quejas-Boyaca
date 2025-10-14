package com.uptc.complaint_sistem.mapper;

import com.uptc.complaint_sistem.dto.AnswerDTO;
import com.uptc.complaint_sistem.model.Answer;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AnswerMapper {

    public AnswerDTO toAnswerDTO(Answer answer) {
        if (answer == null) {
            return null;
        }

        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setMessage(answer.getMessage());
        dto.setDate(answer.getDate());

        if (answer.getComplaint() != null) {
            dto.setComplaintId(answer.getComplaint().getId());
        }

        return dto;
    }

    public Answer toAnswer(AnswerDTO dto) {
        if (dto == null) {
            return null;
        }

        Answer answer = new Answer();
        answer.setMessage(dto.getMessage());

        return answer;
    }

    public List<AnswerDTO> toDTOList(List<Answer> answers) {
        if (answers == null) {
            return null;
        }
        return answers.stream()
                .map(this::toAnswerDTO)
                .collect(Collectors.toList());
    }
}
