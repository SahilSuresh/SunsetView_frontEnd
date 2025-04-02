import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

type PaymentFormProps = {
  onPaymentStatus: (isComplete: boolean) => void;
  clientSecret: string;
};

const PaymentForm = ({ onPaymentStatus, clientSecret }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isElementMounted, setIsElementMounted] = useState(false);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    // Check the payment intent status on component mount
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          setIsComplete(true);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Please enter your payment details.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, clientSecret]);

  // Listen for changes in the PaymentElement
  useEffect(() => {
    if (!elements) return;

    // Check if element is mounted with a small delay to ensure DOM is updated
    setTimeout(() => {
      const paymentElement = elements.getElement('payment');
      if (paymentElement) {
        setIsElementMounted(true);
        console.log("Payment element successfully mounted");
        
        // Listen for change events to validate the input
        const onChange = (event: any) => {
          setIsComplete(event.complete);
          onPaymentStatus(event.complete);
        };

        paymentElement.on('change', onChange);
        
        // Clean up the listener when the component unmounts
        return () => {
          console.log("Removing payment element listeners");
          paymentElement.off('change', onChange);
        };
      } else {
        console.error("Payment element not found");
        setIsElementMounted(false);
      }
    }, 100);
  }, [elements, onPaymentStatus]);

  // Report mount status to parent
  useEffect(() => {
    console.log("Payment form element mounted status:", isElementMounted);
  }, [isElementMounted]);

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
      <PaymentElement 
        id="payment-element" 
        options={{
          layout: 'tabs',
          fields: {
            billingDetails: {
              address: {
                country: 'never'
              }
            }
          }
        }} 
      />
      {message && <div className="text-xs text-gray-500 mt-3">{message}</div>}
      <div className="text-xs text-gray-500 mt-3">
        Your card information is encrypted and secure. We never store your full card details.
      </div>
    </div>
  );
};

export default PaymentForm;