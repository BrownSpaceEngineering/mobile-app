import { createStackNavigator } from 'react-navigation';
import SettingsActivity from './src/SettingsActivity';
import MainActivity from './src/MainActivity';


export default ActivityProject = createStackNavigator(
{
  MainActivity: { screen: MainActivity },
  SettingsActivity: { screen: SettingsActivity }
});