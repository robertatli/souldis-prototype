 /* This is used in the ButtonComponent Modal, to update the height/width and visibility of the component */

export const updateComponentHelper = (id, updates, setComponents) => {
    setComponents(prevComponents => prevComponents.map(comp => {
        if (comp.id === id) {
            console.log({ ...comp, ...updates });
            return { ...comp, ...updates };
        }
        return comp;
    }));
  };