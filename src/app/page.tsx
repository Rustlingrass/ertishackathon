import Image from "next/image";
import { Button} from '@/components/ui/button'
import { Table} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="p-8">
      <Card>
        <CardHeader><CardTitle>Problems Dashboard</CardTitle></CardHeader>
        <CardContent> {/* Add your table here later */} </CardContent>
      </Card>
    </main>
  );
}