#!/bin/bash

# Create init SQL with environment variables
echo "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%' WITH GRANT OPTION;" > /docker-entrypoint-initdb.d/init.sql
echo "FLUSH PRIVILEGES;" >> /docker-entrypoint-initdb.d/init.sql

# Run the original entrypoint for MySQL
exec docker-entrypoint.sh "$@"