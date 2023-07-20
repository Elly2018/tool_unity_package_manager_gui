// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const DarkTheme = {
  dark: true,
  colors: {
    background: '#161616',
    surface: '#222222',
    primary: '#5600ce',
    'primary-darken-1': '#2f009e',
    secondary: '#00b6a4',
    'secondary-darken-1': '#096d6d',
    error: '#9b001c',
    info: '#0073d1',
    success: '#00ad06',
    warning: '#995400',
  },
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
