/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Avatar, Button, Checkbox, TableRow, TableCell, Typography } from '@mui/material';
import moment from 'moment';
// components
import Label from '../../../../components/label';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { title, image_url, audio_url, created_at, status } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={created_at} src={image_url} />

            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <audio controls controlsList="nodownload" src={audio_url} />
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          <Label
            variant="soft"
            color={(status === 'banned' && 'error') || 'secondary'}
            sx={{ textTransform: 'capitalize' }}
          >
            {moment(created_at).format('YYYY-MM-DD HH:mm')}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 'banned' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
