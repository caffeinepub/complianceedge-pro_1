import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Trash2, Plus, Info } from 'lucide-react';
import {
  ManualTradeEntry,
  ValidationErrors,
  validateManualTrade,
  hasValidationErrors,
  createEmptyTrade,
  ALLOWED_SIDES,
} from '../tradeImport/manualTradeValidation';

export default function ManualTradeEntryPanel() {
  const [formData, setFormData] = useState<ManualTradeEntry>(createEmptyTrade());
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [trades, setTrades] = useState<ManualTradeEntry[]>([]);

  const handleInputChange = (field: keyof ManualTradeEntry, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateManualTrade(formData);
    
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Add trade to list
    setTrades((prev) => [...prev, { ...formData }]);
    
    // Reset form
    setFormData(createEmptyTrade());
    setErrors({});
  };

  const handleRemoveTrade = (index: number) => {
    setTrades((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Trades entered here are stored in your current session for review. They are not yet saved to the backend.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Enter Trade Details</CardTitle>
          <CardDescription>Fill in all required fields to add a trade entry</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Client Code */}
              <div className="space-y-2">
                <Label htmlFor="client_code">
                  Client Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="client_code"
                  value={formData.client_code}
                  onChange={(e) => handleInputChange('client_code', e.target.value)}
                  placeholder="e.g., CLI001"
                />
                {errors.client_code && (
                  <p className="text-xs text-destructive">{errors.client_code}</p>
                )}
              </div>

              {/* Trade Date */}
              <div className="space-y-2">
                <Label htmlFor="trade_date">
                  Trade Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="trade_date"
                  type="date"
                  value={formData.trade_date}
                  onChange={(e) => handleInputChange('trade_date', e.target.value)}
                />
                {errors.trade_date && (
                  <p className="text-xs text-destructive">{errors.trade_date}</p>
                )}
              </div>

              {/* Exchange */}
              <div className="space-y-2">
                <Label htmlFor="exchange">
                  Exchange <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="exchange"
                  value={formData.exchange}
                  onChange={(e) => handleInputChange('exchange', e.target.value)}
                  placeholder="e.g., NSE, BSE"
                />
                {errors.exchange && (
                  <p className="text-xs text-destructive">{errors.exchange}</p>
                )}
              </div>

              {/* Segment */}
              <div className="space-y-2">
                <Label htmlFor="segment">
                  Segment <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="segment"
                  value={formData.segment}
                  onChange={(e) => handleInputChange('segment', e.target.value)}
                  placeholder="e.g., EQ, FO"
                />
                {errors.segment && (
                  <p className="text-xs text-destructive">{errors.segment}</p>
                )}
              </div>

              {/* Security */}
              <div className="space-y-2">
                <Label htmlFor="security">
                  Security <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="security"
                  value={formData.security}
                  onChange={(e) => handleInputChange('security', e.target.value)}
                  placeholder="e.g., RELIANCE"
                />
                {errors.security && (
                  <p className="text-xs text-destructive">{errors.security}</p>
                )}
              </div>

              {/* Side */}
              <div className="space-y-2">
                <Label htmlFor="side">
                  Side <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.side}
                  onValueChange={(value) => handleInputChange('side', value)}
                >
                  <SelectTrigger id="side">
                    <SelectValue placeholder="Select side" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALLOWED_SIDES.map((side) => (
                      <SelectItem key={side} value={side}>
                        {side}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.side && (
                  <p className="text-xs text-destructive">{errors.side}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="any"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="e.g., 100"
                />
                {errors.quantity && (
                  <p className="text-xs text-destructive">{errors.quantity}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="any"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="e.g., 2500.50"
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price}</p>
                )}
              </div>

              {/* Order ID */}
              <div className="space-y-2">
                <Label htmlFor="order_id">
                  Order ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="order_id"
                  value={formData.order_id}
                  onChange={(e) => handleInputChange('order_id', e.target.value)}
                  placeholder="e.g., ORD123456"
                />
                {errors.order_id && (
                  <p className="text-xs text-destructive">{errors.order_id}</p>
                )}
              </div>

              {/* Trade ID */}
              <div className="space-y-2">
                <Label htmlFor="trade_id">
                  Trade ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="trade_id"
                  value={formData.trade_id}
                  onChange={(e) => handleInputChange('trade_id', e.target.value)}
                  placeholder="e.g., TRD789012"
                />
                {errors.trade_id && (
                  <p className="text-xs text-destructive">{errors.trade_id}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Trade
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {trades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Entered Trades ({trades.length})</CardTitle>
            <CardDescription>Review your trade entries before final submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Code</TableHead>
                    <TableHead>Trade Date</TableHead>
                    <TableHead>Exchange</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Trade ID</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{trade.client_code}</TableCell>
                      <TableCell>{trade.trade_date}</TableCell>
                      <TableCell>{trade.exchange}</TableCell>
                      <TableCell>{trade.segment}</TableCell>
                      <TableCell>{trade.security}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            trade.side === 'Buy'
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {trade.side}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{trade.quantity}</TableCell>
                      <TableCell className="text-right">{trade.price}</TableCell>
                      <TableCell>{trade.order_id}</TableCell>
                      <TableCell>{trade.trade_id}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTrade(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
