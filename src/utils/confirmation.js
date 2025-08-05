/* src/utils/confirmation.js */
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showConfirmation = async (title, text) => {
  const result = await MySwal.fire({
    title: title || 'Apakah Anda yakin?',
    text: text || "Aksi ini tidak dapat dibatalkan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
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