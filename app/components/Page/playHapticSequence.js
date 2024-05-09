
import * as Haptics from 'expo-haptics';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const playHapticSequenceHelper = async (hapticSequence) => {
    for (let node of hapticSequence) {
      switch (node.value) {
        case 'selectionAsync':
          console.log('HapticSelection');
          await Haptics.selectionAsync();
          break;
        case 'notificationAsyncSuccess':
          console.log('HapticSuccess');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'notificationAsyncError':
          console.log('HapticError');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'notificationAsyncWarning':
          console.log('HapticWarning');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'impactAsyncLight':
          console.log('HapticLight');
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'impactAsyncMedium':
          console.log('HapticMedium');
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'impactAsyncHeavy':
          console.log('HapticHeavy');
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'delayAsync100':
          console.log('Delay 100ms');
          await delay(100);
          break;
        case 'delayAsync300':
          console.log('Delay 300ms');
          await delay(300);
          break;
        case 'delayAsync500':
          console.log('Delay 500ms');
          await delay(500);
          break;
      }
    }
  };