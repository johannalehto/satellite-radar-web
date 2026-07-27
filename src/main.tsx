import { createRoot } from 'react-dom/client'
import '@fontsource/iosevka-charon-mono/latin-300.css'
import '@fontsource/roboto-mono/latin-300.css'
import App from './web/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <App />,
)
