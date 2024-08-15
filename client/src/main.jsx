import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store,persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
createRoot(document.getElementById('root')).render(
<PersistGate persistor={persistor}>
    <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
    </BrowserRouter>
    </PersistGate>
)
