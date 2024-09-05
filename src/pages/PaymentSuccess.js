import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { SeverErrorIllustration } from '../assets/illustrations';
import axios from '../utils/axios';

// ----------------------------------------------------------------------

export default function PaymentSuccess() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const sessionId = query.get('session_id');

  useEffect(() => {
    async function fetchSession() {
      const result = await axios
        .get(`payment/checkout-session?sessionId=${sessionId}`)
        .then((res) => res.data)
        .catch((err) => err);
      await axios.patch(`payment/${sessionId}`, {
        status: result.status,
        payment_status: result.payment_status,
      });
    }
    fetchSession();
  }, [sessionId]);

  return (
    <>
      <Helmet>
        <title> Payment successful | CreatoorAI</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Payment successful
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Your order has been placed. We&apos;ll send you an email with your order details.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button
          component={RouterLink}
          to="/dashboard/user/account"
          size="large"
          variant="contained"
        >
          Go to Your Account
        </Button>
      </MotionContainer>
    </>
  );
}
