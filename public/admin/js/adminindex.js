$(document).ready(() => {
  $('.delete-button').click(function (e) {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const url = $(this).attr('href');
        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.text();
            } else {
              throw Error(response.status);
            }
          })
          .then((response) => {
            Swal.fire({
              title: 'Deleted!',
              text: response,
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          });
      }
    });
  });
});
