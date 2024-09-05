import { Helmet } from 'react-helmet-async';
// @mui
import { Box } from '@mui/material';
// components
import ScrollProgress from '../components/scroll-progress';
// sections
import { HomeHero, HomeMinimal, HomeDarkMode, HomeAdvertisement } from '../sections/home';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Landing Page | CreatoorAI</title>
      </Helmet>

      <ScrollProgress />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimal />
        <HomeDarkMode />
      </Box>
    </>
  );
}
