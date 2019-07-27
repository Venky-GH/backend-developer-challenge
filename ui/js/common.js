$(function () {
  $("#loader").addClass("hidden");
  $("#rest_body").removeClass("hidden");

  $("#myFile").change(function (e) {
    var name_splits = e.target.value.split(".");
    var extension = name_splits[name_splits.length - 1];
    var allowed_extensions = ["xls", "xlsx", "csv"];
    if (!allowed_extensions.includes(extension)) {
      show_toast(0, "File type not allowed!", "");
      $(this).val("");
    }
  });

  $("#myForm").submit(function (e) {
    show_toast(2, "Your file is being generated. This might take a while!", "Sit back and relax!");

    e.preventDefault();
    e.stopImmediatePropagation();

    let form_submit_btn = $("#form_submit");
    form_submit_btn.attr("disabled", true);
    form_submit_btn.val("generating...");

    let fd = new FormData($("#myForm")[0]);

    $.ajax({
      url: '/upload',
      type: 'POST',
      contentType: false,
      processData: false,
      dataType: 'json',
      data: fd,
      success: function (json) {
        form_submit_btn.removeAttr("disabled");
        form_submit_btn.val("generate");
        if (json.status === 1) {
          show_toast(1, json.msg, "");
          let tabularData = [];
          tabularData[0] = {};
          tabularData[0].sheetName = "Sheet 1";
          tabularData[0].data = [];
          // set column headings
          tabularData[0].data.push([{"text": "Non Profit"}, {"text": "Number of Donations"}, {"text": "Total Amount"}, {"text": "Total Fee"}]);
          // fill in the data
          $.each(json.list, function (key, value) {
            tabularData[0].data.push([{"text": value["Non Profit"]}, {"text": value["Number of Donations"]}, {"text": value["Total Amount"]}, {"text": value["Total Fee"]}]);
          });

          let options = {
            fileName: "Donation Details (in " + $("#cid").val() + ")"
          };
          Jhxlsx.export(tabularData, options);

        } else {
          console.log(json.msg);
          show_toast(0, json.msg, "");
        }
      },
      error: function (err) {
        form_submit_btn.removeAttr("disabled");
        form_submit_btn.val("generate");
        console.log(err);
        show_toast(0, "Something went wrong!", "Please try again.");
      }
    });
  });
});

function show_toast(msg_type, title, msg = '') {
  let color;
  if (msg_type === 1)
    color = '#0BB76C';
  else if (msg_type === 0)
    color = '#e53935';
  else
    color = '#df8a00';
  iziToast.show({
    theme: 'dark',
    color: color,
    pauseOnHover: true,
    progressBar: true,
    position: "bottomCenter",
    title: title,
    message: msg
  });
}