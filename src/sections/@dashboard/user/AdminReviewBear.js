import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
  Table,
  Card,
  Stack,
  TableBody,
  TableContainer,
  LinearProgress,
  Alert,
  AlertTitle,
  Typography,
  MenuItem,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Scrollbar from '../../../components/scrollbar';
// sections
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from '../../../components/table';
import FormProvider, { RHFSelect } from '../../../components/hook-form';

import { useSnackbar } from '../../../components/snackbar';
import Label from '../../../components/label';
import Image from '../../../components/image';
import { ReviewMusicTableRow } from './list';
import axios from '../../../utils/axios';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'content', label: 'Content', align: 'left' },
  { id: 'created_at', label: 'created_at', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
];

const COLORS = {
  idle: 'info',
  loading: 'warning',
  error: 'error',
  success: 'success',
};

const OPTIONS = [
  { value: 'on-hold', label: 'On Hold' },
  { value: 'in-production', label: 'In Production' },
  { value: 'ready-to-ship', label: 'Ready to Ship' },
  { value: 'on-the-way', label: 'On The Way' },
];

PreList.propTypes = {
  bearId: PropTypes.string,
};

export default function PreList({ bearId }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = useTable();

  // const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [apiStatus, setApiStatus] = useState('idle');
  // const [hideAlert, setHideAlert] = useState(false);
  const [bearData, setBearData] = useState({ status: 'in-production' });

  const { enqueueSnackbar } = useSnackbar();

  const loadBear = async () => {
    const _bear = await axios
      .get(`bear/${bearId}`)
      .then((resp) => resp.data)
      .catch((err) => err);
    const { finalClipIds } = _bear;
    // console.log('data :>> ', _bear);
    await setBearData(_bear);
    if (finalClipIds.length > 0) await loadFinalMusics(_bear);
    else await loadMusicsWithTaskId(_bear);
  };

  const loadMusicsWithTaskId = async (_bear) => {
    const { taskIds } = _bear;
    let i = 0;
    let musics = [];
    while (i < 3) {
      // eslint-disable-next-line no-await-in-loop
      const _newMusics = await axios
        .get(`music/getGenerationResult/${taskIds[i]}`)
        .then((resp) => {
          setApiStatus('loading');
          return resp.data;
        })
        .catch((err) => {
          setApiStatus('error');
          return err;
        });
      musics = [...musics, ..._newMusics];
      i += 1;
    }
    // console.log('musics :>> ', musics);
    await setTableData(musics);
    setIsLoading(false);
  };

  const loadFinalMusics = async (_bear) => {
    const { finalClipIds } = _bear;
    let i = 0;
    let musics = [];
    while (i < finalClipIds.length) {
      // eslint-disable-next-line no-await-in-loop
      const _newMusics = await axios
        .get(`music/${finalClipIds[i]}`)
        .then((resp) => {
          setApiStatus('loading');
          return resp.data;
        })
        .catch((err) => {
          setApiStatus('error');
          return err;
        });
      musics = [...musics, _newMusics.clip_data];
      i += 1;
    }
    console.log('musics :>> ', musics);
    await setTableData(musics);
    setIsLoading(false);
  };

  useEffect(() => {
    loadBear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bearId]);

  const FormSchema = Yup.object().shape({
    //
    status: Yup.string().required('Status is required'),
  });

  const defaultValues = useMemo(
    () => ({
      status: bearData?.status || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bearData]
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    // watch,
    reset,
    // control,
    setValue,
    handleSubmit,
    // formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('DATA', data);
    reset();
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length;

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleCheckout = async () => {
    await setIsLoadingCheckout(true);
    await axios
      .patch(`/bear/manage/${bearId}`, {
        suggestionClipIds: selected,
      })
      .then((resp) => {
        console.log('resp :>> ', resp);
      });
  };

  const handleBearStatus = async (status) => {
    setValue('status', status);
    await axios.patch(`/bear/manage/${bearId}`, {
      status,
    });
    enqueueSnackbar('Successfully ordered your request!');
  };

  return (
    <>
      <Alert
        severity={COLORS[apiStatus]}
        // onClose={() => {
        //   setHideAlert(true);
        // }}
      >
        <AlertTitle sx={{ textTransform: 'capitalize' }}> {apiStatus} </AlertTitle>
        {apiStatus === 'idle' && 'Loading the musics according to your order.'}
        {apiStatus === 'loading' && 'Please wait for a while. we are processing your order.'}
        {apiStatus === 'error' && 'Enexpected error is occured while generating.'}
        {apiStatus === 'success' && `Successfully generated your music.`}
      </Alert>

      <Card sx={{ mt: 3 }} justifyContent="flex-start">
        <Stack
          flexDirection={{ md: 'row', sx: 'column' }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Image
            alt="grid"
            src="/assets/images/home/bear.png"
            sx={{ height: 240, borderRadius: 2, m: 2 }}
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
            <Typography variant="h6">Status:</Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RHFSelect name="status" onChange={(e) => handleBearStatus(e.target.value)}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </FormProvider>
          </Stack>
        </Stack>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                tableData.map((row) => row.id)
              )
            }
          />

          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />
              {!isLoading && (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ReviewMusicTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              )}
            </Table>
          </Scrollbar>
        </TableContainer>
        <Stack spacing={3} alignItems="flex-end" sx={{ m: 3 }}>
          {isLoading && <LinearProgress color="primary" sx={{ mb: 2, width: 1 }} />}
          <LoadingButton
            type="button"
            variant="contained"
            loading={isLoadingCheckout}
            disabled={selected.length < 1}
            onClick={() => handleCheckout()}
          >
            Pick Musics for user
          </LoadingButton>
        </Stack>
      </Card>
    </>
  );
}

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
