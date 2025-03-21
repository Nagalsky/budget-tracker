import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CurrencyComboBox } from "./currency-combo-box";

const ManageCurrency = () => {
  return (
    <section className="py-8">
      <div className="container">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for trqansactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ManageCurrency;
