// global suppliers state
const suppliers_endpoint = '/v1/suppliers/';
let suppliers = [];


// DOM Ready
$(() => {
    console.log("Suppliers DOM Ready");
    // Add supplier modal click
    $('#addSupplier').on('click', add);
    $('#postSupplier').on('click', post);
});

// populate table with current state
function getState() {
    // ajax call to suppliers api
    $.get(url=suppliers_endpoint, (data) => {

    });
    // pass table html to
}

// spawn supplier form modal
function add(event) {
    console.log("test");
    event.preventDefault();
    $('#supplierModal').modal();
}

// post new supplier
function post(event) {
    console.log("Validating supplier form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#supplierForm input').each(function(index, val) {
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
       // hide modal
       // rerequest get requests
    }).catch(() => {
        alert("API Request Failed");
    })
}