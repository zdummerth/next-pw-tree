import Link from 'next/link'
import React, { useState, useEffect } from "react"
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"
import styled from 'styled-components'
import { CaretUpCircle, BookOpen } from '@styled-icons/boxicons-regular'
import Flex from 'components/shared/Flex'
import Button from 'components/shared/Button'
import Input from 'components/shared/Inputs'
import LoadingIndicator from 'components/shared/LoadingIndicator'
import { dimensions, colors } from 'styles'

const Container = styled(Flex)`
    width: 100%;
`

const CardContainer = styled.div`
    // width: 90%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid white;
    border-radius: 5px;
`

const Form = styled.form`
    width: 90%;
`

const Amount = styled.div``

const cardStyle = {
    style: {
        base: {
            color: "white",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "white"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        },

    }
};

const Checkout = ({ clientSecret, amount }) => {
    const [succeeded, setSucceeded] = useState(false)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState('')
    const [disabled, setDisabled] = useState(true)
    const stripe = useStripe()
    const elements = useElements()
    const loadingStripe = !stripe || !elements

    console.log('checkout amount', amount)

    const formattedPrice = `${amount.slice(0, -2)}.${amount.slice(-2)}`

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }


    const handleSubmit = async ev => {
        ev.preventDefault();
        if (loadingStripe) {
            return
        }
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });
        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    }

    return (
        <Container dir='column' ai='center'>
            <Form onSubmit={handleSubmit}>
                {error && (
                    <div role="alert">
                        {error}
                    </div>
                )}

                {succeeded ? (
                    <div>Thank you for the dough</div>
                ) : (
                    <>
                        <Amount>
                            {`Amount: $${formattedPrice}`}
                        </Amount>
                        <CardContainer>
                            <CardElement options={cardStyle} onChange={handleChange} />
                        </CardContainer>
                        <Button disabled={!stripe || processing || disabled || succeeded}>
                            {processing ? (
                                <LoadingIndicator />
                            ) : (
                                'Pay Now'
                            )}
                        </Button>
                    </>
                )}
            </Form>
        </Container>
    )
}

export default Checkout