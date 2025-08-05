/* src/utils/confirmation.js */
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showConfirmation = async ({
  title = 'Apakah Anda yakin?',
  text = "Aksi ini tidak dapat dibatalkan!",
  confirmButtonText = 'Ya, lakukan!',
  icon = 'warning',
}) => {
  const result = await MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'swal-popup',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
      title: 'swal-title-text',
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
};