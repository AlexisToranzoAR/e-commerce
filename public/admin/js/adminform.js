$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

$(document).ready(() => {
  $('#form-admin').on('submit', function (e) {
    e.preventDefault();
    const url = $(this).attr('action');
    const data = $(this).serializeObject();

    fetch(url, {
      method: $(this).attr('method'),
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.status);
        }
      })
      .then((response) => {
        Swal.fire({
          title: 'Good job!',
          text: response.message,
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.replace('/admin/administrators');
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.replace('/admin/administrators');
          }
        });
      });
  });
});
