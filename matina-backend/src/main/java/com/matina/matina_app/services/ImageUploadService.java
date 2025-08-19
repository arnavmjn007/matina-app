package com.matina.matina_app.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils; // Keep this import

@Service
public class ImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            // FIX: Specify the generic types for the Map.
            // Map<String, Object> is appropriate for the Cloudinary response.
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Could not upload file: " + e.getMessage(), e);
        }
    }
}
