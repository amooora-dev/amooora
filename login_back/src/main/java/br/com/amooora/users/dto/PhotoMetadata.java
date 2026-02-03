package br.com.amooora.users.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoMetadata {
    private String bucket;
    private String object;
    private Long size;
    private String contentType;
    private ZonedDateTime lastModified;
    private String etag;
}