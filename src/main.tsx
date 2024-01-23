import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const DEV = false;

window.onload = async () => {
    
    import.meta.env.DEV = DEV;
    import.meta.env.PROD = !DEV;

    ReactDOM.createRoot(document.getElementById('app-root')!).render(
        // <React.StrictMode>
          <App />
        // </React.StrictMode>,
      )
      
}



