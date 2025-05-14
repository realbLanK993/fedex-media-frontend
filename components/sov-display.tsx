// components/SoVDisplay.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface SoVDataItem {
  companyName: string;
  count: number;
  sovPercentage: number;
}

interface SoVDisplayProps {
  sovData: SoVDataItem[];
  targetCompany?: string;
}

export function SoVDisplay({ sovData, targetCompany }: SoVDisplayProps) {
  if (!sovData || sovData.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Share of Voice</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sovData.map((item) => {
            const isTargetCompany =
              targetCompany &&
              item.companyName.toLowerCase() === targetCompany.toLowerCase();
            return (
              <li key={item.companyName}>
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`font-medium ${
                      isTargetCompany ? "text-primary font-semibold" : ""
                    }`}
                  >
                    {item.companyName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.sovPercentage.toFixed(1)}% ({item.count} articles)
                  </span>
                </div>
                <Progress
                  value={item.sovPercentage}
                  className="h-3"
                  // The Progress component's indicator will use the default 'bg-primary'
                  // The distinction for the target company is primarily through text styling above.
                />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
