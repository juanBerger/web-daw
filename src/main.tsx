import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

window.onload = async () => {

    ReactDOM.createRoot(document.getElementById('app-root')!).render(
        // <React.StrictMode>
          <App />
        // </React.StrictMode>,
      )
      
}



