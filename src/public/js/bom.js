// global bom state
const parts_endpoint = '/v1/parts/';
const projects_endpoint = '/v1/suppliers/'
const bom_endpoint = '/v1/bom/'
var boms = [];
var suppliers = [];
var manufacturers = [];
var $table = $('#bomsTable').bootstrapTable();
var $remove = $('#deletebom');
var $add = $('#addbom');
var $edit = $('#editbom');
var $post = $('#post');
var $put = $('#put');
var $supplier_selector = $('#supplier-picker');
var $manufacturer_selector = $('#manufacturer-picker');
var selections = [];

// DOM Ready
$(() => {
    // navbar page highlight
    $('#nav-item-boms').addClass('active');
    $add.on('click', add);
    $post.on('click', post_bom);
    $edit.on('click', edit); 
    $put.on('click', put_bom);
    $remove.on('click', delete_bom);
    $supplier_selector.selectpicker();
    $manufacturer_selector.selectpicker();
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
    console.log("boms DOM Ready");
    get_state();
});

// populate table with current state
function get_state() {
    $table.bootstrapTable('showLoading');
    console.log("Fetching bom table state");
    // ajax call to boms api
    console.log(`API GET ${boms_endpoint}`);
    $.get({
        url: boms_endpoint
    }).then((data) => {
        // update global state
        boms = data.reverse();
        console.log("Response: ", boms);
        // update global state with supplier and manufacturers
        get_fks().then( () =>{
            // replace ids in boms table with name identifiers
            boms.forEach(bom => {
                bom.manufacturer = find_match(manufacturers, bom.manufacturer_id);
                bom.supplier = find_match(suppliers, bom.supplier_id);
            });
            // temp timeout for load wheel debug
            setTimeout(() => {$table.bootstrapTable('load', boms)}, 1000);
            console.log("Compiled Response: ", boms);
            populate_selectors();
        });
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
    // manually reset remove and edit options since the table selections are cleared on reload
    $remove.prop('disabled', true);
    $edit.prop('disabled', true);
}

function find_match(arr, id) {
    if (arr === undefined || arr.length == 0 || id === null) {
        return undefined;
    }
    return arr.filter((el) => {return (el.id === id)})[0].name
}

// get the ids of all selected elements
function get_id_selection () {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    })
}

function loading_template() {
    return '<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>'
}

async function get_fks() {
    // compile ajax queries and end with promise.all
    let promises = []
    console.log(`API GET ${suppliers_endpoint}`);
    promises.push(
        $.get({
            url: `${suppliers_endpoint}`
        }).then((data) => {
            suppliers = data;
            console.log("Response: ", suppliers);
        }).catch(() => {
            console.error("API request failed");
        })
    );
    console.log(`API GET ${manufacturers_endpoint}`);
    promises.push(
        $.get({
            url: `${manufacturers_endpoint}`
        }).then((data) => {
            manufacturers = data;
            console.log("Response: ", manufacturers);
        }).catch(() => {
            console.error("API request failed");
        })
    );
    return Promise.all(promises);
}

// spawn bom form modal
function add(event) {
    event.preventDefault();
    // clear inputs set button
    $('#bomForm input').each(function (index, val) {
        $(this).val('');
    });
    $post.prop("hidden", false);
    $put.prop("hidden", true);
    // set title
    $('#modalTitle').text("Add New bom");
    // spawn modal
    $('#formModal').modal();
}

function edit(event) {
    event.preventDefault();
    // inputs reflect selection
    boms.forEach(bom => {
        if (bom.state === true) {
            $('#bomName').val(bom.name);
            $('#bomDesc').val(bom.description);
            $('#bomUnitPrice').val(bom.unit_price);
            $manufacturer_selector.val(bom.manufacturer_id);
            $supplier_selector.val(bom.supplier_id);
        }
    });
    $manufacturer_selector.selectpicker('refresh');
    $supplier_selector.selectpicker('refresh');
    $post.prop("hidden", true);
    $put.prop("hidden", false);
    // set title
    $('#modalTitle').text("Edit bom");
    $('#formModal').modal();
}

function populate_selectors() {
    // clear selectors
    $supplier_selector.empty('#supplier-picker');
    $manufacturer_selector.empty('#manufacturer-picker');
    // populate select pickers
    for (let idx in suppliers) {
       $supplier_selector.append($('<option />').val(suppliers[idx].id).text(suppliers[idx].name));
    }
    for (let idx in manufacturers) {
       $manufacturer_selector.append($('<option />').val(manufacturers[idx].id).text(manufacturers[idx].name));
    }
    $supplier_selector.selectpicker(); 
    $manufacturer_selector.selectpicker(); 
    $supplier_selector.selectpicker('refresh');
    $manufacturer_selector.selectpicker('refresh');
}

// post new bom
function post_bom(event) {
    console.log("Validating bom form");
    event.preventDefault();
    // basic form validation
    // var error_flag = false;
    // $('#bomForm input').each(function (index, val) {
    //     if ($(this).val() === '') {
    //         error_flag = true;
    //     }
    // });
    // if (!$('#supplier-picker').val()) {
    //     error_flag = true;
    // }
    // if (error_flag == true) {
    //     console.error("Validation failed");
    //     alert("Enter all required fields");
    //     return false;
    // }
    // start post request
    const bom_payload = {
        'name': $('#bomForm #bomName').val(),
        'description': $('#bomForm #bomDesc').val(),
        'manufacturer_id': $('#bomForm #manufacturer-picker').val(),
        'supplier_id': $('#bomForm #supplier-picker').val(),
        'unit_price': $('#bomForm #bomUnitPrice').val()
    };
    console.log(`API POST ${boms_endpoint} with: `, {...bom_payload});
    $.post({
        data: bom_payload,
        url: boms_endpoint,
        dataType:'JSON'
    }).then(() => {
       // clear fields
       $('#bomForm input').val('');
       $('#bomForm textarea').val('');
       $manufacturer_selector.selectpicker();
       $supplier_selector.selectpicker();
       // hide modal
       $('#formModal').modal('toggle');
       // rerequest get requests
       get_state();
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
}

// put new bom
function put_bom(event) {
    console.log("Validating bom form");
    event.preventDefault();
    // basic form validation
    // var error_flag = false;
    // $('#bomForm input').each(function (index, val) {
    //     if ($(this).val() === '') {
    //         error_flag = true;
    //     }
    // });
    // if (error_flag == true) {
    //     console.error("Validation failed");
    //     alert("Enter all required fields");
    //     return false;
    // }
    // here only a single id field can be selected so this getter is safe
    const bom_payload = {
        'id': get_id_selection()[0],
        'name': $('#bomForm #bomName').val(),
        'description': $('#bomForm #bomDesc').val(),
        'manufacturer_id': $('#bomForm #manufacturer-picker').val(),
        'supplier_id': $('#bomForm #supplier-picker').val(),
        'unit_price': $('#bomForm #bomUnitPrice').val()
    };
    console.log(`API POST ${boms_endpoint} with: `, {...bom_payload});
    $.ajax({
        type: 'PUT',
        data: bom_payload,
        url: boms_endpoint,
        dataType:'JSON',
        success: () => {
            // clear fields
            $('#bomForm input').val('');
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

// delete one or more boms
function delete_bom(event) {
    event.preventDefault();
    var ids = get_id_selection();
    var promises = []
    // compile promises
    ids.forEach(id => {
        let endpoint = `${boms_endpoint}${id}`;
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