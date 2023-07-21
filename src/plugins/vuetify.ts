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
    primary: '#557B833',
    'primary-darken-1': '#2f009e',
    secondary: '#39AEA9',
    'secondary-darken-1': '#096d6d',
    error: '#A53828',
    info: '#1D5F8A',
    success: '#116D4D',
    warning: '#AC894C',
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
