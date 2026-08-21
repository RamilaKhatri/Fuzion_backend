import { genUploader } from "https://esm.sh/uploadthing@7.7.4/client";

const { uploadFiles } = genUploader({
    url: "/api/uploadthing"
});

window.uploadGalleryImage = async function (file) {

    if (!file) {
        throw new Error("Please select an image.");
    }

    console.log("Uploading to UploadThing...");

    const response = await uploadFiles(
        "galleryImage",
        {
            files: [file],
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    console.log("UploadThing response:", response);

    if (!response || !response.length) {
        throw new Error(
            "UploadThing did not return an image."
        );
    }

    const uploadedFile = response[0];

    const imageUrl =
        uploadedFile.ufsUrl ||
        uploadedFile.url;

    if (!imageUrl) {
        throw new Error(
            "UploadThing image URL not found."
        );
    }

    console.log(
        "UploadThing image URL:",
        imageUrl
    );

    return imageUrl;
};