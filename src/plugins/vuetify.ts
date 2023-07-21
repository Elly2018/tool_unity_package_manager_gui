// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { ThemeDefinition, createVuetify } from 'vuetify'

const DarkTheme:ThemeDefinition = {
  dark: true,
  colors: {
    background: '#1C1C1E',
    surface: '#1C1C1E',
    primary: '#75a9b4',
    secondary: '#39AEA9',
    error: '#A53828',
    info: '#298bca',
    success: '#1fae7c',
    warning: '#dcb064',
  },
  variables:{
    h1: 'text-h1',
    h2: 'text-h2',
    h3: 'text-h3',
    h4: 'text-h4',
  }
}

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: 'DarkTheme',
      themes: {
        DarkTheme,
      },
    },
  }
)
