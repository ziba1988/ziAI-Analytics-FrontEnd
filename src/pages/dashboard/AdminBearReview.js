import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
import AdminReviewBear from '../../sections/@dashboard/user/AdminReviewBear';

export default function AdminBearReview() {
  const { themeStretch } = useSettingsContext();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const bearId = query.get('bearId');

  return (
    <>
      <Helmet>
        <title> Music: Generate a Music | CreatoorAI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <AdminReviewBear bearId={bearId} />
      </Container>
    </>
  );
}
