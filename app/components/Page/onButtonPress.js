

export const onButtonPressHandler = async (component, hapticNodes, playHapticSequence, router, flowId, buttonConfigs, setComponents) => {
    const hapticSequence = hapticNodes[component.id] || [];
    console.log("H2: ", hapticSequence);
    console.log("H2: ", component.startHaptic.hapticValue);
    console.log("H2: ", component);

    switch (component.type) {
      case 'Button':
        playHapticSequence(hapticSequence);

        const nextPageId = buttonConfigs[component.id]; // Assuming buttonConfigs stores page IDs now

        if (nextPageId) {
            // Use the `router.navigate` or `router.push` method to navigate to the selected page
            router.push({ pathname: `/flow/${flowId}/page/${nextPageId}` });
        } else {
            console.log(`Button ${component.id} pressed without a specific page configured.`);
        }
        break;
      case 'Radio':
        playHapticSequence(hapticSequence);
        break;
      case 'Checkbox':
        setComponents(prevComponents => {
          return prevComponents.map(prevComponent => {
              if (prevComponent.id === component.id) {
                  return { ...prevComponent, checked: !prevComponent.checked };
              } else {
                  return prevComponent;
              }
          });
        });
        
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