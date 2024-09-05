/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Card,
  Box,
  Paper,
  Step,
  Stepper,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Typography,
  Stack,
} from '@mui/material';
// utils
import { bgGradient } from '../../../utils/cssStyles';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Image from '../../../components/image';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function UserBearsPage() {
  const [bearData, setBearData] = useState({ id: '', prompt: '' });
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    { value: 'in-production', label: 'In Production' },
    { value: 'ready-to-ship', label: 'Ready to Ship' },
    { value: 'on-the-way', label: 'On The Way' },
  ];

  const getMyBear = async () => {
    await axios
      .get('bear/myBear')
      .then((res) => {
        console.log('res :>> ', res.data);
        setBearData(res.data);
        const index = STEPS.findIndex((step) => step.value === res.data.status);
        setActiveStep(index);
      })
      .catch((err) => err);
  };

  useEffect(() => {
    getMyBear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    height: 22,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.disabled,
    ...(ownerState.active && {
      color: theme.palette.success.main,
    }),
    '& .QontoStepIcon-completedIcon': {
      zIndex: 1,
      fontSize: 18,
      color: theme.palette.success.main,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }));

  QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    className: PropTypes.string,
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Iconify
            icon="eva:checkmark-fill"
            className="QontoStepIcon-completedIcon"
            width={24}
            height={24}
          />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        ...bgGradient({
          startColor: theme.palette.error.light,
          endColor: theme.palette.error.main,
        }),
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        ...bgGradient({
          startColor: theme.palette.error.light,
          endColor: theme.palette.error.main,
        }),
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      borderRadius: 1,
      backgroundColor: theme.palette.divider,
    },
  }));

  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    zIndex: 1,
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.disabled,
    backgroundColor:
      theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
    ...(ownerState.active && {
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      color: theme.palette.common.white,
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    }),
    ...(ownerState.completed && {
      color: theme.palette.common.white,
      ...bgGradient({
        startColor: theme.palette.error.light,
        endColor: theme.palette.error.main,
      }),
    }),
  }));

  ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    icon: PropTypes.number,
    completed: PropTypes.bool,
    className: PropTypes.string,
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  function ColorlibStepIcon(props) {
    const { active, completed, className, icon } = props;

    const icons = {
      1: <Iconify icon="eva:headphones-outline" width={24} />,
      2: <Iconify icon="eva:paper-plane-outline" width={24} />,
      3: <Iconify icon="eva:car-outline" width={24} />,
    };

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(icon)]}
      </ColorlibStepIconRoot>
    );
  }

  return (
    <div>
      <Box gap={1} display="grid">
        {/* {bears.map((bear, index) =>
            bear.clips.map((clip, i) => <UserCard key={i} user={clip.clip_data} />)
          )} */}
        <Card
          sx={{
            mt: 3,
            py: 4,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Image
            alt="grid"
            src="/assets/images/home/bear.png"
            sx={{ height: 240, borderRadius: 2 }}
          />
          <Stack sx={{ p: 2 }}>
            <Typography variant="h6">BearId:</Typography>
            <Typography sx={{ mb: 2 }}>{bearData.id}</Typography>
            <Typography variant="h6">Prompt:</Typography>
            <Typography sx={{ mb: 2 }}>{bearData?.prompt}</Typography>
            <Typography variant="h6">Payment Status:</Typography>
            <Typography sx={{ mb: 2 }}>
              <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
                {bearData?.payment_status}
              </Label>
            </Typography>
          </Stack>
        </Card>
        <Paper
          sx={{
            p: 3,
            width: '100%',
            boxShadow: (theme) => theme.customShadows.z8,
          }}
        >
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {STEPS.map(({ label }) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Box>
    </div>
  );
}
