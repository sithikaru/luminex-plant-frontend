import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StyleTest() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Tailwind CSS Test
          </CardTitle>
          <CardDescription>
            Testing if Tailwind styles are working properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
          <div className="p-4 bg-plant-100 rounded-lg">
            <p className="text-plant-700 font-medium">
              Plant-themed styling test
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Green indicator</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
