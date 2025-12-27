import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShippingAddress } from "@/types";
import Link from "next/link";

const UserAddress = ({ address }: { address: ShippingAddress }) => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl pb-4">ShippingAddress</h2>
        <p>{address.fullName}</p>
        <p>
          {address.streetAddress}, {address.city}, {address.postalCode},{" "}
          {address.country} {""}
        </p>
        <div className="mt-3">
          <Link href="/shipping-address">
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAddress;
