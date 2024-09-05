import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Link,
  Stack,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Avatar,
  Typography,
} from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onApproveRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onSelectRow, onApproveRow, onDeleteRow }) {
  const { id, userId: user, createdAt, payment_status, status } = row;

  const [openApproveConfirm, setOpenApproveConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenApproveConfirm = () => {
    setOpenApproveConfirm(true);
  };

  const handleCloseApproveConfirm = () => {
    setOpenApproveConfirm(false);
  };

  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="left">
          <Link
            component={RouterLink}
            to={`${PATH_DASHBOARD.admin.detail}?bearId=${id}`}
            sx={{
              color: 'text.secondary',
              transition: (theme) => theme.transitions.create('all'),
              '&:hover': { color: 'primary.main' },
            }}
          >
            {id}
          </Link>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={user.name} src={user.name} />

            <Stack direction="column" alignItems="left">
              <Typography variant="subtitle2" noWrap>
                {user.name}
              </Typography>
              <Typography variant="body2" noWrap>
                {user.email}
              </Typography>
            </Stack>
          </Stack>
        </TableCell>

        {/* <TableCell align="left">{user.name}</TableCell> */}

        <TableCell align="center">
          <Label variant="soft" color="secondary" sx={{ textTransform: 'capitalize' }}>
            {moment(createdAt).format('YYYY-MM-DD HH:mm')}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={(status === 'paid' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {payment_status}
          </Label>
        </TableCell>

        {/* <TableCell align="center">
          <Iconify
            icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isVerified && { color: 'warning.main' }),
            }}
          />
        </TableCell> */}

        <TableCell align="center">
          <Label
            variant="soft"
            color={(status === 'pending' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenApproveConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'primary.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Approve
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenDeleteConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:edit-fill" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openApproveConfirm}
        onClose={handleCloseApproveConfirm}
        title="Approve"
        content="Are you sure want to approve?"
        action={
          <Button variant="contained" color="primary" onClick={onApproveRow}>
            Approve
          </Button>
        }
      />

      <ConfirmDialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
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
