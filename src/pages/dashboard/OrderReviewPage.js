import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
import ReviewMusic from '../../sections/@dashboard/user/ReviewMusic';

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const bearId = query.get('bearId');

  return (
    <>
      <Helmet>
        <title> Music: Generate a Music | AI-ANALYTICS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <ReviewMusic bearId={bearId} />
      </Container>
    </>
  );
}
