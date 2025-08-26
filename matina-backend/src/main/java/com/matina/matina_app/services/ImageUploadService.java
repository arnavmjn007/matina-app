package com.matina.matina_app.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class ImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    @SuppressWarnings("rawtypes") // You can also use "unchecked"
    public String uploadFile(MultipartFile file) {
        try {
            // This line is correct, the annotation above will suppress the warning.
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Could not upload file: " + e.getMessage(), e);
        }
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extract the public ID from the full URL
            String publicId = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            // Log the error but don't stop the user deletion process
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }
}