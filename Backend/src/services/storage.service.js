import ImageKit from "imagekit";
import config from "../config/config.js";



var imagekit = new ImageKit({
    publicKey : config.IMAGEKIT_PUBLIC_KEY,
    privateKey :config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : config.IMAGEKIT_URL_ENDPOINT
});


export async function uploadFile(file,filename) {
    try {
        // Validate ImageKit configuration
        if (!config.IMAGEKIT_PUBLIC_KEY || !config.IMAGEKIT_PRIVATE_KEY || !config.IMAGEKIT_URL_ENDPOINT) {
            throw new Error('ImageKit configuration is missing. Please check IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT environment variables.')
        }

        return new Promise((resolve, reject) => {
            imagekit.upload({
                file: file.buffer, 
                fileName: filename, 
                folder: "social-media"
            }, function(error, result) {
                if (error) {
                    console.error('ImageKit upload error details:', error)
                    reject(new Error(`ImageKit upload failed: ${error.message || 'Unknown error'}`));
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.error('ImageKit service error:', error)
        throw error
    }
}
