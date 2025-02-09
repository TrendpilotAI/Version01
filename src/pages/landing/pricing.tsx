import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Starter',
    price: 0,
    features: ['1 Newsletter', '1,000 Subscribers', 'Basic Analytics', 'Email Support'],
  },
  {
    name: 'Pro',
    price: 29,
    features: ['5 Newsletters', '10,000 Subscribers', 'Advanced Analytics', 'Priority Support'],
  },
  {
    name: 'Enterprise',
    price: 99,
    features: ['Unlimited Newsletters', 'Unlimited Subscribers', 'Custom Analytics', '24/7 Support'],
  },
];

export function Pricing() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6">Get Started</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}