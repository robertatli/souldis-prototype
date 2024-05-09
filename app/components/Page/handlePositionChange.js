/* This handles the position change of components, saving the correct position so it is remembered */

export const createPositionHandler = (setComponents) => (componentId, newPosition) => {
    setComponents(currentComponents => currentComponents.map(comp => {
      if (comp.id === componentId) {
        return { ...comp, position: newPosition };
      }
      return comp;
    }));
};