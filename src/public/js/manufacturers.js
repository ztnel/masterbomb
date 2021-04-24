// global manufacturers state
const manufacturers_endpoint = '/v1/manufacturers/';
var manufacturers = [];
var $table = $('#manufacturersTable').bootstrapTable();
var $remove = $('#deleteManufacturer');
var $add = $('#addManufacturer');
var $edit = $('#editManufacturer');
var $post = $('#post');
var $put = $('#put');
var selections = [];

// DOM Ready
$(() => {
    // navbar page highlight
    $('#nav-item-manufacturers').addClass('active');
    $add.on('click', add);
    $post.on('click', post_manufacturer);
    $edit.on('click', edit); 
    $put.on('click', put_manufacturer);
    $remove.on('click', delete_manufacturer);
    // register table events
    $table.on('check.bs.table uncheck.bs.table ' + 'check-all.bs.table uncheck-all.bs.table',function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
        $edit.prop('disabled', $table.bootstrapTable('getSelections').length !== 1);
        // save your data, here just save the current page
        selections = get_id_selection();
    });
    // once data is loaded into table hide the loading screen
    $table.on('post-body.bs.table', function (e, args) {
        $table.bootstrapTable('hideLoading');
    });
    console.log("Manufacturers DOM Ready");
    get_state();
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
function get_state() {
    $table.bootstrapTable('showLoading');
    console.log("Fetching manufacturer table state");
    // ajax call to manufacturers api
    console.log(`API GET ${manufacturers_endpoint}`);
    $.get({
        url: manufacturers_endpoint
    }).then((data) => {
        // update global state
        manufacturers = data.reverse();
        console.log("Response: ", manufacturers);
        // inject html for table use load for event listener
        // temp timeout for load wheel debug
        setTimeout(() => {$table.bootstrapTable('load', manufacturers)}, 1000);
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
    // manually reset remove and edit options since the table selections are cleared on reload
    $remove.prop('disabled', true);
    $edit.prop('disabled', true);
}

// spawn manufacturer form modal
function add(event) {
    event.preventDefault();
    // clear inputs set button
    $('#manufacturerForm input').each(function (index, val) {
        $(this).val('');
    });
    $post.prop("hidden", false);
    $put.prop("hidden", true);
    // set title
    $('#modalTitle').text("Add New Manufacturer");
    // spawn modal
    $('#formModal').modal();
}

function edit(event) {
    event.preventDefault();
    // inputs reflect selection
    manufacturers.forEach(manufacturer => {
        if (manufacturer.state === true) {
            $('#manufacturerName').val(manufacturer.name);
        }
    });
    $post.prop("hidden", true);
    $put.prop("hidden", false);
    // set title
    $('#modalTitle').text("Edit Manufacturer");
    $('#formModal').modal();
}

// post new manufacturer
function post_manufacturer(event) {
    console.log("Validating manufacturer form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#manufacturerForm input').each(function (index, val) {
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
    const manufacturer_payload = {
        'name': $('#manufacturerForm #manufacturerName').val()
    };
    console.log(`API POST ${manufacturers_endpoint} with: `, {...manufacturer_payload});
    $.post({
        data: manufacturer_payload,
        url: manufacturers_endpoint,
        dataType:'JSON'
    }).then(() => {
       // clear fields
       $('#manufacturerForm input').val('');
       // hide modal
       $('#formModal').modal('toggle');
       // rerequest get requests
       get_state();
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
}

// put new manufacturer
function put_manufacturer(event) {
    console.log("Validating manufacturer form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#manufacturerForm input').each(function (index, val) {
        if ($(this).val() === '') {
            error_flag = true;
        }
    });
    if (error_flag == true) {
        console.error("Validation failed");
        alert("Enter all required fields");
        return false;
    }
    // here only a single id field can be selected so this getter is safe
    const manufacturer_payload = {
        'id': get_id_selection()[0],
        'name': $('#manufacturerForm #manufacturerName').val(),
    };
    console.log(`API POST ${manufacturers_endpoint} with: `, {...manufacturer_payload});
    $.ajax({
        type: 'PUT',
        data: manufacturer_payload,
        url: manufacturers_endpoint,
        dataType:'JSON',
        success: () => {
            // clear fields
            $('#manufacturerForm input').val('');
            // hide modal
            $('#formModal').modal('toggle');
            // rerequest get requests
            get_state();
        },
        error: (xhr) => {
            console.error(`API request failed with status code: ${xhr.status}`);
            alert("API Request Failed");
        }
    });
}

// delete one or more manufacturers
function delete_manufacturer(event) {
    event.preventDefault();
    var ids = get_id_selection();
    var promises = []
    // compile promises
    ids.forEach(id => {
        let endpoint = `${manufacturers_endpoint}${id}`;
        console.log(`API DELETE ${endpoint}`);
        promises.push(
            $.ajax({
                url: endpoint,
                type: 'DELETE',
                dataType: 'json',
                success: function() {},
                error: function(response) {
                    console.log(response);
                    console.error("API request failed");
                    alert("API Request Failed");
                }
            })
        );
    })
    console.log("Promises: ", promises);
    Promise.all(promises).then( () => {
        get_state();
    })
}