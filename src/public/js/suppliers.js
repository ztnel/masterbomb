// global suppliers state
const suppliers_endpoint = '/v1/suppliers/';
var suppliers = [];

// DOM Ready
$(() => {
    console.log("Suppliers DOM Ready");
    getState();
    // Add supplier modal click
    $('#addSupplier').on('click', add);
    $('#postSupplier').on('click', post);
});

// populate table with current state
function getState() {
    console.log("Fetching supplier table state");
    var table_content = '';
    // ajax call to suppliers api
    $.get({
        url: suppliers_endpoint,
        dataType: 'JSON'
    }).then((data) => {
        console.log(`API GET ${suppliers_endpoint} with: `, {...data});
        // update global state
        suppliers = data;
        // inject html for table
        $.each(data, (key, value) => {
            table_content += '<tr>';
            table_content += '<td>' + value.name + '</td>';
            table_content += '<td>' + value.website + '</td>';
            table_content += '</tr>';
        });
        $('table tbody').html(table_content);
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
    // pass table html to
}

// spawn supplier form modal
function add(event) {
    event.preventDefault();
    $('#supplierModal').modal();
}

// post new supplier
function post(event) {
    console.log("Validating supplier form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#supplierForm input').each(function (index, val) {
        if ($(this).val() === '') {
            error_flag = true;
        }
    });
    if (error_flag == true) {
        console.error("Validation failed");
        alert("Enter non-empty fields");
        return false;
    }
    // start post request
    const newSupplier = {
        'name': $('#supplierForm #supplierName').val(),
        'website': $('#supplierForm #supplierWebsite').val()
    };
    console.log(`API POST ${suppliers_endpoint} with: `, {...newSupplier});
    $.post({
        data: newSupplier,
        url: suppliers_endpoint,
        dataType:'JSON'
    }).then(() => {
       // clear fields
       $('#supplierForm input').val('');
       // hide modal
       $('#supplierModal').modal('toggle');
       // rerequest get requests
       getState();
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    })
}