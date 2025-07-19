import ImageKit from "imagekit";
import config from "../config/config.js";



var imagekit = new ImageKit({
    publicKey : config.IMAGEKIT_PUBLIC_KEY,
    privateKey :config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : config.IMAGEKIT_URL_ENDPOINT
});


export async function uploadImage(file,filename) {
    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: file.buffer, 
            fileName: filename, 
            folder: "social-media"
        }, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
