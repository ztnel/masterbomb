// global suppliers state
const suppliers_endpoint = '/v1/suppliers/';
var suppliers = [];
var $table = $('#suppliersTable').bootstrapTable();
var $remove = $('#deleteSupplier');
var $add = $('#addSupplier');
var $post = $('#postSupplier');
var selections = [];

// DOM Ready
$(() => {
    $add.on('click', add);
    $post.on('click', post_supplier);
    $remove.on('click', delete_supplier);
    $remove.prop('disabled', true);
    $table.on('check.bs.table uncheck.bs.table ' + 'check-all.bs.table uncheck-all.bs.table',function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
        // save your data, here just save the current page
        selections = get_id_selection();
    });
    // once data is loaded into table hide the loading screen
    $table.on('post-body.bs.table', function (e, args) {
        $table.bootstrapTable('hideLoading');
    });
    console.log("Suppliers DOM Ready");
    getState();
});

// get the ids of all selected elements
function get_id_selection () {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    })
}

function loading_template() {
    return '<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>'
}

// populate table with current state
function getState() {
    console.log("Load start");
    $table.bootstrapTable('showLoading');
    console.log("Fetching supplier table state");
    // ajax call to suppliers api
    console.log(`API GET ${suppliers_endpoint}`);
    $.get({
        url: suppliers_endpoint
    }).then((data) => {
        // update global state
        suppliers = data.reverse();
        console.log("Response: ", suppliers);
        // inject html for table use load for event listener
        setTimeout(() => {$table.bootstrapTable('load', suppliers)}, 2000);
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

// delete one or more suppliers
// FIX: async callbacks
function delete_supplier(event) {
    event.preventDefault();
    var ids = get_id_selection();
    // start delete request
    $.when(
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
        })
    ).then( () => {
        getState();
        $remove.prop('disabled', true);
    })
}