export const onButtonLongPressHandler = (
    component, 
    setCurrentButtonId, 
    setCurrentComponent, 
    setConfigOverlayVisible, 
    setRadioConfigOverlayVisible, 
    setCheckboxConfigOverlayVisible, 
    setTextConfigOverlayVisible, 
    setTextInputConfigOverlayVisible
) => {
    switch (component.type) {
        case 'Button':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setConfigOverlayVisible(true);
          break;
        case 'Radio':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setRadioConfigOverlayVisible(true);
          break;
        case 'Checkbox':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setCheckboxConfigOverlayVisible(true);
          break;
        case 'Text':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setTextConfigOverlayVisible(true);
          break;
        case 'TextInput': // open config for this component type
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setTextInputConfigOverlayVisible(true);
          break;
        default:
            return null;
    }
  };