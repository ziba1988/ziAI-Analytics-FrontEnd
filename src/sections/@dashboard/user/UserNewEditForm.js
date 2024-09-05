import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';
// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  userData: PropTypes.object,
};

export default function UserNewEditForm({ userData }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Baby Name is required'),
    appearance: Yup.string().required('appearance is required'),
    personality: Yup.string().required('personality is required'),
    feature: Yup.string().required('feature is required'),
    special: Yup.string().required('special is required'),
    perspective: Yup.string().required('perspective is required'),
    singer: Yup.string().required('singer is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: userData?.name || '',
      appearance: userData?.appearance || '',
      personality: userData?.personality || '',
      feature: userData?.feature || '',
      special: userData?.special || '',
      perspective: userData?.perspective || '',
      singer: userData?.singer || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userData]
  );
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    // reset,
    // watch,
    // control,
    // setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await axios
        .post('music/generate', {
          prompt:
            'unique song for children with the following information:: \n' +
            `Name of child: ${data.name}\n` +
            `Appearance of child: ${data.appearance}\n` +
            // `Personality of child: ${data.personality}\n` +
            // `Things only you know about your child: ${data.feature}\n` +
            // `Any other special things to mention:  ${data.special}\n` +
            // `Perspective (whose perspective the song is written from): ${data.perspective}\n` +
            `Male or Female Singer: ${data.singer}\n`,
        })
        .then((res) => {
          const { result } = res.data;
          // console.log('result :>> ', result);
          enqueueSnackbar('Successfully ordered your request!');
          navigate(`${PATH_DASHBOARD.user.review}?bearId=${result.id}`);
        })
        .catch((err) => {
          console.log('err :>> ', err);
          enqueueSnackbar('error occrued while loading');
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Answer the questions
            </Typography>
            <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
              <RHFTextField name="name" label="Name of child" />
              <RHFTextField name="appearance" label="Appearance of child" />
              <RHFTextField name="personality" label="Personality of child" />
              <RHFTextField name="feature" label="Things only you know about your child" />
              <RHFTextField name="special" label="Any other special things to mention" />
              <RHFTextField
                name="perspective"
                label="Perspective (whose perspective the song is written from)"
              />
              <RHFTextField name="singer" label="Male or Female Singer" />

              <Stack
                alignItems="center"
                sx={{ mt: 3, width: 1, gap: 2 }}
                direction={{ xs: 'column', sm: 'row' }}
              >
                <LoadingButton
                  type="button"
                  variant="outlined"
                  onClick={reset}
                  sx={{ width: '100%' }}
                >
                  Clear
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ width: '100%' }}
                >
                  Make My Baby Happy
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
