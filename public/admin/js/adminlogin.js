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
  $('#login-form').on('submit', function (e) {
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
        }
        throw response.status;
      })
      .then((response) => {
        Swal.fire({
          title: 'Good job!',
          text: response.message,
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.replace('/admin');
          }
        });
      })
      .catch((error) => {
        let errorMessage = '';
        switch (error) {
          case 401:
            errorMessage = "The password isn't correct!";
            break;
          case 404:
            errorMessage = "The username doesn't exists!";
            break;
          default:
            errorMessage = 'Something went wrong!';
        }
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.replace('/admin/login');
          }
        });
      });
  });
});
