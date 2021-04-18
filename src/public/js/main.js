// DOM Ready
$(() => {
    console.log("Hello");
    // $('#supplierModal').modal(options)
    // Add supplier modal click
    $('#submitSupplier').on('click', add);
});

function add(event) {
    console.log("test");
    event.preventDefault();
    // form validation
    var error_flag = false;
    $('#addSupplier input')
    var table_content = '';
    $getJSON()
}