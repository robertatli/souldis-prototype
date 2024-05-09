import { v4 as uuidv4 } from 'uuid';

export const handleAddComponentHandler = (type, setComponents, components) => {
    const baseComponent = {
        id: uuidv4(),
        position: { x: 0, y: -400 },
        type: type,
        label: type === 'Text' ? 'New Text' : type,
    };

    switch (type) {
        case 'Button':
            setComponents([...components, {...baseComponent, nextPageId: null, hapticNodes: [], height: 40, width: '100%', visible: true}]);
            break;
        case 'Radio':
            setComponents([...components, {...baseComponent, selected: false, label: '', hapticNodes: []}]); // Example additional property
            break;
        case 'Checkbox':
            setComponents([...components, {...baseComponent, checked: false, label: '', hapticNodes: []}]);
            break;
        case 'Text':
            setComponents([...components, {...baseComponent, text: 'New Text'}]);
            break;
        case 'TextInput':
            setComponents([...components, {...baseComponent, value: ''}]);
            break;
        default:
            console.log('Unknown type');
    }
};