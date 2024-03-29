import stripe from 'stripe'
import isCurrency from 'validator/lib/isCurrency'

const key = process.env.NODE_ENV === 'production' ? (
    process.env.STRIPE_LIVE_KEY
) : (
    process.env.STRIPE_TEST_KEY
)
const stripeClient = stripe(key)

export default async (req, res) => {
    console.log('create payment intent called', req.body)
    const { amount } = req.body
    if (!amount) {
        res.status(400).json({ error: 'Amount is required' })
    }
    else if (!isCurrency(amount + '')) {
        res.status(400).json({ error: 'Amount must be a valid usd currency' })
    } else {
        const hasDecimal = amount.includes('.')
        const newAmount = hasDecimal ? amount.replace('.', '') : amount + '00'
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: newAmount,
            currency: "usd"
        });

        console.log('payment intent response', paymentIntent)

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            id: paymentIntent.id,
            edit: false
        })
    }


}