import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"

const App = () => {
  return (
    <div className="p-2 font-bold text-2xl">
      <Button variant="outline" className="bg-yellow-500">Hello React</Button>
      <Card className="bg-indigo-200">login</Card>
    </div>
  )
}

export default App
