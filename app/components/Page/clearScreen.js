/* This handles the clearing of the screen */

export const clearScreenHandler = (setComponents, setBackgroundImage) => {
    console.log('Clearing screen...');
    setComponents([]); // Clear all components
    setBackgroundImage(require('../../../assets/DTC-Page.png')); // Remove background image
  };