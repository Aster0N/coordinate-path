import "@/styles/App.css"
import { PointsContextProvider } from "./components/PointsContext"
import Home from "./pages/Home/Home"

function App() {
  return (
    <PointsContextProvider>
      <Home />
    </PointsContextProvider>
  )
}

export default App
