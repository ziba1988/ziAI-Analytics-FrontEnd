import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Button } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import { AppWelcome, AppWidgetSummary } from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets/illustrations';

export default function GeneralAppPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const handleClickItem = (path) => {
    navigate(PATH_DASHBOARD.user.new);
  };

  return (
    <>
      <Helmet>
        <title> General: App | CreatoorAI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome
              title={`Welcome back! \n ${user?.name}`}
              description="You can start generate your own music for you amd your children"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={
                <Button variant="contained" onClick={() => handleClickItem()}>
                  Generate Song
                </Button>
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Your Total Musics"
              percent={2.6}
              total={65}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 6, 8, 15, 16, 11, 9, 17, 10, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Bears"
              percent={0.2}
              total={6}
              chart={{
                colors: [theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Downloads"
              percent={-1.1}
              total={4}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 1, 8, 16, 9, 8, 3, 5, 4],
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
