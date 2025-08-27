# Use lightweight Nginx
FROM nginx:alpine

# Copy website files into the Nginx web root
COPY website/ /usr/share/nginx/html

# Ensure correct permissions (world-readable)
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
 && find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Expose default HTTP port
EXPOSE 80
