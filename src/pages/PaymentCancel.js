import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { SeverErrorIllustration } from '../assets/illustrations';

// ----------------------------------------------------------------------

export default function PaymentCancel() {
  return (
    <>
      <Helmet>
        <title> Payment Cancel | AI-ANALYTICS</title>
      </Helmet>

      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Oops, payment faild
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            It looks like your order could not be paid at this time. Please try again or select a
            different payment option
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
