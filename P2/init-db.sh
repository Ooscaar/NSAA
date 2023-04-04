## Init sqlite db
#!/bin/bash

set -e
set -u
set -x

DB=users.db

if [ -f $DB ]; then
    echo "Database already exists"
    exit 1
fi

sqlite3 $DB <<EOF
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);
EOF

echo "Database created"
