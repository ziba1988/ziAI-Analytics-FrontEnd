import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
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
  const [hideAlert, setHideAlert] = useState(false);
  const [bearData, setBearData] = useState({ status: 'pending', suggestionClipIds: [] });

  const loadBear = async () => {
    const intervalId = setInterval(async () => {
      const _bear = await axios
        .get(`bear/${bearId}`)
        .then((resp) => resp.data)
        .catch((err) => err);
      const { suggestionClipIds } = _bear;
      console.log('data :>> ', _bear);
      await setBearData(_bear);
      if (suggestionClipIds.length > 0) {
        clearInterval(intervalId);
        let i = 0;
        let musics = [];
        while (i < suggestionClipIds.length) {
          // eslint-disable-next-line no-await-in-loop
          const clipData = await loadMusic(suggestionClipIds[i]);
          musics = [...musics, clipData];
          i += 1;
        }
        console.log('musics :>> ', musics);
        await setTableData(musics);
        await setIsLoading(false);
        await setApiStatus('success');
      }
    }, 10000);
  };

  const loadMusic = async (clipId) => {
    const _musicData = await axios
      .get(`music/${clipId}`)
      .then((resp) => {
        setApiStatus('loading');
        return resp.data.clip_data;
      })
      .catch((err) => {
        setApiStatus('error');
        return err;
      });
    console.log('musicData :>> ', _musicData);
    return _musicData;
  };

  useEffect(() => {
    // setHideAlert(false);
    loadBear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const unit_amount = (150 + (selected.length - 1) * 25) * 100;
    await setIsLoadingCheckout(true);
    await axios
      .post('/payment/create-checkout-session', {
        unit_amount,
        product_data: {
          name: `Bear for your child`, // Name of the product
          images: [
            'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV82X3dhdGVyY29sb3JfaWxsdXN0cmF0aW9uX2JhYnlfYmVhcl9mdWxsX2JvZHlfbl83MjY3NTQ0OS05ZTk0LTQ2NmItYjdhMS0yNzc0NTgyYWIxZGMucG5n.png',
          ],
        },
        clipIds: selected,
        bearId,
      })
      .then((session) => {
        window.location.href = session.data.url;
      });
  };

  return (
    <>
      {bearData?.suggestionClipIds.length > 0 ? (
        <>
          <Alert
            severity={COLORS[apiStatus]}
            onClose={() => {
              setHideAlert(true);
            }}
          >
            <AlertTitle sx={{ textTransform: 'capitalize' }}> {apiStatus} </AlertTitle>
            {apiStatus === 'idle' && 'Loading the musics according to your order.'}
            {apiStatus === 'loading' && 'Please wait for a while. we are processing your order.'}
            {apiStatus === 'error' && 'Enexpected error is occured while generating.'}
            {apiStatus === 'success' && `Successfully generated your music.`}
          </Alert>

          <Card sx={{ mt: 3 }}>
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
                Create Memory
              </LoadingButton>
            </Stack>
          </Card>
        </>
      ) : (
        <Card
          sx={{
            mt: 3,
            py: 4,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h2">review your songs</Typography>
          <Typography variant="h2">and pick product</Typography>
          <Typography variant="h2">in your child&apos;s Bear</Typography>
          <Image
            disabledEffect
            alt="grid"
            src="/assets/images/home/bear.png"
            sx={{ width: '450px', height: '450px', mt: 4, mx: 2, borderRadius: 2 }}
          />
        </Card>
      )}
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
