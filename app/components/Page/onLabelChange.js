
export const onLabelChangeHelper = (id, newLabel, setComponents) => {
    setComponents(prevComponents => prevComponents.map(comp => {
        if (comp.id === id) {
            return { ...comp, label: newLabel };
        }
        return comp;
    }));
  };