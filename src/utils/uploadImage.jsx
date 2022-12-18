import { storage } from "../api/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const uploadImage = async (imageLocation, choosenImage) => {
  console.log(choosenImage);
  const imageRef = ref(storage, `${imageLocation}/${choosenImage.name + v4()}`);
  await uploadBytes(imageRef, choosenImage);
  return imageRef;
};

const getImageUrl = async (imageRef) => {
  return getDownloadURL(imageRef).then((url) => {
    console.log("uploadimage 13:", url);
    return url;
  });
};

export { uploadImage, getImageUrl };
