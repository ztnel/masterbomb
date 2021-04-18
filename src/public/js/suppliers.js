// global suppliers state
const suppliers_endpoint = '/v1/suppliers/';
var suppliers = [];
var $table = $('#suppliersTable');

// DOM Ready
$(() => {
    console.log("Suppliers DOM Ready");
    getState();
    // Add supplier modal click
    $('#addSupplier').on('click', add);
    $('#postSupplier').on('click', post_supplier);
    $('#deleteSupplier').on('click', delete_supplier);
});

// populate table with current state
function getState() {
    console.log("Fetching supplier table state");
    var table_content = '';
    // ajax call to suppliers api
    console.log(`API GET ${suppliers_endpoint}`);
    $.get({
        url: suppliers_endpoint
    }).then((data) => {
        // update global state
        suppliers = data.reverse();
        console.log("Response: ", suppliers);
        // inject html for table
        $table.bootstrapTable({data: suppliers})
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
}

// spawn supplier form modal
function add(event) {
    event.preventDefault();
    $('#supplierModal').modal();
}

// post new supplier
function post_supplier(event) {
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
        alert("Enter all required fields");
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

// post new supplier
function delete_supplier(event) {
    event.preventDefault();
    // start delete request
    const newSupplier = {
        'name': $('#supplierForm #supplierName').val(),
        'website': $('#supplierForm #supplierWebsite').val()
    };
    let endpoint = `${suppliers_endpoint}/${id}`;
    console.log(`API DELETE ${endpoint}`);
    $.delete({
        data: newSupplier,
        url: suppliers_endpoint,
        dataType:'JSON'
    }).then(() => {
       // rerequest list
       getState();
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    })
}