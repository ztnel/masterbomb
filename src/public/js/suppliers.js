// global suppliers state
const suppliers_endpoint = '/v1/suppliers/';
var suppliers = [];
var $table = $('#suppliersTable');
var $remove = $('#deleteSupplier');
var selections = [];

// DOM Ready
$(() => {
    console.log("Suppliers DOM Ready");
    getState();
    // Add supplier modal click
    $('#addSupplier').on('click', add);
    $('#postSupplier').on('click', post_supplier);
    $remove.on('click', delete_supplier);
    $remove.prop('disabled', true);
    $table.on('check.bs.table uncheck.bs.table ' + 'check-all.bs.table uncheck-all.bs.table',function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
        // save your data, here just save the current page
        selections = get_id_selection();
        console.log(selections);
    })
});

// get the ids of all selected elements
function get_id_selection () {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    })
}

// populate table with current state
function getState() {
    $table.bootstrapTable("destroy");
    console.log("Fetching supplier table state");
    // ajax call to suppliers api
    console.log(`API GET ${suppliers_endpoint}`);
    $.get({
        url: suppliers_endpoint
    }).then((data) => {
        // update global state
        suppliers = data.reverse();
        console.log("Response: ", suppliers);
        // inject html for table
        $table.bootstrapTable({data: suppliers});
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
    var ids = get_id_selection();
    // start delete request
    ids.forEach(id => {
        let endpoint = `${suppliers_endpoint}${id}`;
        console.log(`API DELETE ${endpoint}`);
        $.ajax({
            url: endpoint,
            type: 'DELETE',
            dataType: 'json',
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log(response);
                console.error("API request failed");
                alert("API Request Failed");
            }
        });
    });
    getState();
    $remove.prop('disabled', true);
}