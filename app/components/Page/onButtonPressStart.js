

export const onButtonPressStartHandler = async (component, playHapticSequence) => {
    const hapticSequence = [{"value": component.startHaptic.selectedHaptic}] || [];
    console.log("H1: ", hapticSequence);
    console.log("H1: ", component.startHaptic.selectedHaptic);
    console.log("H1: ", component);

    switch (component.type) {
      case 'Button':
        playHapticSequence(hapticSequence);
        break;
      case 'Radio':
        playHapticSequence(hapticSequence);
        break;
      case 'Checkbox':
        playHapticSequence(hapticSequence);
        break;
      case 'Text':
        break;
      case 'TextInput':
        break;
      default:
          return null;
    }
  };