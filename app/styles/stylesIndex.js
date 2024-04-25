import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height,
    },
    menuButtonContainer: {
      position: 'absolute',
      top: 40, // Adjust top as needed
      right: 10, // Adjust right as needed
      backgroundColor: 'red',
      borderRadius: 5,
      overflow: 'hidden',
      padding: 10, // Add padding to increase the touchable area
    },
    picker: {
      width: 200,
    },
    buttonContainer: {
      margin: 10,
      width: 200,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      width: '100%',
      height: '100%',
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalButton: {
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        width: '90%',
        height: 40,
      },
    centeredModalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    saveModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalTextInput: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '80%',
    },
    modalSaveButton: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3', // or any color you prefer
        width: '80%',
    },
    modalCancelButton: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        backgroundColor: 'gray', // or any color you prefer
        marginTop: 10,
        width: '80%',
    },
    modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    },
    textInput: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: '80%',
    },
    setupItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ddd',
      borderRadius: 5,
      marginTop: 10,
      padding: 10,
    },
    deleteButton: {
      // Ensure this button is outside and to the right of the setup item container
      padding: 8,
      backgroundColor: 'red',
      borderRadius: 5,
    },
    deleteButtonText: {
      fontSize: 16,
      color: 'white',
    },
    setupItemText: {
      fontSize: 16,
      marginRight: 8,
    },    
    container: {
      flex: 1,
      padding: 10,
    },
    nodeItem: {
      width: 300,
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 4,
    },
    itemContainer: {
      padding: 10,
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    flowName: {
      textColor: 'navy',
      padding: 10,
      marginVertical: 10,
      backgroundColor: 'lightgray',
      alignItems: 'center',
      height: 100,
      borderRadius: 5,
    },
    flowText: {
      fontSize: 18,
    },
    flowList: {
      flex: 1,
      height: '100%',
      width: '80%',
      alignSelf: 'center',
    }
  });
  
export default styles;