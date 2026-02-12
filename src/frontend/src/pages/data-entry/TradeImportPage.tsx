import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Upload, FileText, Edit, Download } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';

export default function TradeImportPage() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Trade Import</h2>
        <p className="text-muted-foreground">Import trades from files or enter manually</p>
      </div>

      <PermissionGate capability="create_trades">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Edit className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="h-4 w-4 mr-2" />
              Import History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upload Trade File</CardTitle>
                    <CardDescription>
                      Upload CSV or Excel files containing trade data
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/assets/samples/trade-import-sample.csv" download>
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-2">Drag and drop your file here</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                  <Button>Browse Files</Button>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium mb-1">Required columns:</p>
                  <p className="text-xs text-muted-foreground">
                    client_code, trade_date, exchange, segment, security, side, quantity, price, order_id, trade_id
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <EmptyState
              title="Manual Trade Entry"
              description="Manual trade entry form will be available here. Enter trade details one by one."
              showIllustration={false}
            />
          </TabsContent>

          <TabsContent value="history">
            <EmptyState
              title="No Import History"
              description="Your trade import history will appear here once you start importing trades."
            />
          </TabsContent>
        </Tabs>
      </PermissionGate>
    </div>
  );
}
