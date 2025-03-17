        // Handle login form submission
        $(document).ready(function() {
            $('#login-form').on('submit', function(event) {
                event.preventDefault(); // Prevent normal form submission

                // Get login data
                const loginData = {
                    username: $('#login-username').val(),
                    password: $('#login-password').val(),
                };

                // Simple frontend validation for login
                if (!loginData.username || !loginData.password) {
                    $('#login-error-message').text('Both fields are required.').show();
                    return;
                }

                // Clear any previous error messages
                $('#login-error-message').hide();

                // Send login data to the server for validation
                $.ajax({
                    url: '/admin_create_login', // Backend route to validate login
                    type: 'POST',
                    data: loginData,
                    success: function(response) {
                        // Hide login form and show signup form if login is successful
                        $('#admin-login-form').hide();
                        $('#admin-signup-form').show();
                    },
                    error: function(xhr, status, error) {
                        $('#login-error-message').text('Invalid credentials or insufficient permissions.').show();
                    }
                });
            });

            // Handle signup form submission
            $('#signup-form').on('submit', function(event) {
                event.preventDefault(); // Prevent normal form submission

                // Get signup data
                const formData = {
                    name: $('#name').val(),
                    phone: $('#phone').val(),
                    username: $('#username').val(),
                    password: $('#password').val(),
                    role: $('#role').val(),
                };

                // Simple frontend validation
                if (!formData.name || !formData.phone || !formData.username || !formData.password || !formData.role) {
                    $('#error-message').text('All fields are required.').show();
                    return;
                }

                // Clear any previous error messages
                $('#error-message').hide();

                // Send data to the server via AJAX for account creation
                $.ajax({
                    url: '/create', // Backend route to handle signup
                    type: 'POST',
                    data: formData,
                    success: function(response) {
                        $('#success-message').text('Admin created successfully.').show();
                    },
                    error: function(xhr, status, error) {
                        $('#error-message').text('An error occurred. Please try again.').show();
                    }
                });
            });
        });