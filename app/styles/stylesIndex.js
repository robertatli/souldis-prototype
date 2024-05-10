import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height,
      position: 'relative',
      top: -65,
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
    },
    modalView: {
      width: '100%',
      height: '100%',
      margin: 0,
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
    mainMenuModalView: {
      width: '100%',
      height: '100%',
      margin: 0,
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
    bottomContainer: {
      flex: 1, // Takes up all available space
      justifyContent: 'flex-end', // Aligns children at the bottom
      marginBottom: 20, // Adds some margin at the bottom
    },
    whitetext: {
      color: '#FFFBEE',
    },
    modalButtonClose: {
      backgroundColor: '#3C3630',
      padding: 10,
      margin: 10,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#3C3630',
      width: '90%',
      height: 40,
    },
    modalButtonSave: {
      backgroundColor: '#9E998F',
      padding: 10,
      margin: 10,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#9E998F',
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
    pageDisplay: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ddd',
      width: '100%',
      height: 100,
      padding: 10,
      elevation: 3, // for Android
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
      width: '100%',
      flex: 1,
      padding: 10,
    },
    nodeItem: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      marginVertical: 5,
      paddingRight: 40,
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
    flowText2: {
      fontSize: 18,
      lineHeight: 32,
    },
    flowList: {
      flex: 1,
      height: '100%',
      width: '100%',
      alignSelf: 'center',
    },
    variableItem: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 4,
    },
    variableInput: {
      height: 40,
      width: 230,
      margin: 1,
      paddingLeft: 10,
      padding: 5,
      backgroundColor: '#d8d8d8',
    },
    centeredViewSection: {
      flex: 1,
      padding: 20,
  },
    modalTitleSection: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    section: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionDescription: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    addNodeButton: {
        backgroundColor: 'skyblue',
        padding: 10,
        borderRadius: 4,
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 4,
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    scrollView: {
        width: '100%',
    },
  });
  
export default styles;