# Dockerfile
FROM mysql:latest



# Set environment variables
ENV MYSQL_ROOT_PASSWORD=sahihi_mysql_password
ENV MYSQL_DATABASE=sahihi_mysql_database
ENV MYSQL_USER=sahihi_mysql_user
ENV MYSQL_PASSWORD=sahihi_mysql_password

# # Copy the custom entrypoint script into the container
# COPY docker-entrypoint.sh /docker-entrypoint.sh

# # Make the custom entrypoint script executable
# RUN chmod +x /docker-entrypoint.sh

# ENTRYPOINT ["/docker-entrypoint.sh"]

# Expose the MySQL port
EXPOSE 3306