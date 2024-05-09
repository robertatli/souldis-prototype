import * as ImagePicker from 'expo-image-picker';

export const pickImageHandler = async (setBackgroundImage, setModalVisible) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    });

    if (!result.canceled) {
        setBackgroundImage({ uri: result.assets[0].uri });
    }
    setModalVisible(false); // Optionally close the modal after setting the background
  };