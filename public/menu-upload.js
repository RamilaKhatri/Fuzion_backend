import { genUploader } from "https://esm.sh/uploadthing@7.7.4/client";

const { uploadFiles } = genUploader({
  url: "/api/uploadthing"
});

window.uploadMenuImage = async function (file) {

  if (!file) {
    throw new Error("Please select an image.");
  }

  const response = await uploadFiles(
    "menuImage",
    {
      files: [file],
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  if (!response || !response.length) {
    throw new Error("UploadThing did not return an image.");
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

  return imageUrl;
};