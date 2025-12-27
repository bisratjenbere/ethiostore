import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const UserPaymentMethod = ({ paymentMethod }: { paymentMethod: string }) => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl pb-4">Payment Method</h2>
        <p>{paymentMethod}</p>
        <div className="mt-3">
          <Link href="/payment-method">
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPaymentMethod;
