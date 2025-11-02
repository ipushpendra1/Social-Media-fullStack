import { findOneUser, updateUser } from "../dao/user.dao.js";
import { uploadFile } from "../services/storage.service.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Get current user's profile
 */
export async function getProfileController(req, res) {
    try {
        // User is already attached by authMiddleware
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Unauthorized: User not authenticated"
            });
        }

        // Return user profile without sensitive data
        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                bio: req.user.bio || "",
                image: req.user.image
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });
    }
}

/**
 * Update user's profile
 */
export async function updateProfileController(req, res) {
    try {
        // Validate user authentication
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "Unauthorized: User not authenticated"
            });
        }

        const updateData = {};
        const { username, bio } = req.body;

        // Update username if provided and different
        if (username !== undefined && username !== req.user.username) {
            // Check if username is already taken by another user
            const existingUser = await findOneUser({
                username: username,
                _id: { $ne: req.user._id } // Exclude current user
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Username already taken"
                });
            }

            updateData.username = username.trim();
        }

        // Update bio if provided
        if (bio !== undefined) {
            updateData.bio = bio.trim();
        }

        // Handle image upload if provided
        if (req.file) {
            try {
                const fileResult = await uploadFile(req.file, uuidv4());
                updateData.image = fileResult.url;
            } catch (uploadError) {
                return res.status(500).json({
                    message: "Error uploading image",
                    error: uploadError.message
                });
            }
        }

        // If no updates to make, return current profile
        if (Object.keys(updateData).length === 0) {
            return res.status(200).json({
                message: "No changes to update",
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                    bio: req.user.bio || "",
                    image: req.user.image
                }
            });
        }

        // Update user profile
        const updatedUser = await updateUser(
            { _id: req.user._id },
            updateData
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio || "",
                image: updatedUser.image
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating profile",
            error: error.message
        });
    }
}

