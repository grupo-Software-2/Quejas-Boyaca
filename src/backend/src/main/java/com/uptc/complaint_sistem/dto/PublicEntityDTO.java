package com.uptc.complaint_sistem.dto;

import com.uptc.complaint_sistem.model.PublicEntity;

import java.util.Locale;

public class PublicEntityDTO {

    private String name;
    private String displayName;

    public PublicEntityDTO() {}

    public PublicEntityDTO(String name, String displayName) {
        this.name = name;
        this.displayName = displayName;
    }

    public static PublicEntityDTO convertFromEnum(PublicEntity entity) {
        return new PublicEntityDTO(entity.name(), entity.name());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
