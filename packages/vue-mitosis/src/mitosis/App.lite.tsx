import { useState } from '@builder.io/mitosis'
import Button from './Button.lite'
import Input from './Input.lite'
import Card, { CardHeader, CardTitle, CardContent } from './Card.lite'
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table.lite'

export default function App() {
  const [inputValue, setInputValue] = useState('')
  const [counter, setCounter] = useState(0)

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ]

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value)
  }

  const incrementCounter = () => {
    setCounter(counter + 1)
  }

  const resetCounter = () => {
    setCounter(0)
  }

  return (
    <div class="min-h-screen bg-background p-8">
      <div class="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div class="text-center">
          <h1 class="text-4xl font-bold text-foreground mb-2">
            ShadCN Vue.js with Mitosis
          </h1>
          <p class="text-muted-foreground">
            A complete example using ShadCN components built with Mitosis for Vue.js
          </p>
        </div>

        {/* Interactive Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium mb-2 block">
                  Text Input
                </label>
                <Input
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={handleInputChange}
                />
                {inputValue && (
                  <p class="text-sm text-muted-foreground mt-2">
                    You typed: {inputValue}
                  </p>
                )}
              </div>

              <div>
                <label class="text-sm font-medium mb-2 block">
                  Counter: {counter}
                </label>
                <div class="flex gap-2">
                  <Button onClick={incrementCounter}>
                    Increment
                  </Button>
                  <Button variant="outline" onClick={resetCounter}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Variants Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span class="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                        {user.role}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div class="text-center text-sm text-muted-foreground">
          <p>Built with Mitosis, Vue.js, and ShadCN design system</p>
          <p>Deployable to Cloudflare Pages</p>
        </div>
      </div>
    </div>
  )
}