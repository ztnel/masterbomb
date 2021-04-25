// global parts state
const parts_endpoint = '/v1/parts/';
var parts = [];
var suppliers = [];
var manufacturers = [];
var $table = $('#partsTable').bootstrapTable();
var $remove = $('#deletePart');
var $add = $('#addPart');
var $edit = $('#editPart');
var $post = $('#post');
var $put = $('#put');
var selections = [];

// DOM Ready
$(() => {
    // navbar page highlight
    $('#nav-item-parts').addClass('active');
    $add.on('click', add);
    $post.on('click', post_part);
    $edit.on('click', edit); 
    $put.on('click', put_part);
    $remove.on('click', delete_part);
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
    console.log("parts DOM Ready");
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
    console.log("Fetching part table state");
    // ajax call to parts api
    console.log(`API GET ${parts_endpoint}`);
    $.get({
        url: parts_endpoint
    }).then((data) => {
        // update global state
        parts = data.reverse();
        console.log("Response: ", parts);
        let suppliers_set = new Set(), manufacturers_set = new Set();
        parts.forEach(part => {
            !part.supplier_id ? console.warn(`Supplier ID for ${part} is null, skipping.`): suppliers_set.add(part.supplier_id);
            !part.manufacturer_id ? console.warn(`Manufacturer ID for ${part} is null, skipping.`): manufacturers_set.add(part.manufacturer_id);
        });
        // update global state with supplier and manufacturers
        update_fks(suppliers_set, manufacturers_set).then( () =>{
            // replace ids in parts table with name identifiers
            console.log(suppliers);
            console.log(manufacturers);
            parts.forEach(part => {
                part.manufacturer = !is_empty(manufacturers) ? manufacturers.filter((mf) => {return (mf.id === part.manufacturer_id)})[0].name : undefined
                part.supplier = !is_empty(suppliers) ? suppliers.filter((s) => {return (s.id === part.supplier_id)})[0].name : undefined
            });
            // temp timeout for load wheel debug
            setTimeout(() => {$table.bootstrapTable('load', parts)}, 1000);
            console.log("Compiled Response: ", parts);
        });
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
    // manually reset remove and edit options since the table selections are cleared on reload
    $remove.prop('disabled', true);
    $edit.prop('disabled', true);
}

function is_empty(arr) {
    return arr === undefined || arr.length == 0;
}

async function update_fks(suppliers_set, manufacturers_set) {
    let suppliers_endpoint = '/v1/suppliers/'
    let manufacturers_endpoint = '/v1/manufacturers/'
    // compile ajax queries and end with promise.all
    let promises = []
    // fetch supplier names with id
    suppliers_set.forEach(id => {
        console.log(`API GET ${suppliers_endpoint}${id}`);
        promises.push(
            $.get({
                url: `${suppliers_endpoint}${id}`
            }).then((data) => {
                suppliers.push(data);
                console.log("Response: ", suppliers);
            }).catch(() => {
                console.error("API request failed");
            })
        );
    })
    // fetch manufacturer names with id
    manufacturers_set.forEach(id => {
        console.log(`API GET ${manufacturers_endpoint}${id}`);
        promises.push(
            $.get({
                url: `${manufacturers_endpoint}${id}`
            }).then((data) => {
                manufacturers.push(data);
                console.log("Response: ", manufacturers);
            }).catch(() => {
                console.error("API request failed");
            })
        );
    })
    return Promise.all(promises).then( () => {});
}

// spawn part form modal
function add(event) {
    event.preventDefault();
    // clear inputs set button
    $('#partForm input').each(function (index, val) {
        $(this).val('');
    });
    $post.prop("hidden", false);
    $put.prop("hidden", true);
    // set title
    $('#modalTitle').text("Add New Part");
    // spawn modal
    $('#formModal').modal();
}

function edit(event) {
    event.preventDefault();
    // inputs reflect selection
    parts.forEach(part => {
        if (part.state === true) {
            $('#partName').val(part.name);
            $('#partDesc').val(part.description);
            $('#partUnitPrice').val(part.unit_price);
        }
    });
    $post.prop("hidden", true);
    $put.prop("hidden", false);
    // set title
    $('#modalTitle').text("Edit Part");
    $('#formModal').modal();
}

// post new part
function post_part(event) {
    console.log("Validating part form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#partForm input').each(function (index, val) {
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
    const part_payload = {
        'name': $('#partForm #partName').val()
    };
    console.log(`API POST ${parts_endpoint} with: `, {...part_payload});
    $.post({
        data: part_payload,
        url: parts_endpoint,
        dataType:'JSON'
    }).then(() => {
       // clear fields
       $('#partForm input').val('');
       // hide modal
       $('#formModal').modal('toggle');
       // rerequest get requests
       get_state();
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
}

// put new part
function put_part(event) {
    console.log("Validating part form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#partForm input').each(function (index, val) {
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
    const part_payload = {
        'id': get_id_selection()[0],
        'name': $('#partForm #partName').val(),
    };
    console.log(`API POST ${parts_endpoint} with: `, {...part_payload});
    $.ajax({
        type: 'PUT',
        data: part_payload,
        url: parts_endpoint,
        dataType:'JSON',
        success: () => {
            // clear fields
            $('#partForm input').val('');
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

// delete one or more parts
function delete_part(event) {
    event.preventDefault();
    var ids = get_id_selection();
    var promises = []
    // compile promises
    ids.forEach(id => {
        let endpoint = `${parts_endpoint}${id}`;
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
                }
            })
        );
    })
    console.log("Promises: ", promises);
    Promise.all(promises).then( () => {
        get_state();
    })
}