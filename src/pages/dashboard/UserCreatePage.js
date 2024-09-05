import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import NewMusic from '../../sections/@dashboard/user/UserNewEditForm';

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Music: Generate a Music | CreatoorAI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <NewMusic />
      </Container>
    </>
  );
}
