// global suppliers state
const projects_endpoint = '/v1/projects/';
var $table = $('#projectsTable').bootstrapTable();
var $remove = $('#deleteProject');
var $add = $('#addProject');
var $edit = $('#editProject');
var $post = $('#post');
var $put = $('#put');
var selections = [];
var projects = [];

// DOM Ready
$(() => {
    $('#nav-item-projects').addClass('active');
    $add.on('click', add);
    $post.on('click', post_project);
    $edit.on('click', edit); 
    $put.on('click', put_project);
    $remove.on('click', delete_project);
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
    console.log("Projects DOM Ready");
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
    console.log("Fetching project table state");
    console.log(`API GET ${projects_endpoint}`);
    $.get({
        url: projects_endpoint
    }).then((data) => {
        // update global state
        projects = data.reverse();
        console.log("Response: ", projects);
        // inject html for table use load for event listener
        // temp timeout for load wheel debug
        setTimeout(() => {$table.bootstrapTable('load', projects)}, 1000);
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
    // manually reset remove and edit options since the table selections are cleared on reload
    $remove.prop('disabled', true);
    $edit.prop('disabled', true);
}

// spawn projects form modal
function add(event) {
    event.preventDefault();
    // clear inputs set button
    $('#projectForm input').each(function (index, val) {
        $(this).val('');
    });
    $('#projectForm textarea').val('');
    $post.prop("hidden", false);
    $put.prop("hidden", true);
    // set title
    $('#modalTitle').text("Add New Project");
    // spawn modal
    $('#formModal').modal();
}

function edit(event) {
    event.preventDefault();
    // inputs reflect selection
    projects.forEach(project => {
        if (project.state === true) {
            $('#projectName').val(project.name);
            $('#projectDesc').val(project.description);
        }
    });
    $post.prop("hidden", true);
    $put.prop("hidden", false);
    // set title
    $('#modalTitle').text("Edit Project");
    $('#formModal').modal();
}

// post new project
function post_project(event) {
    console.log("Validating project form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#projectForm input').each(function (index, val) {
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
    const project_payload = {
        'name': $('#projectForm #projectName').val(),
        'description': $('#projectForm #projectDesc').val()
    };
    console.log(`API POST ${projects_endpoint} with: `, {...project_payload});
    $.post({
        data: project_payload,
        url: projects_endpoint,
        dataType:'JSON'
    }).then(() => {
       // clear fields
       $('#projectForm input').val('');
       // hide modal
       $('#formModal').modal('toggle');
       // rerequest get requests
       get_state();
    }).catch(() => {
        console.error("API request failed");
        alert("API Request Failed");
    });
}

// put new project 
function put_project(event) {
    console.log("Validating project form");
    event.preventDefault();
    // basic form validation
    var error_flag = false;
    $('#projectForm input').each(function (index, val) {
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
    // start post request
    const project_payload = {
        'id': get_id_selection()[0],
        'name': $('#projectForm #projectName').val(),
        'description': $('#projectForm #projectDesc').val()
    };
    console.log(`API POST ${projects_endpoint} with: `, {...project_payload});
    $.ajax({
        type: 'PUT',
        data: project_payload,
        url: projects_endpoint,
        dataType:'JSON',
        success: () => {
            // clear fields
            $('#projectForm input').val('');
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

// delete one or more projects 
function delete_project(event) {
    event.preventDefault();
    var ids = get_id_selection();
    var promises = []
    // compile promises
    ids.forEach(id => {
        let endpoint = `${projects_endpoint}${id}`;
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