//
// Libraries
//
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider
} from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//   Sub Components
//
import RowList from '../pages/RowList'
import Header from '../components/Header'
//
//  Global Themes used by the Theme Provider
//
const theme = createTheme({
  palette: {
    primary: {
      main: '#333996',
      light: '#3c44b126'
    },
    secondary: {
      main: '#f83245',
      light: '#f8324526'
    },
    background: {
      default: '#f4f5fd'
    }
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)'
      }
    }
  },
  props: {
    MuiIconButton: {
      disableRipple: true
    }
  }
})

const useStyles = makeStyles({
  appMain: {
    width: '100%'
  }
})

export default function App() {
  const classes = useStyles()

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className={classes.appMain}>
          <Header />
          <RowList />
        </div>
        <CssBaseline />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
