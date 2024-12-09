import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import ScreenProvider from './navigation/screenProvider';
import ThemeProvider from './themeProvider';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { myStore } from './redux/store/myStore';
import { CityProvider } from './Context/CityProvider';
import { CityAlertsProvider } from './Context/CityProviderAlerts';


const App = () => {
  SplashScreen.hide();
  return (
    <Provider store={myStore}>
      <CityProvider>
        <CityAlertsProvider>
          <NavigationContainer>
            <ThemeProvider>
              <ScreenProvider />
            </ThemeProvider>
          </NavigationContainer>
        </CityAlertsProvider>
      </CityProvider>
    </Provider>
  )
}

export default App